import { describe, test, expect } from '@jest/globals';
import { groupCheckInsByDay } from './chartUtils';
import { MoodCheckIn } from '../types';

describe('groupCheckInsByDay', () => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(12, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    
    const mockCheckIns: MoodCheckIn[] = [
        // Today's check-ins (avg 4)
        { id: '1', userToken: 'u1', timestamp: today.toISOString(), moodScore: 5, anxietyLevel: 1, sleepQuality: 5, energyLevel: 5, tags: [] },
        { id: '2', userToken: 'u1', timestamp: new Date(today.getTime() + 1000).toISOString(), moodScore: 3, anxietyLevel: 3, sleepQuality: 3, energyLevel: 3, tags: [] },
        // Yesterday's check-in (avg 2)
        { id: '3', userToken: 'u1', timestamp: yesterday.toISOString(), moodScore: 2, anxietyLevel: 4, sleepQuality: 2, energyLevel: 2, tags: [] },
        // 3 days ago check-in (avg 5)
        { id: '4', userToken: 'u1', timestamp: threeDaysAgo.toISOString(), moodScore: 5, anxietyLevel: 1, sleepQuality: 5, energyLevel: 5, tags: [] },
        // 8 days ago check-in (should be ignored for a 7-day chart)
        { id: '5', userToken: 'u1', timestamp: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), moodScore: 1, anxietyLevel: 5, sleepQuality: 1, energyLevel: 1, tags: [] },
    ];

    test('should return an array with the correct number of days', () => {
        const result = groupCheckInsByDay(mockCheckIns, 7);
        expect(result).toHaveLength(7);
    });

    test('should correctly calculate the average mood for days with entries', () => {
        const result = groupCheckInsByDay(mockCheckIns, 7);
        const todayData = result.find(d => new Date(d.date).getDate() === today.getDate());
        const yesterdayData = result.find(d => new Date(d.date).getDate() === yesterday.getDate());
        
        expect(todayData?.value).toBe(4); // (5 + 3) / 2
        expect(yesterdayData?.value).toBe(2);
    });

    test('should return 0 for days with no entries', () => {
        const result = groupCheckInsByDay(mockCheckIns, 7);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);
        const twoDaysAgoData = result.find(d => new Date(d.date).getDate() === twoDaysAgo.getDate());

        expect(twoDaysAgoData?.value).toBe(0);
    });

    test('should ignore entries older than the specified number of days', () => {
        const result = groupCheckInsByDay(mockCheckIns, 7);
        // The check-in from 8 days ago should not be in the result values
        const hasOldData = result.some(d => d.value === 1);
        expect(hasOldData).toBe(false);
    });

    test('should return formatted labels', () => {
        const result = groupCheckInsByDay(mockCheckIns, 7);
        const labels = result.map(d => d.label);
        expect(labels).toHaveLength(7);
        expect(labels[6]).toBe(today.toLocaleDateString('en-US', { weekday: 'short' })); // Last item is today
    });
});