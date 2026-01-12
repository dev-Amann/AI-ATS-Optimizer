export interface ATSAnalysis {
    skill_match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
    resume_issues: string[];
    improvement_suggestions: string[];
    simulated_score_after_improvements: number;
}

export interface AnalysisState {
    loading: boolean;
    error: string | null;
    result: ATSAnalysis | null;
}

export enum AnalysisStep {
    IDLE = 'IDLE',
    ANALYZING = 'ANALYZING',
    COMPLETE = 'COMPLETE',
    ERROR = 'ERROR'
}
