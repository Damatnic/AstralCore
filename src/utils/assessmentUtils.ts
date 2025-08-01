/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// PHQ-9 Depression Assessment Questions
export const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself"
];

// GAD-7 Anxiety Assessment Questions  
export const gad7Questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen"
];

// PHQ-9 scoring and interpretation
export const getPhq9Result = (score: number): { severity: string; recommendation: string } => {
    if (score >= 0 && score <= 4) {
        return {
            severity: "Minimal",
            recommendation: "Monitor symptoms and consider lifestyle changes like regular exercise, healthy sleep habits, and stress management."
        };
    } else if (score >= 5 && score <= 9) {
        return {
            severity: "Mild",
            recommendation: "Consider self-help strategies, lifestyle changes, and monitoring. May benefit from brief counseling or therapy."
        };
    } else if (score >= 10 && score <= 14) {
        return {
            severity: "Moderate",
            recommendation: "Therapy or counseling is recommended. Consider discussing treatment options with a healthcare provider."
        };
    } else if (score >= 15 && score <= 19) {
        return {
            severity: "Moderately Severe",
            recommendation: "Professional treatment is strongly recommended. Consider therapy and/or medication with a healthcare provider."
        };
    } else if (score >= 20 && score <= 27) {
        return {
            severity: "Severe",
            recommendation: "Immediate professional treatment is recommended. Please contact a healthcare provider or crisis helpline."
        };
    } else {
        return {
            severity: "Invalid Score",
            recommendation: "Please retake the assessment with valid responses."
        };
    }
};

// GAD-7 scoring and interpretation
export const getGad7Result = (score: number): { severity: string; recommendation: string } => {
    if (score >= 0 && score <= 4) {
        return {
            severity: "Minimal",
            recommendation: "Monitor symptoms and practice stress management techniques like deep breathing, meditation, or regular exercise."
        };
    } else if (score >= 5 && score <= 9) {
        return {
            severity: "Mild",
            recommendation: "Consider self-help strategies, relaxation techniques, and lifestyle changes. May benefit from counseling or therapy."
        };
    } else if (score >= 10 && score <= 14) {
        return {
            severity: "Moderate",
            recommendation: "Therapy or counseling is recommended. Consider discussing anxiety management with a healthcare provider."
        };
    } else if (score >= 15 && score <= 21) {
        return {
            severity: "Severe",
            recommendation: "Professional treatment is strongly recommended. Please contact a healthcare provider for anxiety treatment options."
        };
    } else {
        return {
            severity: "Invalid Score",
            recommendation: "Please retake the assessment with valid responses."
        };
    }
};