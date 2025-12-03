import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, MeshDistortMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated, config } from '@react-spring/three';
import Timeline from './Timeline';

// --- UTILS ---

const calculateLifeBattery = (dob) => {
    if (!dob) return { percent: 0, label: 'N/A', daysLived: 0, totalDays: 0 };

    const birthDate = new Date(dob);
    const now = new Date();

    // Lifespan set to 100 years as per user request
    const lifespanYears = 100;
    const lifespanMs = lifespanYears * 365.25 * 24 * 60 * 60 * 1000;
    const totalDays = Math.floor(lifespanMs / (24 * 60 * 60 * 1000));

    const ageMs = now.getTime() - birthDate.getTime();
    const remainingMs = lifespanMs - ageMs;

    const percent = Math.max(0, Math.min(100, (remainingMs / lifespanMs) * 100));
    const daysLived = Math.floor(ageMs / (24 * 60 * 60 * 1000));

    return {
        percent: percent.toFixed(0),
        label: `${percent.toFixed(0)}%`,
        daysLived: daysLived.toLocaleString(),
        totalDays: totalDays.toLocaleString()
    };
};

// --- UI COMPONENTS (INSIDE BUBBLE) ---

const RegistrationForm = ({ onComplete }) => {
    const [step, setStep] = useState(0); // 0: Name, 1: Email, 2: DOB, 3: Ready
    const [formData, setFormData] = useState({ name: '', email: '', dob: '' });
    const [fade, setFade] = useState(true);

    const handleNext = (field, value) => {
        setFade(false);
        setTimeout(() => {
            setFormData({ ...formData, [field]: value });
            setStep(step + 1);
            setFade(true);
        }, 500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete(formData);
    };

    const containerStyle = {
        color: '#333',
        textAlign: 'center',
        width: '160px', // Reduced width
        fontFamily: "'Inter', sans-serif",
        opacity: fade ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'auto',
        userSelect: 'none'
    };

    const inputStyle = {
        background: 'rgba(0,0,0,0)', // Explicitly transparent
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: 'none',
        fontSize: '0.6rem', // Small font
        textAlign: 'center',
        outline: 'none',
        padding: '5px',
        width: '100%',
        color: '#333',
        marginBottom: '8px',
        fontFamily: "'Inter', sans-serif",
        caretColor: '#333',
        fontWeight: 300,
        // Hack to remove autofill background
        transition: 'background-color 5000s ease-in-out 0s',
        WebkitTextFillColor: '#333',
    };

    const headerStyle = {
        fontWeight: 300,
        marginBottom: '8px',
        fontSize: '0.7rem',
        letterSpacing: '0.05rem'
    };

    const buttonStyle = {
        background: 'transparent',
        color: '#333',
        border: '1px solid #333',
        padding: '4px 10px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '0.6rem',
        marginTop: '5px',
        transition: 'all 0.3s ease'
    };

    return (
        <div style={containerStyle}>
            {/* Inject CSS for autofill hack */}
            <style>
                {`
                    input:-webkit-autofill,
                    input:-webkit-autofill:hover, 
                    input:-webkit-autofill:focus, 
                    input:-webkit-autofill:active {
                        transition: background-color 5000s ease-in-out 0s;
                        -webkit-text-fill-color: #333 !important;
                    }
                `}
            </style>
            {step === 0 && (
                <form onSubmit={(e) => { e.preventDefault(); handleNext('name', e.target.elements.name.value); }}>
                    <h2 style={headerStyle}>Olá. Quem és tu?</h2>
                    <input name="name" style={inputStyle} placeholder="Nome" autoFocus autoComplete="off" />
                </form>
            )}
            {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); handleNext('email', e.target.elements.email.value); }}>
                    <h2 style={headerStyle}>Prazer, {formData.name}.<br />O teu email?</h2>
                    <input name="email" type="email" style={inputStyle} placeholder="email@..." autoFocus autoComplete="off" />
                </form>
            )}
            {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); handleNext('dob', e.target.elements.dob.value); }}>
                    <h2 style={headerStyle}>Quando nasceste?</h2>
                    <input name="dob" type="date" style={inputStyle} autoFocus />
                    <button type="submit" style={buttonStyle}>Continuar</button>
                </form>
            )}
            {step === 3 && (
                <div>
                    <h2 style={headerStyle}>Tudo pronto.</h2>
                    <p style={{ marginBottom: '10px', fontSize: '0.6rem', fontWeight: 300 }}>Vamos entrar na tua história.</p>
                    <button onClick={handleSubmit} style={{ ...buttonStyle, background: '#333', color: '#fff' }}>
                        ENTRAR
                    </button>
                </div>
            )}
        </div>
    );
};

// --- 3D COMPONENTS ---

