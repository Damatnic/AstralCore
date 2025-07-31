

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AIChatSession } from '../types';
import { BackIcon, SendIcon, AICompanionIcon } from '../components/icons';
import { TypingIndicator } from '../components/TypingIndicator';
import { Modal } from '../components/Modal';
import { formatChatTimestamp } from '../utils/formatTimeAgo';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';

export const AIChatView: React.FC<{
    session: AIChatSession;
    onSendMessage: (text: string) => Promise<void>;
    onClose: () => void;
}> = ({ session, onSendMessage, onClose }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [session.messages, session.isTyping]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setIsSending(true);
        const textToSend = newMessage;
        setNewMessage('');
        await onSendMessage(textToSend);
        setIsSending(false);
    };

    const handleAcceptDisclaimer = () => {
        setShowDisclaimer(false);
    };

    if (showDisclaimer) {
        return (
            <div className="ai-disclaimer-container">
                 <Modal 
                    isOpen={true}
                    title="Astral AI Companion"
                    isDismissible={false}
                >
                    <div className="ai-disclaimer-content">
                        <AICompanionIcon />
                        <p>You are about to chat with Astral AI, an automated companion designed for supportive listening.</p>
                        <ul>
                            <li>This is <strong>not a human</strong> or a licensed therapist.</li>
                            <li>It can offer a safe space to vent but <strong>cannot provide advice or handle crises</strong>.</li>
                        </ul>
                        <p>For immediate crisis support, please use the <strong>"Get Help Now"</strong> resources. By continuing, you acknowledge you understand the limitations of this AI.</p>
                        <div className="modal-actions">
                            <AppButton variant="secondary" onClick={onClose}>Go Back</AppButton>
                            <AppButton variant="primary" onClick={handleAcceptDisclaimer}>I Understand, Continue</AppButton>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

    return (
        <div className="chat-view">
            <div className="chat-header">
                <button onClick={onClose} className="back-btn"><BackIcon /></button>
                <div className="avatar-ai"><AICompanionIcon /></div>
                <div className="chat-header-info">
                    <h2>Chat with Astral AI</h2>
                    <p>Your private AI companion</p>
                </div>
            </div>
            <div className="chat-messages">
                 {session.messages.map(msg => (
                    <div key={msg.id} className={`message-group ${msg.sender}`}>
                        <div className="message-bubble-wrapper">
                             {msg.sender === 'ai' && <div className="avatar-ai"><AICompanionIcon /></div>}
                            <div className="message-bubble markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                         <span className="message-timestamp">{formatChatTimestamp(msg.timestamp)}</span>
                    </div>
                ))}
                {session.isTyping && <TypingIndicator />}
                 <div ref={messagesEndRef} />
            </div>
            <div className="chat-composer">
                <AppInput
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSend()}
                    disabled={isSending}
                    className="chat-input"
                    containerStyle={{flexGrow: 1, marginBottom: 0}}
                />
                <AppButton onClick={handleSend} disabled={!newMessage.trim() || isSending} isLoading={isSending} className="chat-send-btn">
                     {!isSending && <SendIcon />}
                </AppButton>
            </div>
        </div>
    );
};