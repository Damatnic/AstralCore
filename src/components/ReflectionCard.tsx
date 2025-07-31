

import React from 'react';
import { Reflection } from '../types';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import { SparkleIcon } from './icons'; 
import { AppButton } from './AppButton';

export const ReflectionCard: React.FC<{ 
    reflection: Reflection;
    onReact: (reflectionId: string, reactionType: string) => void;
}> = ({ reflection, onReact }) => {
    const getColorIndex = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 8);
    };

    const totalReactions = Object.values(reflection.reactions).reduce((sum, count) => sum + count, 0);

    return (
        <div className="reflection-card">
            <div className="reflection-header">
                <div className={`avatar avatar-color-${getColorIndex(reflection.userToken)}`}>
                     <SparkleIcon />
                </div>
                <div className="reflection-meta">
                    <span>Anonymous Reflection</span>
                    <span className="reflection-timestamp">{formatTimeAgo(reflection.timestamp)}</span>
                </div>
            </div>
            <p className="reflection-content">"{reflection.content}"</p>
            <div className="reflection-actions">
                <AppButton 
                    variant="secondary" 
                    className={`btn-sm btn-support ${reflection.myReaction ? 'supported' : ''}`}
                    onClick={() => onReact(reflection.id, 'light')}
                >
                    <SparkleIcon />
                    <span>Send Light</span>
                    <span className="support-count">{totalReactions > 0 ? totalReactions : ''}</span>
                </AppButton>
            </div>
        </div>
    );
};