import React from 'react';
import { ActiveView } from '../types';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { ViewHeader } from '../components/ViewHeader';

export const AssessmentsView: React.FC<{
    setActiveView: (view: ActiveView) => void;
}> = ({ setActiveView }) => {
    return (
        <>
            <ViewHeader
                title="Mental Health Assessments"
                subtitle="Private, evidence-based tools to help you understand your well-being."
            />
            <Card>
                <h2>Available Assessments</h2>
                <p>These are standardized, confidential screening tools. They are not a diagnosis but can be a helpful starting point for self-awareness or a conversation with a professional.</p>
                <div className="assessment-list" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="setting-item">
                        <div>
                            <h3 style={{ margin: 0 }}>PHQ-9 (Depression)</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Screens for and measures the severity of depression.</p>
                        </div>
                        <AppButton onClick={() => setActiveView({ view: 'assessment-detail', params: { type: 'phq-9' } })}>
                            Take Assessment
                        </AppButton>
                    </div>
                     <hr style={{margin: '1rem 0', border: 'none', borderBottom: '1px solid var(--border-color)'}}/>
                    <div className="setting-item">
                        <div>
                            <h3 style={{ margin: 0 }}>GAD-7 (Anxiety)</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Screens for and measures the severity of generalized anxiety disorder.</p>
                        </div>
                         <AppButton onClick={() => setActiveView({ view: 'assessment-detail', params: { type: 'gad-7' } })}>
                            Take Assessment
                        </AppButton>
                    </div>
                </div>
            </Card>
            <Card>
                 <div className="setting-item">
                     <p>View your past assessment results to track your progress over time.</p>
                     <AppButton variant="secondary" onClick={() => setActiveView({ view: 'assessment-history' })}>View History</AppButton>
                </div>
            </Card>
        </>
    );
};