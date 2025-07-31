import { Habit, HabitCompletion, TrackedHabit } from '../types';

const areDatesConsecutive = (date1: Date, date2: Date): boolean => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

export const calculateStreaks = (
    trackedHabits: Habit[],
    completions: HabitCompletion[],
    userId: string
): TrackedHabit[] => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return trackedHabits.map(habit => {
        const habitCompletions = completions
            .filter(c => c.habitId === habit.id)
            .map(c => new Date(c.completedAt))
            .sort((a, b) => b.getTime() - a.getTime()); // Sort descending

        if (habitCompletions.length === 0) {
            return {
                userId,
                habitId: habit.id,
                trackedAt: '', // This should be set when tracking
                currentStreak: 0,
                longestStreak: 0,
                isCompletedToday: false,
            };
        }

        let currentStreak = 0;
        let longestStreak = 0;
        let tempCurrentStreak = 0;
        
        const isCompletedToday = isSameDay(habitCompletions[0], today);

        // Determine the starting point for streak calculation
        let lastDate = isCompletedToday ? new Date(today.getTime() + 24 * 60 * 60 * 1000) : today;

        for (let i = 0; i < habitCompletions.length; i++) {
            const completionDate = habitCompletions[i];
            
            if (areDatesConsecutive(lastDate, completionDate)) {
                tempCurrentStreak++;
            } else if (!isSameDay(lastDate, completionDate)) {
                 if (tempCurrentStreak > longestStreak) {
                    longestStreak = tempCurrentStreak;
                }
                tempCurrentStreak = 1; // Reset streak
            }
            lastDate = completionDate;
        }
        
        if (tempCurrentStreak > longestStreak) {
            longestStreak = tempCurrentStreak;
        }

        // Final check for current streak
        const firstCompletion = habitCompletions[0];
        if (isSameDay(firstCompletion, today) || isSameDay(firstCompletion, yesterday)) {
             // Re-calculate only the current streak from the latest completion
             currentStreak = 0;
             let lastStreakDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
             for(const completionDate of habitCompletions) {
                 if(areDatesConsecutive(lastStreakDate, completionDate) || isSameDay(lastStreakDate, today) && isSameDay(completionDate, today)) {
                    currentStreak++;
                 } else {
                     break;
                 }
                 lastStreakDate = completionDate;
             }
        }

        return {
            userId,
            habitId: habit.id,
            trackedAt: '',
            currentStreak,
            longestStreak,
            isCompletedToday,
        };
    });
};