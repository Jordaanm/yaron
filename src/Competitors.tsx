import { useState, useEffect, useCallback } from "react";
import { Hero } from "./types";
import { HeroCard, HeroCardEditable } from "./HeroCard";

import './Competitors.css';
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
  const [eliminated, setEliminated] = useState<string[]>([]);

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
    if(eliminated.includes(name)) {
      setEliminated(eliminated => eliminated.filter(eliminatedName => eliminatedName !== name));
    } else {
      setEliminated(eliminated => [...eliminated, name]);
    }
  }, [eliminated]);

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
            return <HeroCard key={`${hero.name}-${index}`} hero={hero} isEliminated={eliminated.includes(hero.name)} onClick={() => toggleEliminated(hero.name)} />
          }
        })}
        {isEditing && <div className="add-new-wrapper">
          <button className="add-hero" onClick={addNewCompetitor}></button>
        </div>}
      </div>
    </div>
  )
}