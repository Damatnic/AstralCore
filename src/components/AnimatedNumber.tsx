
import React, { useState, useEffect, useRef } from 'react';

const easeOutExpo = (t: number) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const AnimatedNumber: React.FC<{ value: number; decimals?: number }> = ({ value, decimals = 0 }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const frameRef = useRef<number | null>(null);
    
    const isFirstRun = useRef(true);

    useEffect(() => {
        // Don't animate on the initial render.
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const startValue = displayValue;
        const endValue = value;
        const duration = 1500; // Animation duration in milliseconds
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const t = Math.min(progress / duration, 1);
            const easedT = easeOutExpo(t);
            
            const currentNumber = startValue + (endValue - startValue) * easedT;
            
            setDisplayValue(currentNumber);

            if (progress < duration) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                // Ensure the final value is exact
                setDisplayValue(endValue);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [value]); // Re-run effect only when the target 'value' prop changes

    return <>{displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
};