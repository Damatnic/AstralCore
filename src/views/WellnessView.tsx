import React, { useState, useMemo } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { ViewHeader } from '../components/ViewHeader';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { AppTextArea } from '../components/AppInput';
import { MoodCheckIn, Habit } from '../types';
import { groupCheckInsByDay, ChartDataPoint } from '../utils/chartUtils';
import { PlusIcon } from '../components/icons';
import { useWellnessStore } from '../stores/wellnessStore';

const MOOD_EMOJIS = ['😞', '🙁', '😐', '🙂', '😊'];
const MOOD_TAGS = ['Grateful', 'Anxious', 'Tired', 'Hopeful', 'Stressed', 'Calm', 'Lonely', 'Productive'];

const RangeSlider: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
    <div className="form-group">
        <label>{label}</label>
        <input
            type="range"
            min="1"
            max="5"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="wellness-slider"
        />
    </div>
);

const WellnessChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
    const getBarColor = (value: number) => {
        if (value <= 1.5) return 'var(--accent-danger)';
        if (value <= 2.5) return 'var(--accent-warning)';
        if (value <= 3.5) return 'var(--text-secondary)';
        if (value <= 4.5) return 'var(--accent-primary)';
        return 'var(--accent-success)';
    }

    return (
        <div className="wellness-chart">
            <div className="chart-y-axis">
                {MOOD_EMOJIS.slice().reverse().map((emoji, i) => <span key={i}>{emoji}</span>)}
            </div>
            <div className="chart-bars">
                {data.map((point, index) => (
                    <div key={index} className="chart-bar-group">
                        <div className="chart-bar-wrapper">
                            <div
                                className="chart-bar"
                                style={{
                                    height: `${point.value > 0 ? (point.value / 5) * 100 : 0}%`,
                                    backgroundColor: getBarColor(point.value)
                                }}
                                title={`Avg Mood: ${point.value.toFixed(1)}`}
                            ></div>
                        </div>
                        <span className="chart-label">{point.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CheckInTab: React.FC = () => {
    const { history, postCheckIn } = useWellnessStore();
    const { addToast } = useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [moodScore, setMoodScore] = useState(3);
    const [anxietyLevel, setAnxietyLevel] = useState(3);
    const [sleepQuality, setSleepQuality] = useState(3);
    const [energyLevel, setEnergyLevel] = useState(3);
    const [tags, setTags] = useState<string[]>([]);
    const [notes, setNotes] = useState('');

    const chartData = useMemo(() => groupCheckInsByDay(history, 7), [history]);

    const handleTagClick = (tag: string) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const resetForm = () => {
        setMoodScore(3);
        setAnxietyLevel(3);
        setSleepQuality(3);
        setEnergyLevel(3);
        setTags([]);
        setNotes('');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const checkInData: Omit<MoodCheckIn, 'id' | 'userToken' | 'timestamp'> = {
                moodScore,
                anxietyLevel,
                sleepQuality,
                energyLevel,
                tags,
                notes: notes.trim(),
            };
            await postCheckIn(checkInData);
            addToast('Your wellness check-in has been saved!', 'success');
            resetForm();
        } catch (error: any) {
            addToast(error.message || 'Failed to save check-in.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const hasCheckedInToday = useMemo(() => {
        if (!history || history.length === 0) return false;
        const today = new Date().toISOString().split('T')[0];
        return history.some(c => new Date(c.timestamp).toISOString().split('T')[0] === today);
    }, [history]);

    return (
    <>
        <Card>
            <h2>Daily Check-in</h2>
            {hasCheckedInToday ? (
                 <div className="empty-state" style={{padding: '2rem 1rem'}}>
                    <h3>Great job!</h3>
                    <p>You've already completed your check-in for today. Come back tomorrow!</p>
                </div>
            ) : (
                <>
                    <div className="form-group">
                        <label>How are you feeling overall today?</label>
                        <div className="mood-selector">
                            {MOOD_EMOJIS.map((emoji, index) => (
                                <button
                                    key={index}
                                    className={`mood-emoji-btn ${moodScore === index + 1 ? 'selected' : ''}`}
                                    onClick={() => setMoodScore(index + 1)}
                                    aria-label={`Mood score ${index + 1}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                    <RangeSlider label="Anxiety Level (Low to High)" value={anxietyLevel} onChange={setAnxietyLevel} />
                    <RangeSlider label="Sleep Quality (Poor to Great)" value={sleepQuality} onChange={setSleepQuality} />
                    <RangeSlider label="Energy Level (Low to High)" value={energyLevel} onChange={setEnergyLevel} />
                    <div className="form-group">
                        <label>Select tags that apply:</label>
                         <div className="tag-selector filter-buttons">
                            {MOOD_TAGS.map(tag => (
                                <AppButton
                                    key={tag}
                                    className={tags.includes(tag) ? 'active' : ''}
                                    onClick={() => handleTagClick(tag)}
                                    variant='secondary'
                                >
                                    {tag}
                                </AppButton>
                            ))}
                        </div>
                    </div>
                    <AppTextArea label="Notes (Private)" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any specific thoughts or events today?" rows={3} />
                    <div className="form-actions">
                        <AppButton onClick={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting}>Save Today's Check-in</AppButton>
                    </div>
                </>
            )}
        </Card>
        <Card>
            <h2>Your 7-Day Mood Trend</h2>
            {history.length > 0 ? (
                <WellnessChart data={chartData} />
            ) : (
                <p>No check-in history yet. Start tracking to see your trends!</p>
            )}
        </Card>
    </>
    );
};

const HabitsTab: React.FC = () => {
    const { predefinedHabits, trackedHabits, isLoadingHabits, trackHabit, untrackHabit, logCompletion } = useWellnessStore();

    const discoverableHabits = useMemo(() => {
        const trackedIds = new Set(trackedHabits.map(h => h.habitId));
        return predefinedHabits.filter(h => !trackedIds.has(h.id));
    }, [predefinedHabits, trackedHabits]);

    if (isLoadingHabits) {
        return <div className="loading-spinner" style={{ margin: '3rem auto' }}></div>;
    }
    
    return (
        <>
            <Card>
                <h2>My Habits</h2>
                {trackedHabits.length > 0 ? (
                    <ul className="habit-list">
                        {trackedHabits.map(habit => (
                            <li key={habit.habitId} className={`habit-item ${habit.isCompletedToday ? 'completed' : ''}`}>
                                <div className="habit-info">
                                    <h4>{predefinedHabits.find(h => h.id === habit.habitId)?.name}</h4>
                                    <p>{predefinedHabits.find(h => h.id === habit.habitId)?.description}</p>
                                </div>
                                <div className="habit-streak" title={`Current Streak: ${habit.currentStreak} days`}>
                                    <span>🔥</span>
                                    <span>{habit.currentStreak}</span>
                                </div>
                                <AppButton
                                    variant={habit.isCompletedToday ? 'success' : 'primary'}
                                    onClick={() => logCompletion(habit.habitId)}
                                    disabled={habit.isCompletedToday}
                                >
                                    {habit.isCompletedToday ? 'Done!' : 'Complete'}
                                </AppButton>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You're not tracking any habits yet. Add one from the list below to get started!</p>
                )}
            </Card>
             <Card>
                <h2>Discover New Habits</h2>
                {discoverableHabits.length > 0 ? (
                     <ul className="habit-list">
                        {discoverableHabits.map(habit => (
                            <li key={habit.id} className="habit-item">
                                <div className="habit-info">
                                    <h4>{habit.name}</h4>
                                    <p>{habit.description}</p>
                                </div>
                                <AppButton variant="secondary" onClick={() => trackHabit(habit.id)} icon={<PlusIcon />}>
                                    Track
                                </AppButton>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You're tracking all available habits. Great job!</p>
                )}
            </Card>
        </>
    );
};

const JournalTab: React.FC = () => {
    const { journalEntries, postJournalEntry } = useWellnessStore();
    const { addToast } = useNotification();
    const [newEntry, setNewEntry] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const MAX_LENGTH = 2000;

    const handleSubmit = async () => {
        if (!newEntry.trim()) return;
        setIsSubmitting(true);
        try {
            await postJournalEntry(newEntry);
            setNewEntry('');
            addToast('Journal entry saved.', 'success');
        } catch (error: any) {
            addToast(error.message || 'Failed to save journal entry.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Card>
                <h2>New Journal Entry</h2>
                <p>This is a private space for your thoughts. Only you can see these entries.</p>
                <AppTextArea
                    value={newEntry}
                    onChange={e => setNewEntry(e.target.value)}
                    placeholder="What's on your mind today?"
                    rows={5}
                    maxLength={MAX_LENGTH}
                />
                <div className="form-actions">
                    <AppButton onClick={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting || !newEntry.trim()}>
                        Save Entry
                    </AppButton>
                </div>
            </Card>

            <div className="journal-history">
                <h2>Past Entries</h2>
                {journalEntries.length > 0 ? (
                    journalEntries.map(entry => (
                        <Card key={entry.id} className="journal-entry-card">
                            <p className="journal-entry-timestamp">
                                {new Date(entry.timestamp).toLocaleDateString(undefined, {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                            <p className="journal-entry-content">{entry.content}</p>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <p>You have no journal entries yet.</p>
                    </Card>
                )}
            </div>
        </>
    );
};

export const WellnessView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'checkin' | 'habits' | 'journal'>('checkin');

    return (
        <>
            <style>{`
                .wellness-slider { width: 100%; }
                .mood-selector { display: flex; justify-content: space-around; margin-bottom: 1rem; }
                .mood-emoji-btn { font-size: 2.5rem; cursor: pointer; transition: transform 0.2s; padding: 0.5rem; border-radius: 50%; border: 2px solid transparent; background: none; }
                .mood-emoji-btn:hover { transform: scale(1.1); }
                .mood-emoji-btn.selected { transform: scale(1.2); border-color: var(--accent-primary); background: color-mix(in srgb, var(--accent-primary) 15%, transparent); }
                .tag-selector { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
                .wellness-chart { display: flex; gap: 1rem; height: 250px; margin-top: 2rem; }
                .chart-y-axis { display: flex; flex-direction: column-reverse; justify-content: space-between; font-size: 1.25rem; }
                .chart-bars { display: flex; flex-grow: 1; justify-content: space-around; border-left: 2px solid var(--border-color); border-bottom: 2px solid var(--border-color); padding-left: 0.5rem; }
                .chart-bar-group { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; width: 10%; }
                .chart-bar-wrapper { flex-grow: 1; width: 100%; display: flex; align-items: flex-end; justify-content: center;}
                .chart-bar { width: 60%; background-color: var(--accent-primary); border-radius: 4px 4px 0 0; transition: height 0.5s ease-out, background-color 0.5s; }
                .chart-bar:hover { opacity: 0.8; }
                .chart-label { margin-top: 0.5rem; font-weight: 600; color: var(--text-secondary); font-size: 0.875rem; }
                .journal-history { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
                .journal-entry-card { padding: 1rem 1.5rem; }
                .journal-entry-timestamp { font-weight: bold; color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem; }
                .journal-entry-content { white-space: pre-wrap; }
            `}</style>
            <ViewHeader title="My Wellness" subtitle="Track your mood, build healthy habits, and reflect in your private journal." />

            <div className="dashboard-tabs">
                <AppButton className={activeTab === 'checkin' ? 'active' : ''} onClick={() => setActiveTab('checkin')}>Check-in</AppButton>
                <AppButton className={activeTab === 'habits' ? 'active' : ''} onClick={() => setActiveTab('habits')}>Habits</AppButton>
                <AppButton className={activeTab === 'journal' ? 'active' : ''} onClick={() => setActiveTab('journal')}>Journal</AppButton>
            </div>

            {activeTab === 'checkin' && <CheckInTab />}
            {activeTab === 'habits' && <HabitsTab />}
            {activeTab === 'journal' && <JournalTab />}
        </>
    );
};