import type { Handler, HandlerEvent } from "@netlify/functions";
import * as db from './lib/database';

const handler: Handler = async (event: HandlerEvent) => {
    const headers = { 'Content-Type': 'application/json' };
    const path = event.path.replace('/api/wellness', '');

    try {
        // --- Resources (Public) ---
        if (event.httpMethod === 'GET' && path === '/resources') {
            const resources = await db.getResources();
            return { statusCode: 200, body: JSON.stringify(resources), headers };
        }
        
        // --- Videos (Public) ---
        if (event.httpMethod === 'GET' && path === '/videos') {
            const videos = await db.getVideos();
            return { statusCode: 200, body: JSON.stringify(videos.sort(() => 0.5 - Math.random())), headers };
        }

        // Note: The rest of these endpoints would require auth in a real app.

        // --- Videos (Authenticated Actions) ---
        const likeMatch = path.match(/^\/videos\/like\/([a-zA-Z0-9-]+)$/);
        if (event.httpMethod === 'POST' && likeMatch) {
            const [, videoId] = likeMatch;
            const video = await db.getVideoById(videoId);
            if (!video) return { statusCode: 404, body: JSON.stringify({ message: "Video not found" }) };
            const updated = await db.updateVideo(videoId, { isLiked: !video.isLiked, likes: video.likes + (video.isLiked ? -1 : 1) });
            return { statusCode: 200, body: JSON.stringify(updated), headers };
        }
         if (event.httpMethod === 'POST' && path === '/videos/upload') {
            const { description, userToken, fileName } = JSON.parse(event.body || '{}');
            const newVideo = await db.createVideo({
                videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                userToken, description, likes: 0, comments: 0, shares: 0,
                timestamp: new Date().toISOString(), isLiked: false,
            });
            return { statusCode: 201, body: JSON.stringify(newVideo), headers };
        }

        // --- Mood Tracking ---
        const moodHistoryMatch = path.match(/^\/mood\/history\/([a-zA-Z0-9-]+)$/);
        if (event.httpMethod === 'GET' && moodHistoryMatch) {
            const [, userId] = moodHistoryMatch;
            const moods = await db.getMoods(userId);
            return { statusCode: 200, body: JSON.stringify(moods), headers };
        }
        if (event.httpMethod === 'POST' && path === '/mood/checkin') {
            const body = JSON.parse(event.body || '{}');
            const newMood = await db.createMood({ ...body, timestamp: new Date().toISOString() });
            return { statusCode: 201, body: JSON.stringify(newMood), headers };
        }

        // --- Habits ---
        if (event.httpMethod === 'GET' && path === '/habits/predefined') {
            const habits = await db.getPredefinedHabits();
            return { statusCode: 200, body: JSON.stringify(habits), headers };
        }
        const trackedHabitsMatch = path.match(/^\/habits\/tracked\/([a-zA-Z0-9-]+)$/);
        if (event.httpMethod === 'GET' && trackedHabitsMatch) {
            const [, userId] = trackedHabitsMatch;
            const ids = await db.getTrackedHabitIds(userId);
            return { statusCode: 200, body: JSON.stringify(ids), headers };
        }
        const completionsMatch = path.match(/^\/habits\/completions\/([a-zA-Z0-9-]+)$/);
        if (event.httpMethod === 'GET' && completionsMatch) {
            const [, userId] = completionsMatch;
            const completions = await db.getCompletions(userId);
            return { statusCode: 200, body: JSON.stringify(completions), headers };
        }
        if (event.httpMethod === 'POST' && path === '/habits/track') {
            const { userId, habitId } = JSON.parse(event.body || '{}');
            await db.trackHabit(userId, habitId);
            return { statusCode: 204, body: '' };
        }
         if (event.httpMethod === 'POST' && path === '/habits/untrack') {
            const { userId, habitId } = JSON.parse(event.body || '{}');
            await db.untrackHabit(userId, habitId);
            return { statusCode: 204, body: '' };
        }
        if (event.httpMethod === 'POST' && path === '/habits/log') {
            const { userId, habitId, date } = JSON.parse(event.body || '{}');
            const completion = await db.createCompletion({ userId, habitId, completedAt: date });
            return { statusCode: 201, body: JSON.stringify(completion), headers };
        }
        
        // --- Assessments ---
        const assessmentHistoryMatch = path.match(/^\/assessments\/history\/([a-zA-Z0-9-]+)$/);
        if (event.httpMethod === 'GET' && assessmentHistoryMatch) {
            const [, userId] = assessmentHistoryMatch;
            const assessments = await db.getAssessments(userId);
            return { statusCode: 200, body: JSON.stringify(assessments), headers };
        }
        if (event.httpMethod === 'POST' && path === '/assessments') {
            const body = JSON.parse(event.body || '{}');
            const newAssessment = await db.createAssessment({ ...body, timestamp: new Date().toISOString() });
            return { statusCode: 201, body: JSON.stringify(newAssessment), headers };
        }

        // --- Journal ---
        const journalHistoryMatch = path.match(/^\/journal\/history\/([a-zA-Z0-9-]+)$/);
        if (event.httpMethod === 'GET' && journalHistoryMatch) {
            const [, userId] = journalHistoryMatch;
            const entries = await db.getJournalEntries(userId);
            return { statusCode: 200, body: JSON.stringify(entries), headers };
        }
        if (event.httpMethod === 'POST' && path === '/journal/entry') {
            const body = JSON.parse(event.body || '{}');
            const newEntry = await db.createJournalEntry({ ...body, timestamp: new Date().toISOString() });
            return { statusCode: 201, body: JSON.stringify(newEntry), headers };
        }

        return { statusCode: 404, body: JSON.stringify({ message: 'Route not found in Wellness API' }), headers };
    } catch (error: any) {
        console.error('Error in /api/wellness:', error);
        return { statusCode: 500, body: JSON.stringify({ message: error.message }), headers };
    }
};

export { handler };