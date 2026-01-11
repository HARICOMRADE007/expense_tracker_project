import { useState, useEffect } from 'react';
import { Sparkles, Key, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { generateInsights } from '../services/aiService';
import { Expense } from '../types/expense';

interface Props {
    expenses: Expense[];
    isDark: boolean;
}

const AiInsights = ({ expenses, isDark }: Props) => {
    const [apiKey, setApiKey] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
            setShowInput(false);
        } else {
            setShowInput(true);
        }
    }, []);

    const handleSaveKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setShowInput(false);
    };

    const handleGenerate = async () => {
        if (!apiKey) {
            setShowInput(true);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await generateInsights(expenses, apiKey);
            setInsights(result);
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('Key')) {
                setShowInput(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const clearKey = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setShowInput(true);
        setInsights(null);
    };

    return (
        <div className={`${isDark ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'
            } backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border relative overflow-hidden`}>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                            <Sparkles className={`w-6 h-6 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                AI Spending Insights
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Powered by Google Gemini
                            </p>
                        </div>
                    </div>

                    {!showInput && apiKey && (
                        <button onClick={clearKey} className={`text-xs px-2 py-1 rounded border ${isDark ? 'border-red-900/50 text-red-400 hover:bg-red-900/20' : 'border-red-100 text-red-500 hover:bg-red-50'}`}>
                            Remove Key
                        </button>
                    )}
                </div>

                {showInput ? (
                    <div className={`p-6 rounded-2xl ${isDark ? 'bg-black/20' : 'bg-white/50'} border border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-sm text-yellow-500">
                                <Lock size={16} />
                                <span>Your API Key is stored locally on your device.</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="Enter your Gemini API Key"
                                        className={`w-full pl-10 pr-4 py-2 rounded-xl outline-none border transition-all ${isDark
                                                ? 'bg-gray-800/50 border-gray-600 focus:border-indigo-500 text-white'
                                                : 'bg-white border-gray-200 focus:border-indigo-500'
                                            }`}
                                    />
                                </div>
                                <button
                                    onClick={handleSaveKey}
                                    disabled={!apiKey}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Save
                                </button>
                            </div>
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-400 hover:underline text-center"
                            >
                                Get a free API Key from Google AI Studio &rarr;
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {error && (
                            <div className="text-sm text-red-400 flex items-center gap-2 bg-red-900/10 p-3 rounded-lg border border-red-900/20">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {insights ? (
                            <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}>
                                <div className="whitespace-pre-wrap">{insights}</div>
                            </div>
                        ) : (
                            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Click below to analyze your spending habits
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isDark
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-900/20'
                                    : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-200'
                                } shadow-lg`}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Analyzing Finances...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    {insights ? 'Regenerate Insights' : 'Generate Insights'}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiInsights;
