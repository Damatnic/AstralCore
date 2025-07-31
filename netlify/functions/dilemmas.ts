import type { Handler, HandlerEvent } from "@netlify/functions";
import { Dilemma, HelpSession, Helper } from "../../src/types";
import * as db from './lib/database';

// A simple middleware-like function to check for authorization
const requireAuth = (event: HandlerEvent) => {
    const authHeader = event.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized: Missing or invalid token.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }
    // In a real application, you would verify the JWT here using a library like 'jose'.
    return null; // Indicates success
};


const handler: Handler = async (event: HandlerEvent) => {
    const path = event.path.replace('/api/dilemmas', '');
    const headers = { 'Content-Type': 'application/json' };

    // Publicly accessible endpoints
    if (event.httpMethod === 'GET') {
        if (path === '' || path === '/') {
            // In production, this would be: SELECT * FROM dilemmas;
            const allDilemmas = await db.getDilemmas();
            return { statusCode: 200, body: JSON.stringify(allDilemmas), headers };
        }
        const forYouMatch = path.match(/^\/for-you\/([a-zA-Z0-9-]+)$/);
        if (forYouMatch) {
            const [, userToken] = forYouMatch;
             // This logic would be a more complex SQL query in production
            const allDilemmas = await db.getDilemmas();
            const myPosts = allDilemmas.filter(d => d.userToken === userToken);
            const myCategories = [...new Set(myPosts.map(p => p.category))];
            
            let feed;
            if (myCategories.length === 0) {
                feed = allDilemmas
                    .filter(d => d.status === 'active' && !d.assignedHelperId && d.userToken !== userToken)
                    .sort((a, b) => a.supportCount - b.supportCount)
                    .slice(0, 10);
            } else {
                feed = allDilemmas.filter(d => 
                    d.status === 'active' &&
                    !d.assignedHelperId &&
                    d.userToken !== userToken &&
                    myCategories.includes(d.category)
                ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            }
            return { statusCode: 200, body: JSON.stringify(feed), headers };
        }
    }

    // All endpoints below this line require authentication
    const authError = requireAuth(event);
    if (authError) return authError;

    // --- POST /api/dilemmas ---
    if (event.httpMethod === 'POST' && (path === '' || path === '/')) {
        const body = JSON.parse(event.body || '{}');
        if (!body.content || !body.category || !body.userToken) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields.' }), headers };
        }
        // In production: INSERT INTO dilemmas (...) VALUES (...);
        const newDilemma = await db.createDilemma({
            userToken: body.userToken,
            content: body.content,
            category: body.category,
            timestamp: new Date().toISOString(),
            supportCount: 0,
            isSupported: false,
            isReported: false,
            status: 'active',
        });
        return { statusCode: 201, body: JSON.stringify(newDilemma), headers };
    }
    
    // --- POST /api/dilemmas/direct-request ---
    if (event.httpMethod === 'POST' && path === '/direct-request') {
         const body = JSON.parse(event.body || '{}');
        if (!body.content || !body.category || !body.userToken || !body.requestedHelperId) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields for direct request.' }), headers };
        }
        const newDilemma = await db.createDilemma({
            userToken: body.userToken,
            content: body.content,
            category: body.category,
            timestamp: new Date().toISOString(),
            supportCount: 0,
            isSupported: false,
            isReported: false,
            status: 'direct_request',
            requestedHelperId: body.requestedHelperId,
        });
        return { statusCode: 201, body: JSON.stringify(newDilemma), headers };
    }

    // --- Actions on specific dilemmas, e.g., /:id/support ---
    const actionMatch = path.match(/^\/([a-zA-Z0-9-]+)\/(\w+)$/);
    if (event.httpMethod === 'POST' && actionMatch) {
        const [, dilemmaId, action] = actionMatch;
        const dilemma = await db.getDilemmaById(dilemmaId);
        if (!dilemma) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Dilemma not found' }), headers };
        }

        switch (action) {
            case 'support': {
                const updatedDilemma = await db.updateDilemma(dilemmaId, {
                    isSupported: !dilemma.isSupported,
                    supportCount: dilemma.supportCount + (dilemma.isSupported ? -1 : 1),
                });
                return { statusCode: 200, body: JSON.stringify(updatedDilemma), headers };
            }

            case 'report': {
                const { reason } = JSON.parse(event.body || '{}');
                if (!reason) return { statusCode: 400, body: JSON.stringify({ message: 'Reason is required' }), headers };
                const updatedDilemma = await db.updateDilemma(dilemmaId, {
                    isReported: true,
                    reportReason: reason,
                });
                return { statusCode: 200, body: JSON.stringify(updatedDilemma), headers };
            }

            case 'accept': {
                const { helperId } = JSON.parse(event.body || '{}');
                if (!helperId) return { statusCode: 400, body: JSON.stringify({ message: 'helperId is required' }), headers };
                
                const updatedDilemma = await db.updateDilemma(dilemmaId, {
                    status: 'in_progress',
                    assignedHelperId: helperId,
                });
                
                const helper = await db.getHelperById(helperId);
                const session = await db.createSession({
                    dilemmaId,
                    seekerId: dilemma.userToken,
                    helperId,
                    helperDisplayName: helper?.displayName || 'A Helper',
                    startedAt: new Date().toISOString(),
                    isFavorited: false,
                });

                const { updatedHelper, newAchievements } = await db.checkAndAwardAchievements(helperId);

                return { statusCode: 200, body: JSON.stringify({ dilemma: updatedDilemma, session, updatedHelper, newAchievements }), headers };
            }
            
            case 'resolve': {
                const updatedDilemma = await db.updateDilemma(dilemmaId, {
                    status: 'resolved',
                    resolved_by_seeker: true,
                });
                return { statusCode: 200, body: JSON.stringify(updatedDilemma), headers };
            }
            
            case 'decline': {
                const updatedDilemma = await db.updateDilemma(dilemmaId, {
                    status: 'active',
                    requestedHelperId: undefined,
                });
                return { statusCode: 200, body: JSON.stringify(updatedDilemma), headers };
            }

            default:
                return { statusCode: 404, body: JSON.stringify({ message: `Action '${action}' not found` }), headers };
        }
    }

    return { statusCode: 404, body: JSON.stringify({ message: 'Route not found' }), headers };
};

export { handler };