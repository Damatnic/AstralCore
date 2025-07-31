import type { Handler, HandlerEvent } from "@netlify/functions";
import * as db from './lib/database';

const handler: Handler = async (event: HandlerEvent) => {
    const headers = { 'Content-Type': 'application/json' };
    const pathMatch = event.path.match(/^\/api\/chat\/([a-zA-Z0-9-]+)\/messages$/);

    if (!pathMatch) {
        return { statusCode: 404, body: JSON.stringify({ message: "Route not found" }), headers };
    }

    const [, dilemmaId] = pathMatch;

    // In a real app, you'd check if the user (either the seeker or the assigned helper)
    // has permission to access this chat. For now, we'll keep it simple.

    try {
        if (event.httpMethod === 'GET') {
            const messages = await db.getChatMessages(dilemmaId);
            return {
                statusCode: 200,
                body: JSON.stringify(messages),
                headers,
            };
        }

        if (event.httpMethod === 'POST') {
            const { text, sender, senderId } = JSON.parse(event.body || '{}');
            if (!text || !sender || !senderId) {
                return { statusCode: 400, body: JSON.stringify({ message: "Missing required fields" }), headers };
            }

            const newMessage = await db.createChatMessage(dilemmaId, {
                sender,
                text,
                timestamp: new Date().toISOString(),
            });

            return {
                statusCode: 201,
                body: JSON.stringify(newMessage),
                headers,
            };
        }

        return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }), headers };

    } catch (error: any) {
        console.error('Error in /api/chat:', error);
        return { statusCode: 500, body: JSON.stringify({ message: error.message }), headers };
    }
};

export { handler };
