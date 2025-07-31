import { describe, test, expect } from '@jest/globals';
import { calculateStreaks } from './habitUtils';
import { Habit, HabitCompletion } from '../types';

const mockHabits: Habit[] = [
    { id: 'h1', name: 'Meditation', description: '', category: 'Mindfulness' },
    { id: 'h2', name: 'Walk', description: '', category: 'Physical' },
];

const userId = 'user123';
const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

const twoDaysAgo = new Date();
twoDaysAgo.setDate(today.getDate() - 2);
const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

const threeDaysAgo = new Date();
threeDaysAgo.setDate(today.getDate() - 3);
const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(today.getDate() - 5);
const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];


describe('calculateStreaks', () => {

    test('should return 0 for current and longest streak if no completions', () => {
        const completions: HabitCompletion[] = [];
        const result = calculateStreaks([mockHabits[0]], completions, userId);
        expect(result[0].currentStreak).toBe(0);
        expect(result[0].longestStreak).toBe(0);
        expect(result[0].isCompletedToday).toBe(false);
    });

    test('should calculate a 1-day streak if completed today only', () => {
        const completions: HabitCompletion[] = [
            { id: 'c1', userId, habitId: 'h1', completedAt: todayStr },
        ];
        const result = calculateStreaks([mockHabits[0]], completions, userId);
        expect(result[0].currentStreak).toBe(1);
        expect(result[0].longestStreak).toBe(1);
        expect(result[0].isCompletedToday).toBe(true);
    });

    test('should calculate a 1-day streak if completed yesterday only', () => {
        const completions: HabitCompletion[] = [
            { id: 'c1', userId, habitId: 'h1', completedAt: yesterdayStr },
        ];
        const result = calculateStreaks([mockHabits[0]], completions, userId);
        expect(result[0].currentStreak).toBe(1);
        expect(result[0].longestStreak).toBe(1);
        expect(result[0].isCompletedToday).toBe(false);
    });

    test('should calculate a 3-day current streak ending today', () => {
        const completions: HabitCompletion[] = [
            { id: 'c1', userId, habitId: 'h1', completedAt: todayStr },
            { id: 'c2', userId, habitId: 'h1', completedAt: yesterdayStr },
            { id: 'c3', userId, habitId: 'h1', completedAt: twoDaysAgoStr },
        ];
        const result = calculateStreaks([mockHabits[0]], completions, userId);
        expect(result[0].currentStreak).toBe(3);
        expect(result[0].longestStreak).toBe(3);
        expect(result[0].isCompletedToday).toBe(true);
    });

    test('should have a current streak of 0 if last completion was 2 days ago', () => {
        const completions: HabitCompletion[] = [
            { id: 'c1', userId, habitId: 'h1', completedAt: twoDaysAgoStr },
            { id: 'c2', userId, habitId: 'h1', completedAt: threeDaysAgoStr },
        ];
        const result = calculateStreaks([mockHabits[0]], completions, userId);
        expect(result[0].currentStreak).toBe(0);
        expect(result[0].longestStreak).toBe(2);
    });
    
    test('should correctly identify the longest streak when it is not the current streak', () => {
        const completions: HabitCompletion[] = [
            // Current streak of 1
            { id: 'c1', userId, habitId: 'h1', completedAt: todayStr },
            // Longest streak of 3
            { id: 'c2', userId, habitId: 'h1', completedAt: threeDaysAgoStr },
            { id: 'c3', userId, habitId: 'h1', completedAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
            { id: 'c4', userId, habitId: 'h1', completedAt: fiveDaysAgoStr },
        ];
        const result = calculateStreaks([mockHabits[0]], completions, userId);
        expect(result[0].currentStreak).toBe(1);
        expect(result[0].longestStreak).toBe(3);
        expect(result[0].isCompletedToday).toBe(true);
    });

    test('should handle multiple habits independently', () => {
        const completions: HabitCompletion[] = [
            // Habit 1: current streak of 2
            { id: 'c1', userId, habitId: 'h1', completedAt: todayStr },
            { id: 'c2', userId, habitId: 'h1', completedAt: yesterdayStr },
            // Habit 2: current streak of 0, longest of 1
            { id: 'c3', userId, habitId: 'h2', completedAt: threeDaysAgoStr },
        ];
        const result = calculateStreaks(mockHabits, completions, userId);
        const habit1Result = result.find(r => r.habitId === 'h1');
        const habit2Result = result.find(r => r.habitId === 'h2');

        expect(habit1Result?.currentStreak).toBe(2);
        expect(habit1Result?.longestStreak).toBe(2);
        expect(habit1Result?.isCompletedToday).toBe(true);

        expect(habit2Result?.currentStreak).toBe(0);
        expect(habit2Result?.longestStreak).toBe(1);
        expect(habit2Result?.isCompletedToday).toBe(false);
    });

    test('should handle multiple completions on the same day without double counting', () => {
        const completions: HabitCompletion[] = [
            { id: 'c1', userId, habitId: 'h1', completedAt: todayStr },
            { id: 'c2', userId, habitId: 'h1', completedAt: todayStr }, // Duplicate day
            { id: 'c3', userId, habitId: 'h1', completedAt: yesterdayStr },
        ];
        const result = calculateStreaks([mockHabits[0]], completions, userId);
        expect(result[0].currentStreak).toBe(2);
        expect(result[0].longestStreak).toBe(2);
    });
});