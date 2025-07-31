import { useState, useCallback, useEffect } from 'react';
import { AIChatSession, AIChatMessage } from '../types';
import { ApiClient } from '../utils/ApiClient';
import { useNotification } from '../contexts/NotificationContext';
import { authState } from '../contexts/AuthContext';

export const useAIChat = () => {
    const [session, setSession] = useState<AIChatSession>({ messages: [], isTyping: false });
    const { addToast } = useNotification();

    const fetchHistory = useCallback(async () => {
        try {
            const messages = await ApiClient.ai.loadChatHistory();
            setSession(prev => ({ ...prev, messages }));
        } catch (error) {
            console.error("Failed to load AI chat history:", error);
            addToast("Could not load AI chat history.", "error");
        }
    }, [addToast]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);
    
    const resetAIChat = async () => {
        await ApiClient.ai.resetAIChat();
        setSession({ messages: [], isTyping: false });
    };

    const sendMessage = async (text: string) => {
        if (!authState.userToken) return;

        const userMessage: AIChatMessage = { 
            id: crypto.randomUUID(), 
            sender: 'user', 
            text, 
            timestamp: new Date().toISOString() 
        };

        const updatedMessages = [...session.messages, userMessage];
        setSession({ messages: updatedMessages, isTyping: true });
        
        let finalAiMessage: AIChatMessage;
        const systemInstruction = "You are Astral AI, an automated companion designed for supportive listening. This is not a human or a licensed therapist. It can offer a safe space to vent but cannot provide advice or handle crises. For immediate crisis support, please use the 'Get Help Now' resources.";

        try {
            const aiResponseText = await ApiClient.ai.chat(updatedMessages, systemInstruction);
            finalAiMessage = { id: crypto.randomUUID(), sender: 'ai', text: aiResponseText, timestamp: new Date().toISOString() };
        } catch (e) {
            console.error(e);
            finalAiMessage = { id: crypto.randomUUID(), sender: 'ai', text: "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.", timestamp: new Date().toISOString() };
        }
        
        const finalMessages = [...updatedMessages, finalAiMessage];
        setSession({ messages: finalMessages, isTyping: false });
        await ApiClient.ai.saveChatHistory(finalMessages);
    };

    return {
        session,
        sendMessage,
        resetAIChat,
    };
};
