import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HelperGuidance } from '../types';
import { CloseIcon, CrisisIcon } from './icons';
import { AppButton } from './AppButton';

export const GuidancePanel: React.FC<{
    guidance: HelperGuidance;
    onDismiss: () => void;
}> = ({ guidance, onDismiss }) => {

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Maybe show a small toast notification here
    };

    const alertModerator = () => {
        alert("A human moderator would be notified immediately for review.");
        onDismiss();
    };

    return (
        <div className="guidance-panel">
            <div className="guidance-header">
                <h3><CrisisIcon /> AI Helper Guidance</h3>
                <p>Detected: {guidance.flagReason.replace(/_/g, ' ')}</p>
                <button onClick={onDismiss} className="modal-close-btn" aria-label="Close guidance panel">
                    <CloseIcon />
                </button>
            </div>
            {guidance.suggestedResponses.length > 0 && (
                <div className="guidance-section">
                    <h4>Suggested Responses</h4>
                    <ul>
                        {guidance.suggestedResponses.map((response, index) => (
                            <li key={index}>
                                <AppButton variant="secondary" onClick={() => copyToClipboard(response)}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
                                </AppButton>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {guidance.suggestedResources.length > 0 && (
                <div className="guidance-section">
                    <h4>Crisis Resources to Share</h4>
                     <ul>
                        {guidance.suggestedResources.map((resource, index) => (
                            <li key={index}>
                                <AppButton variant="secondary" onClick={() => copyToClipboard(`${resource.title}: ${resource.contact}`)}>
                                    <strong>{resource.title}:</strong> {resource.contact}
                                </AppButton>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="guidance-actions">
                <AppButton variant="danger" onClick={alertModerator}>Alert Human Moderator</AppButton>
            </div>
        </div>
    );
};