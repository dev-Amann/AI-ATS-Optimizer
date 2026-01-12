import React, { useState, useCallback } from 'react';
import { FileText, Briefcase, Search, Loader2, UploadCloud, AlertCircle } from 'lucide-react';
import { analyzeResume } from './services/geminiService';
import { ATSAnalysis } from './types';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
    const [role, setRole] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);

    const handleAnalyze = useCallback(async () => {
        // Input validation
        if (!role.trim() && !resumeText.trim()) {
            setError("Please provide both a target role and resume content.");
            return;
        }
        if (!role.trim()) {
            setError("Please enter a target job role.");
            return;
        }
        if (!resumeText.trim()) {
            setError("Please paste your resume content.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await analyzeResume(role, resumeText);
            setAnalysis(result);
        } catch (err: any) {
            setError(err.message || "An error occurred while analyzing the resume. Please check your API key and try again.");
        } finally {
            setLoading(false);
        }
    }, [role, resumeText]);

    const handleReset = () => {
        setAnalysis(null);
        setError(null);
        setRole('');
        setResumeText('');
    };

    const handleSampleFill = () => {
        setRole("Senior Frontend Engineer");
        setResumeText(`
John Doe
Software Developer
Email: john@example.com

Summary:
Passionate developer with experience in building web applications. 

Experience:
Web Developer at Tech Corp (2020 - Present)
- Worked on the main company website using JavaScript and HTML.
- Fixed bugs and improved site speed.
- Collaborated with designers.

Junior Developer at StartUp Inc (2018 - 2020)
- Assisted in developing internal tools.
- Used Python for some backend scripts.

Skills:
JavaScript, HTML, CSS, Git, Python basics.
    `.trim());
        setError(null);
    };

    const clearError = () => {
        if (error) setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">ATS <span className="text-indigo-600">Optimizer</span></h1>
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                        AI-Powered Career Coach
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!analysis ? (
                    <div className="max-w-3xl mx-auto animate-fade-in">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Optimize Your Resume for ATS</h2>
                            <p className="text-slate-600 text-lg">
                                Stop getting rejected by bots. Paste your resume and target role to see exactly what's missing and how to fix it in seconds.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="p-8 space-y-6">

                                {/* Role Input */}
                                <div>
                                    <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Target Job Role
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className={`h-5 w-5 ${error && !role.trim() ? 'text-red-400' : 'text-slate-400'}`} />
                                        </div>
                                        <input
                                            type="text"
                                            id="role"
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-shadow ${error && !role.trim()
                                                ? 'border-red-300 ring-red-200 focus:border-red-500 focus:ring-red-200'
                                                : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                                                }`}
                                            placeholder="e.g. Senior Product Manager, React Developer..."
                                            value={role}
                                            onChange={(e) => {
                                                setRole(e.target.value);
                                                clearError();
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Resume Input */}
                                <div>
                                    <label htmlFor="resume" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Resume Content (Text)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <FileText className={`h-5 w-5 ${error && !resumeText.trim() ? 'text-red-400' : 'text-slate-400'}`} />
                                        </div>
                                        <textarea
                                            id="resume"
                                            rows={12}
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-6 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm font-mono transition-shadow ${error && !resumeText.trim()
                                                ? 'border-red-300 ring-red-200 focus:border-red-500 focus:ring-red-200'
                                                : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                                                }`}
                                            placeholder="Paste your full resume text here..."
                                            value={resumeText}
                                            onChange={(e) => {
                                                setResumeText(e.target.value);
                                                clearError();
                                            }}
                                        />
                                        <div className="absolute bottom-3 right-3">
                                            <button
                                                onClick={handleSampleFill}
                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded-md transition-colors"
                                            >
                                                Auto-fill Sample
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="pt-4 flex flex-col gap-4">
                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 text-sm animate-pulse">
                                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                            <div>
                                                <span className="font-bold">Error:</span> {error}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={loading}
                                        className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-base font-medium text-white transition-all transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                      ${loading
                                                ? 'bg-indigo-300 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'}`}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                Analyzing with AI...
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud className="-ml-1 mr-3 h-5 w-5" />
                                                Analyze Resume
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-xs text-slate-400">
                                        Powered by Groq AI. Your data is processed for analysis only.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Dashboard data={analysis} onReset={handleReset} />
                )}
            </main>
        </div>
    );
};

export default App;
