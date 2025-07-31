import type { Handler, HandlerEvent } from "@netlify/functions";
import * as db from './lib/database';

const handler: Handler = async (event: HandlerEvent) => {
    const headers = { 'Content-Type': 'application/json' };
    const path = event.path.replace('/api/users', '');

    // Note: All endpoints in this function would require authentication in a real app.
    // We're omitting the explicit check here for brevity, assuming a gateway would handle it,
    // but the logic relies on having a verified user ID.

    try {
        // --- Safety Plan ---
        const safetyPlanMatch = path.match(/^\/safety-plan\/([a-zA-Z0-9-]+)$/);
        if (event.httpMethod === 'GET' && safetyPlanMatch) {
            const [, userId] = safetyPlanMatch;
            const plan = await db.getSafetyPlan(userId);
            return { statusCode: 200, body: JSON.stringify(plan), headers };
        }
        if (event.httpMethod === 'POST' && path === '/safety-plan') {
            const { userToken, plan } = JSON.parse(event.body || '{}');
            await db.saveSafetyPlan(userToken, plan);
            return { statusCode: 204, body: '' };
        }
        
        // --- Legal Consents ---
        const consentMatch = path.match(/^\/consent\/([a-zA-Z0-9-|]+)\/(\w+)$/);
        if (event.httpMethod === 'GET' && consentMatch) {
            const [, userId, docType] = consentMatch;
            const consent = await db.getConsent(userId, docType);
            if (consent) {
                return { statusCode: 200, body: JSON.stringify({ document_version: consent.documentVersion, consent_timestamp: consent.consentTimestamp }), headers };
            }
            return { statusCode: 200, body: JSON.stringify(null), headers };
        }
        if (event.httpMethod === 'POST' && path === '/consent') {
            const body = JSON.parse(event.body || '{}');
            await db.recordConsent(body);
            return { statusCode: 204, body: '' };
        }

        // --- User Blocking ---
        const blockedMatch = path.match(/^\/blocked\/([a-zA-Z0-9-|]+)$/);
        if (event.httpMethod === 'GET' && blockedMatch) {
            const [, blockerId] = blockedMatch;
            const blocks = await db.getBlockedUsers(blockerId);
            return { statusCode: 200, body: JSON.stringify(blocks), headers };
        }
        if (event.httpMethod === 'POST' && path === '/block') {
            const { blockerId, blockedId } = JSON.parse(event.body || '{}');
            const newBlock = await db.blockUser({ blockerId, blockedId });
            return { statusCode: 201, body: JSON.stringify(newBlock), headers };
        }
        if (event.httpMethod === 'POST' && path === '/unblock') {
            const { blockerId, blockedId } = JSON.parse(event.body || '{}');
            await db.unblockUser(blockerId, blockedId);
            return { statusCode: 204, body: '' };
        }

        // --- Preferences ---
        const prefsMatch = path.match(/^\/preferences\/([a-zA-Z0-9-|]+)$/);
         if (event.httpMethod === 'GET' && prefsMatch) {
            const [, userId] = prefsMatch;
            const prefs = await db.getPreferences(userId);
            return { statusCode: 200, body: JSON.stringify(prefs), headers };
        }
         if (event.httpMethod === 'PUT' && prefsMatch) {
            const [, userId] = prefsMatch;
            const body = JSON.parse(event.body || '{}');
            await db.savePreferences(userId, body);
            return { statusCode: 204, body: '' };
        }

        return { statusCode: 404, body: JSON.stringify({ message: 'Route not found' }), headers };
    } catch (error: any) {
        console.error('Error in /api/users:', error);
        return { statusCode: 500, body: JSON.stringify({ message: error.message }), headers };
    }
};

export { handler };