const Bubble = ({ appState, setAppState, onRegister }) => {
    const groupRef = useRef();
    const meshRef = useRef();
    const { mouse } = useThree();

    // Handle click on bubble
    const handleClick = (e) => {
        e.stopPropagation();
        if (appState === 'IDLE') {
            setAppState('FORM');
        }
    };

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            // Gentle float
            groupRef.current.position.y = Math.sin(time / 2) * 0.2;

            // Mouse reaction (only in IDLE)
            if (appState === 'IDLE') {
                groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.x * 0.5, 0.05);
                groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouse.y * 0.5 + Math.sin(time / 2) * 0.2, 0.05);
            }
        }

        if (meshRef.current) {
            meshRef.current.rotation.z = time * 0.1;
            meshRef.current.rotation.x = time * 0.05;
        }
    });

    // Animation for zooming/state changes
    const { scale, opacity } = useSpring({
        scale: appState === 'APP' ? 20 : (appState === 'FORM' ? 4 : 2.8),
        opacity: appState === 'APP' ? 0 : 1,
        config: config.molasses
    });

    return (
        <animated.group ref={groupRef} scale={scale}>
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={() => document.body.style.cursor = appState === 'IDLE' ? 'pointer' : 'auto'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <sphereGeometry args={[1.5, 64, 64]} />
                <MeshDistortMaterial
                    color="#ffffff"
                    attach="material"
                    distort={0.5}
                    speed={2}
                    roughness={0}
                    metalness={0.1}
                    transmission={0.1}
                    thickness={1.5}
                    ior={1.5}
                    opacity={0.8}
                    transparent
                    iridescence={1}
                    iridescenceIOR={1.33}
                    iridescenceThicknessRange={[0, 1000]}
                />
            </mesh>

            {/* Form appears ONLY in FORM state */}
            {appState === 'FORM' && (
                <Html position={[0, 0, 0]} center transform style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
                    <div style={{ pointerEvents: 'auto' }}>
                        <RegistrationForm onComplete={onRegister} />
                    </div>
                </Html>
            )}
        </animated.group>
    );
};

const MainAppPlaceholder = ({ userData }) => {
    const battery = calculateLifeBattery(userData?.dob);

    // Format DOB for display (DD/MM/YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return '00/00/0000';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <Html fullscreen style={{ pointerEvents: 'none' }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                padding: '40px',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    width: '100%',
                    fontFamily: "'Inter', sans-serif",
                    color: '#333',
                    pointerEvents: 'auto',
                    borderBottom: '1px solid #ccc', // Added line as per image
                    paddingBottom: '10px',
                    marginBottom: '20px'
                }}>
                    {/* Left: DOB & Name */}
                    <div style={{ textAlign: 'left', display: 'flex', gap: '30px', alignItems: 'baseline' }}>
                        <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 300 }}>
                            {formatDate(userData?.dob)}
                        </p>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 400, margin: 0 }}>
                            {userData?.name || 'User'}
                        </h2>
                    </div>

                    {/* Center: Title */}
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '400',
                        margin: 0,
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: '0px' // Move to top of container
                    }}>
                        OneLife
                    </h1>

                    {/* Right: Days Lived / Total, Battery, %, Email */}
                    <div style={{ textAlign: 'right', display: 'flex', gap: '15px', alignItems: 'center' }}>

                        {/* Days Counter */}
                        <span style={{ fontSize: '0.8rem', fontWeight: 300 }}>
                            dia {battery.daysLived} / {battery.totalDays}
                        </span>

                        {/* Battery & Percent */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Battery Icon */}
                            <div style={{
                                width: '24px',
                                height: '12px',
                                border: '1px solid #333',
                                borderRadius: '2px',
                                padding: '1px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {/* Fill */}
                                <div style={{
                                    width: `${battery.percent}%`,
                                    height: '100%',
                                    backgroundColor: '#333',
                                    borderRadius: '1px',
                                    transition: 'width 0.5s ease'
                                }} />
                                {/* Terminal */}
                                <div style={{
                                    position: 'absolute',
                                    right: '-3px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '2px',
                                    height: '6px',
                                    backgroundColor: '#333',
                                    borderTopRightRadius: '1px',
                                    borderBottomRightRadius: '1px'
                                }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 300 }}>{battery.percent}%</span>
                        </div>

                        {/* Email */}
                        <p style={{ fontSize: '0.8rem', margin: 0, fontWeight: 300, textDecoration: 'underline', color: '#666' }}>
                            {userData?.email || 'email@example.com'}
                        </p>
                    </div>
                </div>

                {/* Timeline Container */}
                <div style={{ flex: 1, position: 'relative', pointerEvents: 'auto' }}>
                    <Timeline dob={userData?.dob} />
                </div>
            </div>
        </Html>
    );
};

const BubbleScene = () => {
    // DEV MODE: Default to 'APP' and dummy user to avoid re-registering on refresh
    const [appState, setAppState] = useState('APP'); // Was 'IDLE'
    const [userData, setUserData] = useState({
        name: 'Paulo Batista',
        email: 'pauloalexbatista@gmail.com',
        dob: '1974-07-23'
    });

    const handleRegistrationComplete = (data) => {
        console.log("User Registered:", data);
        setUserData(data);
        setAppState('APP');
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#ffffff', overflow: 'hidden' }}>

            {/* Header - Only visible during registration/idle */}
            {appState !== 'APP' && (
                <div style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', color: '#000', fontFamily: 'sans-serif', fontSize: '0.8rem', letterSpacing: '0.3rem', opacity: 0.5, zIndex: 10 }}>
                    ONELIFE
                </div>
            )}

            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Environment preset="studio" />

                {/* The Bubble Scene */}
                {appState !== 'APP_READY' && (
                    <Bubble
                        appState={appState}
                        setAppState={setAppState}
                        onRegister={handleRegistrationComplete}
                    />
                )}

                {/* The Main App */}
                {appState === 'APP' && <MainAppPlaceholder userData={userData} />}

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    );
};

export default BubbleScene;
