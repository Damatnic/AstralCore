import type { Handler, HandlerEvent } from "@netlify/functions";
import * as db from './lib/database';

const handler: Handler = async (event: HandlerEvent) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
        // GET /api/sessions/user/:userId
        const userMatch = event.path.match(/^\/api\/sessions\/user\/([a-zA-Z0-9-|]+)$/);
        if (event.httpMethod === 'GET' && userMatch) {
            const [, userId] = userMatch;
            const allSessions = await db.getSessions();
            const userSessions = allSessions.filter(s => s.seekerId === userId || s.helperId === userId)
                .sort((a,b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
            return { statusCode: 200, body: JSON.stringify(userSessions), headers };
        }
        
        // POST /api/sessions/:id/favorite
        const favoriteMatch = event.path.match(/^\/api\/sessions\/([a-zA-Z0-9-]+)\/favorite$/);
        if (event.httpMethod === 'POST' && favoriteMatch) {
            const [, sessionId] = favoriteMatch;
            const { seekerId } = JSON.parse(event.body || '{}');
            const session = await db.getSessionById(sessionId); // Assuming getSessionById exists
            if (!session || session.seekerId !== seekerId) {
                return { statusCode: 404, body: JSON.stringify({ message: "Session not found or permission denied" }) };
            }
            const updated = await db.updateSession(sessionId, { isFavorited: !session.isFavorited });
            return { statusCode: 200, body: JSON.stringify(updated), headers };
        }
        
        // POST /api/sessions/:id/kudos
        const kudosMatch = event.path.match(/^\/api\/sessions\/([a-zA-Z0-9-]+)\/kudos$/);
        if (event.httpMethod === 'POST' && kudosMatch) {
            const [, sessionId] = kudosMatch;
            const session = await db.getSessionById(sessionId);
            if (!session) return { statusCode: 404, body: JSON.stringify({ message: "Session not found" }) };

            await db.updateSession(sessionId, { kudosGiven: true });
            
            const helper = await db.getHelperById(session.helperId);
            if (helper) {
                await db.updateHelper(session.helperId, { kudosCount: (helper.kudosCount || 0) + 1 });
                const { updatedHelper, newAchievements } = await db.checkAndAwardAchievements(session.helperId);
                return { statusCode: 200, body: JSON.stringify({ updatedHelper, newAchievements }), headers };
            }

            return { statusCode: 204, body: '' };
        }


        return { statusCode: 404, body: JSON.stringify({ message: 'Route not found' }), headers };
    } catch (error: any) {
        console.error('Error in /api/sessions:', error);
        return { statusCode: 500, body: JSON.stringify({ message: error.message }), headers };
    }
};

export { handler };