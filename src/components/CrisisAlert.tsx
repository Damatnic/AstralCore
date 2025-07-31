import React from 'react';
import { CrisisIcon } from './icons';

export const CrisisAlert = () => (
    <div className="crisis-alert" role="alert">
        <div className="crisis-icon-wrapper"><CrisisIcon /></div>
        <div className="crisis-content">
            <h3>Immediate Support Is Available</h3>
            <p>It seems like you're going through a very difficult time. Please consider reaching out to a professional for immediate support. You are not alone.</p>
        </div>
    </div>
);
