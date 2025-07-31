import type { Handler, HandlerEvent } from "@netlify/functions";
import * as db from './lib/database';

const handler: Handler = async (event: HandlerEvent) => {
    const headers = { 'Content-Type': 'application/json' };
    const path = event.path.replace('/api/reflections', '');

    try {
        // GET /api/reflections
        if (event.httpMethod === 'GET' && (path === '' || path === '/')) {
            const reflections = await db.getReflections();
            return { statusCode: 200, body: JSON.stringify(reflections.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())), headers };
        }

        // POST /api/reflections
        if (event.httpMethod === 'POST' && (path === '' || path === '/')) {
            const { userToken, content } = JSON.parse(event.body || '{}');
            if (!userToken || !content) {
                return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }), headers };
            }
            const newReflection = await db.createReflection({ userToken, content, timestamp: new Date().toISOString(), reactions: { light: 0 }});
            return { statusCode: 201, body: JSON.stringify(newReflection), headers };
        }

        // POST /api/reflections/:id/react
        const reactMatch = path.match(/^\/([a-zA-Z0-9-]+)\/react$/);
        if (event.httpMethod === 'POST' && reactMatch) {
            const [, reflectionId] = reactMatch;
            const { reactionType } = JSON.parse(event.body || '{}');
            const reflection = await db.getReflectionById(reflectionId); // Assuming getReflectionById exists
            if (!reflection) return { statusCode: 404, body: JSON.stringify({ message: "Reflection not found" }) };
            
            const newReactions = { ...reflection.reactions, [reactionType]: (reflection.reactions[reactionType] || 0) + 1 };
            const updated = await db.updateReflection(reflectionId, { reactions: newReactions });

            return { statusCode: 200, body: JSON.stringify(updated), headers };
        }

        return { statusCode: 404, body: JSON.stringify({ message: 'Route not found' }), headers };

    } catch (error: any) {
        console.error('Error in /api/reflections:', error);
        return { statusCode: 500, body: JSON.stringify({ message: error.message }), headers };
    }
};

export { handler };