from typing import List
from datetime import date
from .schemas import TimelineEventCreate

class InvestigatorAgent:
    def __init__(self):
        # In the future, initialize LLM clients here (OpenAI, Gemini, etc.)
        pass

    def search_events(self, interests: List[str]) -> List[TimelineEventCreate]:
        """
        Searches for historical or future events related to the given interests.
        Returns a list of TimelineEventCreate objects.
        """
        events = []
        
        # MOCK LOGIC - To be replaced with real LLM/Search API
        print(f"Investigator searching for: {interests}")
        
        for interest in interests:
            if interest.lower() == "benfica":
                events.append(TimelineEventCreate(
                    date=date(1904, 2, 28),
                    title="Fundação do SL Benfica",
                    content="O Sport Lisboa e Benfica foi fundado em Lisboa.",
                    event_type="historical",
                    source="investigator_ai",
                    user_id=0 # Placeholder, needs to be assigned to the correct user
                ))
            elif interest.lower() == "u2":
                events.append(TimelineEventCreate(
                    date=date(1976, 9, 25),
                    title="Formação dos U2",
                    content="A banda U2 formou-se em Dublin, Irlanda.",
                    event_type="historical",
                    source="investigator_ai",
                    user_id=0
                ))
                
        return events

investigator = InvestigatorAgent()
