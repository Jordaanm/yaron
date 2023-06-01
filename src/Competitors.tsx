import { useState, useEffect, useCallback, useContext } from "react";
import { Hero } from "./types";
import { HeroCard, HeroCardEditable } from "./HeroCard";

import './Competitors.css';
import { TimerContext } from "./contexts/timer-context";
const NewHeroTemplate: Hero = {
  name: 'Name',
  team: 'Team',
  profileImage: '',    
};

const saveCompetitorsToLocalStorage = (competitors: Hero[]) => {
  localStorage.setItem('competitors', JSON.stringify(competitors));
}

export const Competitors = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [competitors, setCompetitors] = useState<Hero[]>([]);
  const [eliminated, setEliminated] = useState<Map<string, number>>(new Map<string, number>());
  const { duration } = useContext(TimerContext);

  useEffect(() => {
    const competitorsFromLocalStorageStr = localStorage.getItem('competitors');
    if(competitorsFromLocalStorageStr) {
      const competitorsFromLocalStorage = JSON.parse(competitorsFromLocalStorageStr) as Hero[];
      setCompetitors(competitorsFromLocalStorage);
    } else {
      setCompetitors([NewHeroTemplate]);
    }
  }, []);

  
  const toggleEliminated = useCallback((name: string) => {
    if(eliminated.has(name)) {
      eliminated.delete(name);
      
      setEliminated(new Map(eliminated));
    } else {
      eliminated.set(name, duration);
      setEliminated(new Map(eliminated));
    }
  }, [eliminated, duration]);

  const toggleIsEditing = () => {
    setIsEditing(isEditing => !isEditing);
  };

  const updateCompetitorField = (index: number) => (field: keyof Hero, value: string) => {
    setCompetitors(competitors => {
      const newCompetitors = [...competitors];
      newCompetitors[index] = {
        ...newCompetitors[index],
        [field]: value
      };

      saveCompetitorsToLocalStorage(newCompetitors);
      return newCompetitors;
    });
  };

  const addNewCompetitor = () => {
    const newCompetitors = [...competitors, {...NewHeroTemplate}];
    setCompetitors(newCompetitors);
    saveCompetitorsToLocalStorage(newCompetitors);
  };

  const removeCompetitor = (index: number) => {
    const newCompetitors = [...competitors];
    newCompetitors.splice(index, 1);
    setCompetitors(newCompetitors);
    saveCompetitorsToLocalStorage(newCompetitors);
  };

  return (
    <div className="competitors">
      <div className="title-row">
        <h2 className="title">Competitors</h2>
        <div className="actions">
          <button className={`edit ${isEditing ? 'active' : 'inactive'}`} onClick={() => toggleIsEditing()}></button>
        </div>
      </div>
      <div className="hero-card-grid">
        {competitors.map((hero, index) => {
          if(isEditing) {
            return <HeroCardEditable 
              key={`edit-${hero.name}-${index}`} 
              hero={hero} 
              onFieldEdit={updateCompetitorField(index)}
              onRemove={() => removeCompetitor(index)}
            />;
          } else {
            return <HeroCard key={`${hero.name}-${index}`} hero={hero} isEliminated={eliminated.has(hero.name)} elimTime={eliminated.get(hero.name)} onClick={() => toggleEliminated(hero.name)} />
          }
        })}
        {isEditing && <div className="add-new-wrapper">
          <button className="add-hero" onClick={addNewCompetitor}></button>
        </div>}
      </div>
    </div>
  )
}