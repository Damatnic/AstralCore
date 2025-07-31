import React, { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '../utils/ApiClient';
import { ModerationAction } from '../types';
import { formatTimeAgo } from '../utils/formatTimeAgo';

export const ModerationHistoryView: React.FC<{ userId: string | null; }> = ({ userId }) => {
    const [history, setHistory] = useState<ModerationAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const actions = await ApiClient.moderation.getHistory(userId);
            setHistory(actions);
        } catch (error) {
            console.error("Failed to fetch moderation history:", error);
            alert("Could not load your moderation history.");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return (
        <>
            <div className="view-header">
                <h1>Moderation History</h1>
                <p className="view-subheader">A log of moderation actions related to your account and content.</p>
            </div>
            <div className="card">
                {isLoading ? (
                    <div className="loading-spinner" style={{ margin: '3rem auto' }}></div>
                ) : history.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {history.map(action => (
                            <li key={action.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                                <h3 style={{ fontSize: '1.1rem' }}>{action.action}</h3>
                                <p style={{ margin: '0.5rem 0', color: 'var(--secondary-text)' }}>{action.reason}</p>
                                <small>Date: {formatTimeAgo(action.timestamp)}</small>
                                {action.relatedContentId && <small> • Content ID: {action.relatedContentId.substring(0, 12)}...</small>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have no moderation history. Keep up the positive contributions!</p>
                )}
            </div>
        </>
    );
};
