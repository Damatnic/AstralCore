import React from 'react';
import { Card } from './Card';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    message: string;
    children?: React.ReactNode; // For optional action buttons
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, children }) => {
    return (
        <div className="empty-state-container">
            {icon && <div className="empty-state-icon">{icon}</div>}
            <h2 className="empty-state-title">{title}</h2>
            <p className="empty-state-message">{message}</p>
            {children && <div className="empty-state-actions">{children}</div>}
        </div>
    );
};
