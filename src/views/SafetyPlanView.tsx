import React, { useState, useEffect } from 'react';
import { Toast, SafetyPlan } from '../types';
import { AppButton } from '../components/AppButton';
import { AppTextArea } from '../components/AppInput';
import { Card } from '../components/Card';
import { ApiClient } from '../utils/ApiClient';
import { useNotification } from '../contexts/NotificationContext';

const defaultPlan: SafetyPlan = {
    triggers: '',
    copingStrategies: '',
    supportContacts: '',
    safePlaces: '',
};

const defaultHotlines = [
    { name: '988 Suicide & Crisis Lifeline', contact: '988' },
    { name: 'Crisis Text Line', contact: 'Text HOME to 741741' },
];

export const SafetyPlanView: React.FC<{
    userToken: string | null;
}> = ({ userToken }) => {
    const [plan, setPlan] = useState<SafetyPlan>(defaultPlan);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useNotification();

    useEffect(() => {
        if (!userToken) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        ApiClient.safetyPlan.get(userToken)
            .then(savedPlan => {
                if (savedPlan) {
                    setPlan(savedPlan);
                    setIsEditing(false);
                } else {
                    setIsEditing(true); // Default to edit mode if no plan exists
                }
            })
            .catch(error => {
                console.error("Failed to load safety plan:", error);
                addToast("Could not load your safety plan.", "error");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [addToast, userToken]);

    const handleSave = async () => {
        if (!userToken) {
            addToast("Cannot save plan without a user session.", "error");
            return;
        }
        setIsLoading(true);
        try {
            await ApiClient.safetyPlan.save(plan, userToken);
            setIsEditing(false);
            addToast('Your safety plan has been saved!', 'success');
        } catch (error) {
            console.error("Failed to save safety plan:", error);
            addToast("Could not save your safety plan.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPlan({
            ...plan,
            [e.target.name]: e.target.value,
        });
    };
    
    if(isLoading) {
        return <div className="loading-spinner" style={{margin: '5rem auto'}}></div>
    }

    return (
        <>
            <div className="view-header">
                <h1>My Astral Safety Plan</h1>
                <p className="view-subheader">A private space to plan for difficult moments. This is saved securely on your device.</p>
            </div>

            <Card className="safety-plan-card">
                 {!isEditing && (
                    <div className="safety-plan-actions">
                        <AppButton variant="primary" onClick={() => setIsEditing(true)}>Edit Plan</AppButton>
                    </div>
                 )}
                
                <div className="safety-plan-section">
                    <h2>My Triggers</h2>
                    <p className="safety-plan-prompt">What are some things (events, thoughts, feelings) that make you feel worse or might lead to a crisis?</p>
                    {isEditing ? (
                        <AppTextArea name="triggers" value={plan.triggers} onChange={handleInputChange} placeholder="e.g., Feeling isolated, specific dates, arguments..." />
                    ) : (
                        <div className="safety-plan-content">{plan.triggers || "No triggers listed."}</div>
                    )}
                </div>
                
                <div className="safety-plan-section">
                    <h2>My Coping Strategies</h2>
                    <p className="safety-plan-prompt">What are some healthy things you can do to manage distress?</p>
                    {isEditing ? (
                        <AppTextArea name="copingStrategies" value={plan.copingStrategies} onChange={handleInputChange} placeholder="e.g., Listen to calming music, go for a walk, deep breathing exercises, write in a journal..." />
                    ) : (
                        <div className="safety-plan-content">{plan.copingStrategies || "No strategies listed."}</div>
                    )}
                </div>

                <div className="safety-plan-section">
                    <h2>My Support Team</h2>
                    <p className="safety-plan-prompt">Who are some trusted people you can contact for support?</p>
                     {isEditing ? (
                        <AppTextArea name="supportContacts" value={plan.supportContacts} onChange={handleInputChange} placeholder="e.g., My friend Alex (555-1234), my sister Sarah, my therapist's office..." />
                    ) : (
                        <div className="safety-plan-content">{plan.supportContacts || "No contacts listed."}</div>
                    )}
                </div>

                <div className="safety-plan-section">
                    <h2>My Safe Places</h2>
                    <p className="safety-plan-prompt">Where can you go to feel safe and calm?</p>
                    {isEditing ? (
                        <AppTextArea name="safePlaces" value={plan.safePlaces} onChange={handleInputChange} placeholder="e.g., My bedroom, the local park, the library..." />
                    ) : (
                        <div className="safety-plan-content">{plan.safePlaces || "No safe places listed."}</div>
                    )}
                </div>

                <div className="safety-plan-section">
                    <h2>Crisis Hotlines</h2>
                    <p className="safety-plan-prompt">Immediate, professional help is always available.</p>
                    <ul className="crisis-hotlines-list">
                        {defaultHotlines.map(hotline => (
                            <li key={hotline.name}>
                                <strong>{hotline.name}:</strong> {hotline.contact}
                            </li>
                        ))}
                    </ul>
                </div>
                
                 {isEditing && (
                    <div className="safety-plan-actions">
                        <AppButton variant="success" onClick={handleSave} isLoading={isLoading}>Save My Plan</AppButton>
                    </div>
                 )}
            </Card>
        </>
    );
};