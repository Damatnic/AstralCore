

import React, { useState, useEffect } from 'react';
import { Reflection } from '../types';
import { ApiClient } from '../utils/ApiClient';
import { AppButton } from '../components/AppButton';
import { AppTextArea } from '../components/AppInput';
import { ReflectionCard } from '../components/ReflectionCard';
import { SkeletonPostCard } from '../components/SkeletonPostCard';
import { Card } from '../components/Card';


export const ReflectionsView: React.FC<{ userToken: string | null; }> = ({ userToken }) => {
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [newReflection, setNewReflection] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const MAX_REFLECTION_LENGTH = 280;

    useEffect(() => {
        setIsLoading(true);
        ApiClient.reflections.getReflections()
            .then(data => {
                setReflections(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReflection.trim() || !userToken) return;
        setIsSubmitting(true);
        try {
            const posted = await ApiClient.reflections.postReflection(userToken, newReflection.trim());
            setReflections(prev => [posted, ...prev]);
            setNewReflection('');
        } catch(err) {
            console.error(err);
            alert("Could not post your reflection. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReact = (reflectionId: string, reactionType: string) => {
        if (!userToken) {
            alert("You must have a user token to react.");
            return;
        }

        // Optimistic UI update
        setReflections(prev => prev.map(r => {
            if (r.id === reflectionId && !r.myReaction) {
                return {
                    ...r,
                    reactions: { ...r.reactions, [reactionType]: (r.reactions[reactionType] || 0) + 1 },
                    myReaction: reactionType,
                };
            }
            return r;
        }));

        ApiClient.reflections.addReaction(reflectionId, reactionType, userToken)
            .catch(err => {
                console.error("Failed to save reaction:", err);
                // Rollback UI on failure
                 setReflections(prev => prev.map(r => {
                    if (r.id === reflectionId) {
                        return {
                            ...r,
                            reactions: { ...r.reactions, [reactionType]: r.reactions[reactionType] - 1 },
                            myReaction: undefined,
                        };
                    }
                    return r;
                }));
            });
    }

    return (
        <>
            <div className="view-header">
                <h1>Astral Reflections</h1>
                <p className="view-subheader">A shared space for anonymous positive thoughts, affirmations, and coping strategies.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <AppTextArea
                        label="Share a positive reflection"
                        placeholder="e.g., Today, I was grateful for the sunshine."
                        value={newReflection}
                        onChange={(e) => setNewReflection(e.target.value)}
                        maxLength={MAX_REFLECTION_LENGTH}
                        rows={3}
                    />
                    <div className="form-actions" style={{justifyContent: 'flex-end'}}>
                         <AppButton type="submit" onClick={() => {}} isLoading={isSubmitting} disabled={isSubmitting || !newReflection.trim()}>
                            Share Reflection
                        </AppButton>
                    </div>
                </form>
            </Card>
            
            <div className="reflections-feed">
                {isLoading ? (
                    <>
                        {[...Array(3)].map((_, i) => <Card key={i} className="post-card skeleton"><div className="content-skeleton line-1"></div><div className="content-skeleton line-2"></div></Card>)}
                    </>
                ) : reflections.length > 0 ? (
                    reflections.map(reflection => (
                        <ReflectionCard key={reflection.id} reflection={reflection} onReact={handleReact} />
                    ))
                ) : (
                    <Card className="empty-state" style={{gridColumn: '1 / -1'}}>
                        <p>No reflections have been shared yet. Be the first!</p>
                    </Card>
                )}
            </div>
        </>
    );
};