import React from 'react';
import { ATSAnalysis } from '../types';
import ScoreGauge from './ScoreGauge';
import { CheckCircle2, AlertCircle, TrendingUp, XCircle, ArrowRight } from 'lucide-react';

interface DashboardProps {
    data: ATSAnalysis;
    onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return '#22c55e'; // Green
        if (score >= 60) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
                <button
                    onClick={onReset}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Analyze Another
                </button>
            </div>

            {/* Scores Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Current Match</h3>
                    <ScoreGauge
                        score={data.skill_match_percentage}
                        label="ATS Score"
                        color={getScoreColor(data.skill_match_percentage)}
                    />
                    <p className="text-center text-slate-500 text-sm mt-[-20px] px-4">
                        Based on keyword matching and experience relevance.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-6 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={100} className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-indigo-900 mb-2">Potential Score</h3>
                    <ScoreGauge
                        score={data.simulated_score_after_improvements}
                        label="Simulated"
                        color="#6366f1"
                    />
                    <div className="mt-[-20px] flex items-center gap-2 text-indigo-700 text-sm font-medium bg-indigo-100/50 px-3 py-1 rounded-full">
                        <TrendingUp size={16} />
                        <span>+{data.simulated_score_after_improvements - data.skill_match_percentage}% Growth Potential</span>
                    </div>
                </div>
            </div>

            {/* Skills Gap Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="text-green-500" />
                        <h3 className="text-lg font-semibold text-slate-800">Matched Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.matched_skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-100 font-medium">
                                {skill}
                            </span>
                        ))}
                        {data.matched_skills.length === 0 && (
                            <span className="text-slate-400 italic text-sm">No specific strong matches found.</span>
                        )}
                    </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <XCircle className="text-red-500" />
                        <h3 className="text-lg font-semibold text-slate-800">Missing / Weak Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.missing_skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-100 font-medium">
                                {skill}
                            </span>
                        ))}
                        {data.missing_skills.length === 0 && (
                            <span className="text-slate-400 italic text-sm">Great job! No major skills missing.</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Deep Dive Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issues */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="text-amber-500" />
                        <h3 className="text-lg font-semibold text-slate-800">Critical Issues</h3>
                    </div>
                    <ul className="space-y-3">
                        {data.resume_issues.map((issue, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm bg-amber-50/50 p-3 rounded-lg">
                                <span className="mt-0.5 min-w-[6px] h-[6px] rounded-full bg-amber-500 block"></span>
                                {issue}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Improvements */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <ArrowRight className="text-indigo-500" />
                        <h3 className="text-lg font-semibold text-slate-800">Action Plan</h3>
                    </div>
                    <ul className="space-y-3">
                        {data.improvement_suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm bg-indigo-50/50 p-3 rounded-lg group hover:bg-indigo-50 transition-colors">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold mt-0.5">
                                    {idx + 1}
                                </span>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
