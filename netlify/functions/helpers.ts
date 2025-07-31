import type { Handler, HandlerEvent } from "@netlify/functions";
import { Helper, Achievement } from "../../src/types";
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
    // In a real application, you would verify the JWT here.
    return null; // Indicates success
};


const handler: Handler = async (event: HandlerEvent) => {
    const path = event.path.replace('/api/helpers', '');
    const headers = { 'Content-Type': 'application/json' };

    try {
        // --- Public Endpoints ---
        if (event.httpMethod === 'GET') {
            // GET /api/helpers/online-count - public
            if (path === '/online-count') {
                const allHelpers = await db.getHelpers();
                const onlineCount = allHelpers.filter(h => h.isAvailable).length;
                return { statusCode: 200, body: JSON.stringify(onlineCount), headers };
            }
        }
        
        // All endpoints below this line require authentication.
        const authError = requireAuth(event);
        if (authError) return authError;

        // --- GET /api/helpers ---
        if (event.httpMethod === 'GET' && (path === '' || path === '/')) {
            const allHelpers = await db.getHelpers();
            return { statusCode: 200, body: JSON.stringify(allHelpers), headers };
        }

        // --- GET /api/helpers/profile/:auth0UserId ---
        const profileMatch = path.match(/^\/profile\/([a-zA-Z0-9-|]+)$/);
        if (event.httpMethod === 'GET' && profileMatch) {
            const [, auth0UserId] = profileMatch;
            const profile = await db.getHelperByAuth0Id(auth0UserId);
            return { statusCode: 200, body: JSON.stringify(profile || null), headers };
        }

        // --- GET /api/helpers/:helperId ---
        const byIdMatch = path.match(/^\/([a-zA-Z0-9-]+)$/);
        if (event.httpMethod === 'GET' && byIdMatch) {
            const [, helperId] = byIdMatch;
            const helper = await db.getHelperById(helperId);
            return { statusCode: 200, body: JSON.stringify(helper || null), headers };
        }
        
        // --- POST /api/helpers ---
        if (event.httpMethod === 'POST' && (path === '' || path === '/')) {
            const profileData = JSON.parse(event.body || '{}');
            const newHelper = await db.createHelper({
                ...profileData,
                joinDate: new Date().toISOString(),
                helperType: 'Community',
                role: 'Community',
                reputation: 0,
                isAvailable: false,
                kudosCount: 0,
                achievements: [],
                xp: 0,
                level: 1,
                nextLevelXp: 100,
                applicationStatus: 'none',
                trainingCompleted: false,
            });
            return { statusCode: 201, body: JSON.stringify(newHelper), headers };
        }

        // --- PUT /api/helpers/:helperId ---
        if (event.httpMethod === 'PUT' && byIdMatch) {
            const [, helperId] = byIdMatch;
            const updates = JSON.parse(event.body || '{}');
            const updatedHelper = await db.updateHelper(helperId, updates);
            if (!updatedHelper) return { statusCode: 404, body: JSON.stringify({ message: "Helper not found" }) };
            return { statusCode: 200, body: JSON.stringify(updatedHelper), headers };
        }

        // --- PUT /api/helpers/:helperId/availability ---
        const availabilityMatch = path.match(/^\/([a-zA-Z0-9-]+)\/availability$/);
        if (event.httpMethod === 'PUT' && availabilityMatch) {
            const [, helperId] = availabilityMatch;
            const { isAvailable } = JSON.parse(event.body || '{}');
            const updatedHelper = await db.updateHelper(helperId, { isAvailable });
            if (!updatedHelper) return { statusCode: 404, body: JSON.stringify({ message: "Helper not found" }) };
            return { statusCode: 200, body: JSON.stringify(updatedHelper), headers };
        }

        // --- GET /api/helpers/:helperId/achievements ---
        const achievementsMatch = path.match(/^\/([a-zA-Z0-9-]+)\/achievements$/);
        if (event.httpMethod === 'GET' && achievementsMatch) {
            // Mock achievement logic
            const earnedAchievements: Achievement[] = [{ id: 'ach1', name: 'First Step', description: 'Supported your first post.', icon: 'HeartIcon' }];
            return { statusCode: 200, body: JSON.stringify(earnedAchievements), headers };
        }
        
        // --- POST /api/helpers/:helperId/training ---
        const trainingMatch = path.match(/^\/([a-zA-Z0-9-]+)\/training$/);
        if (event.httpMethod === 'POST' && trainingMatch) {
             const [, helperId] = trainingMatch;
             const { score } = JSON.parse(event.body || '{}');
             const updatedHelper = await db.updateHelper(helperId, { trainingCompleted: true, quizScore: score });
             if (!updatedHelper) return { statusCode: 404, body: JSON.stringify({ message: "Helper not found" }) };
             return { statusCode: 200, body: JSON.stringify(updatedHelper), headers };
        }

        // --- POST /api/helpers/:helperId/application ---
        const applicationMatch = path.match(/^\/([a-zA-Z0-9-]+)\/application$/);
        if (event.httpMethod === 'POST' && applicationMatch) {
             const [, helperId] = applicationMatch;
             const updatedHelper = await db.updateHelper(helperId, { applicationStatus: 'pending' });
             if (!updatedHelper) return { statusCode: 404, body: JSON.stringify({ message: "Helper not found" }) };
             return { statusCode: 200, body: JSON.stringify(updatedHelper), headers };
        }


        return { statusCode: 404, body: JSON.stringify({ message: 'Route not found' }), headers };

    } catch (error: any) {
        console.error('Error in /api/helpers:', error);
        return { statusCode: 500, body: JSON.stringify({ message: error.message }), headers };
    }
};

export { handler };