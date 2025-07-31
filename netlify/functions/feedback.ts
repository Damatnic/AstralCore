import type { Handler, HandlerEvent } from "@netlify/functions";
import * as db from './lib/database';

const handler: Handler = async (event: HandlerEvent) => {
    const headers = { 'Content-Type': 'application/json' };
    const path = event.path.replace('/api/feedback', '');

    try {
        if (event.httpMethod === 'POST' && (path === '' || path === '/')) {
            const { dilemmaId, helperId, wasHelpful } = JSON.parse(event.body || '{}');
            if (!dilemmaId || !helperId || typeof wasHelpful !== 'boolean') {
                return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }), headers };
            }
            await db.createFeedback({ dilemmaId, helperId, wasHelpful });
            // In a real app, this would trigger an update to the helper's reputation score.
            return { statusCode: 204, body: '' };
        }

        const byIdMatch = path.match(/^\/([a-zA-Z0-9-]+)$/);
        if (event.httpMethod === 'GET' && byIdMatch) {
            const [, helperId] = byIdMatch;
            const feedbacks = await db.getFeedbackForHelper(helperId);
            return { statusCode: 200, body: JSON.stringify(feedbacks), headers };
        }

        return { statusCode: 404, body: JSON.stringify({ message: 'Route not found' }), headers };

    } catch (error: any) {
        console.error('Error in /api/feedback:', error);
        return { statusCode: 500, body: JSON.stringify({ message: error.message }), headers };
    }
};

export { handler };
