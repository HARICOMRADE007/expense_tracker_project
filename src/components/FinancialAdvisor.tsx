import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Key, ChevronRight, Settings } from 'lucide-react';
import { chatWithAdvisor } from '../services/aiService';
import { Expense } from '../types/expense';

interface Props {
    expenses: Expense[];
    isDark: boolean;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
}

const DEFAULT_KEY = 'AIzaSyC24UxReyHuC5ylDR7BT6UlxKGkHA88tI8';

const FinancialAdvisor = ({ expenses, isDark }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [isSetup, setIsSetup] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedKey = localStorage.getItem('spendwise_api_key');
        if (storedKey) {
            setApiKey(storedKey);
            setIsSetup(true);
            addWelcomeMessage();
        } else {
            // Pre-fill with the provided key for convenience, but still show setup
            setApiKey(DEFAULT_KEY);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const addWelcomeMessage = () => {
        setMessages([{
            id: 'welcome',
            text: "Hi! I'm your SpendWise Advisor. 🤖\n\nI can analyze your expenses and help you make better financial decisions. Ask me anything like:\n• 'How much did I spend on food?'\n• 'How can I save more?'",
            sender: 'ai',
            timestamp: Date.now()
        }]);
    };

    const handleSetup = () => {
        localStorage.setItem('spendwise_api_key', apiKey);
        setIsSetup(true);
        setShowSettings(false);
        if (!isSetup) addWelcomeMessage();
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            text: inputText,
            sender: 'user',
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            const responseText = await chatWithAdvisor(inputText, expenses, apiKey);

            const aiMsg: Message = {
                id: crypto.randomUUID(),
                text: responseText,
                sender: 'ai',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: crypto.randomUUID(),
                text: "I'm having trouble connecting right now. Please check your internet or API Key.",
                sender: 'ai',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 ${isOpen ? 'rotate-90 bg-red-500 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-bounce-slow'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] rounded-3xl shadow-2xl border backdrop-blur-xl flex flex-col overflow-hidden z-50 transition-all ${isDark
                    ? 'bg-gray-900/90 border-gray-700 text-white'
                    : 'bg-white/90 border-white/20 text-gray-800'
                    }`}>

                    {/* Header */}
                    <div className={`p-4 border-b flex items-center justify-between gap-3 ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-white/50'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Financial Advisor</h3>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Online • Powered by Gemini AI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                            title="Settings"
                        >
                            <Settings size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {!isSetup || showSettings ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                <div className={`p-4 rounded-full ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                                    <Key size={32} className="text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2">{showSettings ? 'Update API Key' : 'Activate Advisor'}</h4>
                                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {showSettings ? 'Enter a new key to update.' : 'To get personalized insights, the AI needs a "Key" to function.'}
                                    </p>
                                    <div className={`text-xs p-3 rounded-lg text-left mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                        <p className="font-semibold mb-1">Instructions:</p>
                                        <ol className="list-decimal pl-4 space-y-1">
                                            <li>Get a key from Google AI Studio.</li>
                                            <li>Or use the provided default key below.</li>
                                            <li>Click "Start Advisor".</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="Paste API Key here"
                                        className={`w-full p-3 rounded-xl border outline-none text-sm transition-all ${isDark ? 'bg-gray-800 border-gray-700 focus:border-blue-500' : 'bg-white border-gray-200 focus:border-blue-500'
                                            }`}
                                    />
                                    <button
                                        onClick={handleSetup}
                                        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Start Advisor <ChevronRight size={16} />
                                    </button>
                                    <p className="text-xs text-gray-500">This is a one-time setup.</p>
                                </div>
                            </div>
                        ) : (
                            // Chat Messages
                            <>
                                {messages.length === 0 && <div className="text-center text-gray-500 mt-10">Say Hello! 👋</div>}

                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : isDark ? 'bg-gray-800 text-gray-200 rounded-tl-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className={`p-3 rounded-2xl rounded-tl-none ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    {isSetup && (
                        <div className={`p-4 border-t ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-100 bg-white/50'}`}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about your spending..."
                                    className={`flex-1 p-2 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputText.trim() || loading}
                                    className={`p-2 rounded-xl transition-all ${!inputText.trim() || loading
                                        ? 'opacity-50 cursor-not-allowed text-gray-400'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default FinancialAdvisor;
