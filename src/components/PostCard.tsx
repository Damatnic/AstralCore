import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HeartIcon, VideoIcon, ThumbsUpIcon } from './icons';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import { Dilemma } from '../types';
import { AppButton } from './AppButton';
import { Card } from './Card';

const PostCardComponent: React.FC<{ 
    dilemma: Dilemma; 
    onToggleSupport?: (dilemmaId: string) => void; 
    onStartChat?: (dilemmaId: string) => void; 
    onStartVideoChat?: (dilemmaId: string) => void;
    onReport?: (dilemmaId: string) => void;
    onDismissReport?: (dilemmaId: string) => void;
    onRemovePost?: (dilemmaId: string) => void;
    onAcceptDilemma?: (dilemmaId: string) => void;
    onDeclineRequest?: (dilemmaId: string) => void;
    onResolve?: (dilemmaId: string) => void;
    onSummarize?: (dilemmaId: string) => void;
    hasUnread?: boolean;
    isHelperView?: boolean;
    isMyPostView?: boolean;
    filteredCategories?: string[];
    aiMatchReason?: string;
}> = ({ dilemma, onToggleSupport, onStartChat, onStartVideoChat, onReport, onDismissReport, onRemovePost, onAcceptDilemma, onDeclineRequest, onResolve, onSummarize, hasUnread, isHelperView, isMyPostView, filteredCategories = [], aiMatchReason }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const [isAnimatingSupport, setIsAnimatingSupport] = useState(false);
    
    const isFiltered = filteredCategories.includes(dilemma.category) && !isRevealed;

    useEffect(() => {
        // Reset revealed state if filtered categories change
        setIsRevealed(false);
    }, [filteredCategories]);

    const getColorIndex = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 8);
    };

    const handleSupportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (onToggleSupport && !dilemma.isSupported) {
            onToggleSupport(dilemma.id);
            setIsAnimatingSupport(true);
            setTimeout(() => setIsAnimatingSupport(false), 300); // Duration of the animation
        }
        if (onStartChat) {
            onStartChat(dilemma.id);
        }
    };

    if (isFiltered) {
        return (
            <Card className="post-card" style={{ filter: 'blur(8px)', cursor: 'pointer' }} onClick={() => setIsRevealed(true)}>
                <div className="post-header">
                    <div className="post-user-info">
                        <div className={`avatar avatar-color-${getColorIndex(dilemma.userToken)}`}></div>
                        <span className="username">Anonymous User</span>
                    </div>
                    <div className="post-meta">
                        <span className="post-category">{dilemma.category}</span>
                        <div className="post-timestamp">{formatTimeAgo(dilemma.timestamp)}</div>
                    </div>
                </div>
                 <div className="post-content markdown-content" style={{textAlign: 'center', fontWeight: 'bold', color: 'var(--text-secondary)'}}>
                    <p>Content hidden based on your filter preferences.</p>
                    <p>Click to reveal.</p>
                </div>
            </Card>
        )
    }

    const renderHelperActions = () => {
        if (dilemma.status === 'direct_request') {
            return (
                <div className="form-actions-group">
                    <AppButton variant="success" className="btn-sm" onClick={() => onAcceptDilemma?.(dilemma.id)}>Accept Request</AppButton>
                    <AppButton variant="danger" className="btn-sm" onClick={() => onDeclineRequest?.(dilemma.id)}>Decline</AppButton>
                </div>
            );
        }

        if (dilemma.status === 'in_progress') {
             return (
                <div className="form-actions-group">
                    <AppButton variant="secondary" className={`btn-sm`} onClick={() => onStartChat?.(dilemma.id)} icon={<HeartIcon />}>
                        Chat with User
                    </AppButton>
                    {onStartVideoChat && <AppButton variant="secondary" className="btn-sm" onClick={() => onStartVideoChat(dilemma.id)} icon={<VideoIcon />}>
                        Video Chat
                    </AppButton>}
                </div>
            );
        }

        if (dilemma.isReported) {
             return (
                <div className="form-actions-group">
                    <AppButton variant="danger" className="btn-sm" onClick={() => onRemovePost?.(dilemma.id)}>Remove Post</AppButton>
                    <AppButton variant="secondary" className="btn-sm" onClick={() => onDismissReport?.(dilemma.id)}>Dismiss Report</AppButton>
                </div>
            );
        }
        
        return (
            <div className="form-actions-group">
                {!dilemma.summary && (
                    <AppButton variant="ghost" className="btn-sm" onClick={() => onSummarize?.(dilemma.id)} isLoading={dilemma.summaryLoading}>
                        Summarize
                    </AppButton>
                )}
                <AppButton variant="success" className="btn-sm" onClick={() => onAcceptDilemma?.(dilemma.id)} icon={<ThumbsUpIcon />}>
                    Accept Dilemma
                </AppButton>
            </div>
        );
    }

    return (
        <Card className="post-card">
            <div className="post-header">
                <div className="post-user-info">
                    <div className={`avatar avatar-color-${getColorIndex(dilemma.userToken)}`}></div>
                    <span className="username">Anonymous User</span>
                </div>
                <div className="post-meta">
                     <span className="post-category">{dilemma.category}</span>
                     <div className="post-timestamp">{formatTimeAgo(dilemma.timestamp)}</div>
                </div>
            </div>
            {dilemma.isReported && isHelperView && (
                <div className="report-reason-display">Reported for: <strong>{dilemma.reportReason}</strong></div>
            )}
             {aiMatchReason && (
                <div className="ai-match-reason">
                    ✨ {aiMatchReason}
                </div>
            )}
            <div className="post-content markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{dilemma.content}</ReactMarkdown>
            </div>
            
            {isHelperView && dilemma.summary && (
                <div className="summary-container">
                    <h4 onClick={() => setIsSummaryVisible(!isSummaryVisible)} style={{cursor: 'pointer'}}>
                        AI Summary {isSummaryVisible ? '▼' : '►'}
                    </h4>
                    {isSummaryVisible && <div className="summary-content markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>{dilemma.summary}</ReactMarkdown></div>}
                </div>
            )}

            <div className="post-actions">
                {isHelperView ? (
                     renderHelperActions()
                ) : (
                    <div className="form-actions-group" style={{width: '100%', justifyContent: 'space-between'}}>
                        <AppButton variant="secondary" className={`btn-sm btn-support ${dilemma.isSupported ? 'supported' : ''} ${isAnimatingSupport ? 'anim-pop' : ''}`} onClick={handleSupportClick} icon={<HeartIcon />}>
                            {hasUnread && <div className="notification-dot-small"></div>}
                            <span className="support-text">{isMyPostView ? "View Chat" : "Offer Support"}</span>
                            {!isMyPostView && <span className="support-count">{dilemma.supportCount > 0 ? dilemma.supportCount : ''}</span>}
                        </AppButton>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                        {isMyPostView && dilemma.status === 'in_progress' && onResolve && (
                            <AppButton variant="success" className="btn-sm" onClick={() => onResolve(dilemma.id)}>
                                Mark as Resolved
                            </AppButton>
                        )}
                        <AppButton variant="secondary" className={`btn-sm btn-report ${dilemma.isReported ? 'reported' : ''}`} onClick={(e) => {e.stopPropagation(); onReport?.(dilemma.id)}} disabled={dilemma.isReported}>
                            {dilemma.isReported ? 'Reported' : 'Report'}
                        </AppButton>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export const PostCard = React.memo(PostCardComponent);