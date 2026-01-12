import { ATSAnalysis } from "../types";

export const analyzeResume = async (role: string, resumeText: string): Promise<ATSAnalysis> => {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, resumeText }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as ATSAnalysis;
};
