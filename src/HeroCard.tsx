import { Hero } from './types';
import './HeroCard.css';
import { useState } from 'react';
import { formatTime } from './util';

interface HeroCardProps {
  hero: Hero;
  isEliminated: boolean;
  elimTime?: number;
  onClick?: () => void;
}

export const HeroCard = (props: HeroCardProps) => {
  const { hero, isEliminated, elimTime, onClick } = props;
  return (
    <div className="hero-card" data-eliminated={isEliminated} onClick={onClick}>
      <div className="profile-image-container">
        <img src={hero.profileImage || 'placeholder.png'} alt={hero.name} />
      </div>
      <div className="info">
        <h2 className="name">{hero.name}</h2>
        <h3 className="team">{hero.team}</h3>
        <h3 className='elim'>{isEliminated  ? `Time: ${formatTime(elimTime || 0)}` : '_'}</h3>
      </div>
    </div>
  );
}

interface HeroCardEditableProps {
  hero: Hero;
  onFieldEdit: (field: keyof Hero, value: string) => void;
  onRemove: () => void;
}

export const HeroCardEditable = (props: HeroCardEditableProps) => {
  const { hero, onFieldEdit, onRemove } = props;

  const [name, setName] = useState(hero.name);
  const [team, setTeam] = useState(hero.team);

  const [$fileInput, setFileInput] = useState<HTMLInputElement|null>();

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onTeamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam(event.target.value);
  };
    
  const loadFile = (e: any) => {
    if(e?.target?.files?.length > 0) {
      const reader = new FileReader();
      reader.onload = function(){
        const dataURL = reader.result;
        const data = dataURL?.toString();
        if (data) {
          onFieldEdit('profileImage', data);
        }
      };
      reader.readAsDataURL(e.target.files[0]);  
    }
  };
  
  const triggerFile = () => {
    if($fileInput) {
      $fileInput.click();
    }
  };

  const saveName = () => {
    onFieldEdit('name', name);
  };

  const saveTeam = () => {
    onFieldEdit('team', team);
  };

  return (
    <div className="hero-card editable">
      <div className="profile-image-container" onClick={triggerFile}>
        <img src={hero.profileImage || '/placeholder.png'} alt={hero.name} />
        <input
          type="file"
          accept=".jpg, .png"
          ref={x => setFileInput(x)}
          onChange={loadFile}
          className="hidden"
        /> 
      </div>
      <div className="info">
        <h2 className="name"><input onChange={onNameChange} onBlur={saveName} value={name}/></h2>
        <h3 className="team"><input onChange={onTeamChange} onBlur={saveTeam} value={team}/></h3>
        <h3 className='elim'></h3>
      </div>
      <button className="remove" onClick={onRemove}></button>
    </div>
  );
}