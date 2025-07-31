import React from 'react';

interface XPBarProps {
    currentXp: number;
    nextLevelXp: number;
    level: number;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXp, nextLevelXp, level }) => {
    const progressPercentage = nextLevelXp > 0 ? (currentXp / nextLevelXp) * 100 : 0;

    return (
        <div>
            <div className="xp-bar-text" style={{position: 'static', padding: 0, mixBlendMode: 'normal', color: 'var(--text-secondary)'}}>
                 <span>Level {level}</span>
                 <span>{currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
            </div>
            <div className="xp-bar" title={`Level ${level} Progress`}>
                <div 
                    className="xp-bar-fill" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};