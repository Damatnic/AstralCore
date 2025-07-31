import React, { useState, useEffect, useRef } from 'react';
import { SendIcon } from '../components/icons'; // Using SendIcon as a Play icon
import { AppButton } from '../components/AppButton';

export const QuietSpaceView: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('pause');
    const [breathingText, setBreathingText] = useState('Begin');
    const intervalRef = useRef<number | null>(null);

    // Initialize Audio on mount
    useEffect(() => {
        if (!audioRef.current) {
            // Using a placeholder for royalty-free calming sound
            audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
            audioRef.current.loop = true;
        }
        
        // Cleanup on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const toggleSound = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            if (intervalRef.current) clearInterval(intervalRef.current);
            setBreathingPhase('pause');
            setBreathingText('Begin');
        } else {
            audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
            startBreathingCycle();
        }
        setIsPlaying(!isPlaying);
    };
    
    const startBreathingCycle = () => {
         const sequence: Array<{phase: typeof breathingPhase, text: string}> = [
            { phase: 'inhale', text: 'Inhale...' },
            { phase: 'hold', text: 'Hold' },
            { phase: 'exhale', text: 'Exhale...' },
            { phase: 'pause', text: 'Pause' }
        ];
        let currentPhaseIndex = 0;

        setBreathingPhase(sequence[currentPhaseIndex].phase);
        setBreathingText(sequence[currentPhaseIndex].text);

        intervalRef.current = window.setInterval(() => {
            currentPhaseIndex = (currentPhaseIndex + 1) % sequence.length;
            setBreathingPhase(sequence[currentPhaseIndex].phase);
            setBreathingText(sequence[currentPhaseIndex].text);
        }, 4000); // 4 seconds per phase
    }

    return (
        <div className="quiet-space-container">
            <h1 className="quiet-space-title">Astral Quiet Space</h1>
            <p className="view-subheader">Find your calm, breathe with intention.</p>

            <div className="breathing-circle-container">
                <div className={`breathing-circle ${breathingPhase}`}>
                    {breathingText}
                </div>
            </div>
            
            <p className="quiet-space-instructions">
                {isPlaying ? 'Follow the circle. Inhale as it expands, hold, and exhale as it contracts.' : 'Press the button below to start the guided breathing exercise and play calming ambient sound.'}
            </p>

            <AppButton className="quiet-space-button" onClick={toggleSound}>
                 <SendIcon />
                <span>{isPlaying ? 'Stop Guided Breathing' : 'Start Guided Breathing'}</span>
            </AppButton>

            <AppButton variant="secondary" onClick={() => window.open('https://www.healthline.com/health/breathing-exercises-for-anxiety', '_blank')}>
                Learn More About Breathing Exercises
            </AppButton>
        </div>
    );
};