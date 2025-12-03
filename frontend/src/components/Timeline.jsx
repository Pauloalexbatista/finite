import React, { useMemo, useState } from 'react';

const Timeline = ({ dob }) => {
    const [expandedYear, setExpandedYear] = useState(null);
    const [expandedMonth, setExpandedMonth] = useState(null);

    const birthDate = useMemo(() => dob ? new Date(dob) : null, [dob]);

    const timelineData = useMemo(() => {
        if (!birthDate) return [];

        const currentYear = new Date().getFullYear();
        const lifespan = 100;
        const years = [];

        for (let i = 0; i <= lifespan; i++) {
            const year = birthDate.getFullYear() + i;
            const isPast = year < currentYear;
            const isCurrent = year === currentYear;

            years.push({
                age: i,
                year: year,
                isPast,
                isCurrent
            });
        }
        return years;
    }, [birthDate]);

    const getMonths = (year) => {
        const startMonth = (year === birthDate.getFullYear()) ? birthDate.getMonth() : 0;

        return Array.from({ length: 12 }, (_, i) => {
            if (i < startMonth) return null; // Skip months before birth

            const date = new Date(year, i, 1);
            return {
                index: i,
                name: date.toLocaleString('default', { month: 'long' }),
                daysInMonth: new Date(year, i + 1, 0).getDate()
            };
        }).filter(Boolean);
    };

    const getDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const oneDay = 24 * 60 * 60 * 1000;

        const startDay = (year === birthDate.getFullYear() && month === birthDate.getMonth()) ? birthDate.getDate() : 1;

        return Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            if (dayNum < startDay) return null; // Skip days before birth

            const date = new Date(year, month, dayNum);
            // Calculate days from birth (Day 1 = DOB)
            // We use Math.floor to get full days passed, then +1 so DOB is Day 1
            const diffTime = date.getTime() - birthDate.getTime();
            const daysFromBirth = Math.floor(diffTime / oneDay) + 1;

            // Format Date: DD/MM/YYYY
            const dayStr = String(date.getDate()).padStart(2, '0');
            const monthStr = String(date.getMonth() + 1).padStart(2, '0');
            const dateString = `${dayStr}/${monthStr}/${year}`;

            return {
                day: dayNum,
                dateString,
                daysFromBirth
            };
        }).filter(Boolean);
    };

    const handleYearClick = (year) => {
        if (expandedYear === year) {
            setExpandedYear(null);
            setExpandedMonth(null);
        } else {
            setExpandedYear(year);
            setExpandedMonth(null);
        }
    };

    const handleMonthClick = (e, monthIndex) => {
        e.stopPropagation();
        if (expandedMonth === monthIndex) {
            setExpandedMonth(null);
        } else {
            setExpandedMonth(monthIndex);
        }
    };

    if (!dob) return null;

    return (
        <div style={{
            position: 'relative', // Changed from absolute to flow naturally
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            fontFamily: "'Inter', sans-serif",
            paddingBottom: '50px',
            marginTop: '20px', // Small gap from header
            paddingLeft: '40px' // Match header padding
        }}>
            <style>
                {`div::-webkit-scrollbar { display: none; }`}
            </style>

            <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {timelineData.map((item) => (
                    <div key={item.year} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

                        {/* YEAR ROW */}
                        <div
                            onClick={() => handleYearClick(item.year)}
                            style={{
                                width: '100%',
                                padding: '5px 0', // Reduced padding
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                opacity: item.isCurrent ? 1 : (item.isPast ? 0.5 : 0.3),
                                fontWeight: item.isCurrent || expandedYear === item.year ? 600 : 300,
                                fontSize: '1rem',
                                color: '#333',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <span style={{ minWidth: '100px' }}>{item.year}</span>
                            <span style={{ fontSize: '0.8rem', marginLeft: '10px', fontWeight: 300 }}>({item.age} anos)</span>
                        </div>

                        {/* MONTHS (Expanded) */}
                        {expandedYear === item.year && (
                            <div style={{ width: '100%', paddingLeft: '20px', borderLeft: '1px solid rgba(0,0,0,0.1)' }}>
                                {getMonths(item.year).map((month) => (
                                    <div key={month.index} style={{ width: '100%' }}>
                                        <div
                                            onClick={(e) => handleMonthClick(e, month.index)}
                                            style={{
                                                padding: '5px 0',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: 400,
                                                color: '#555',
                                                textTransform: 'capitalize',
                                                paddingLeft: '20px'
                                            }}
                                        >
                                            {month.name}
                                        </div>

                                        {/* DAYS (Expanded) */}
                                        {expandedMonth === month.index && (
                                            <div style={{ paddingLeft: '20px', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
                                                {getDays(item.year, month.index).map((day) => (
                                                    <div key={day.day} style={{
                                                        padding: '2px 0',
                                                        fontSize: '0.8rem',
                                                        color: '#777',
                                                        display: 'flex',
                                                        gap: '15px'
                                                    }}>
                                                        <span style={{ minWidth: '80px' }}>{day.dateString}</span>
                                                        <span>dia {day.daysFromBirth}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
