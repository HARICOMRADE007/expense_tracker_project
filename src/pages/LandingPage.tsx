import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, Shield, Smartphone } from 'lucide-react';

interface LandingPageProps {
    isDark: boolean;
}

const LandingPage = ({ isDark }: LandingPageProps) => {
    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
                : 'bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900'
            }`}>
            {/* Navigation */}
            <nav className={`fixed w-full z-10 backdrop-blur-lg border-b ${isDark ? 'border-white/10 bg-gray-900/50' : 'border-black/5 bg-white/50'
                }`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-green-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                            SpendWise
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/login" className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                            }`}>
                            Sign In
                        </Link>
                        <Link to="/login" className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors shadow-lg hover:shadow-blue-500/25">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto text-center max-w-4xl">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 font-medium text-sm animate-fade-in">
                        New: AI-Powered Insights 🤖
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-green-500 to-cyan-500 bg-clip-text text-transparent leading-tight">
                        Track smarter. <br />
                        Spend better.
                    </h1>
                    <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Take control of your finances with SpendWise. A smart way to track expenses,
                        control budgets, and understand spending using AI.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/login" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-green-500/25 flex items-center gap-2">
                            Start for Free <ArrowRight size={20} />
                        </Link>
                        <button className={`px-8 py-4 rounded-xl font-bold text-lg border transition-colors ${isDark
                                ? 'border-white/20 hover:bg-white/5'
                                : 'border-black/10 hover:bg-black/5'
                            }`}>
                            View Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className={`py-20 px-6 ${isDark ? 'bg-black/20' : 'bg-white/40'
                } backdrop-blur-sm`}>
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<PieChart className="w-8 h-8 text-blue-500" />}
                            title="Visual Analytics"
                            description="See exactly where your money goes with beautiful interactive charts and breakdowns."
                            isDark={isDark}
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-green-500" />}
                            title="Secure & Private"
                            description="Your data is encrypted and secure. Row-level security ensures only you see your expenses."
                            isDark={isDark}
                        />
                        <FeatureCard
                            icon={<Smartphone className="w-8 h-8 text-purple-500" />}
                            title="AI Insights"
                            description="Get personalized recommendations on how to save more based on your spending habits."
                            isDark={isDark}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-12 px-6 border-t ${isDark ? 'border-white/10' : 'border-black/5'
                }`}>
                <div className="container mx-auto text-center">
                    <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                        © 2026 SpendWise. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, isDark }: { icon: any, title: string, description: string, isDark: boolean }) => (
    <div className={`p-8 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-xl ${isDark
            ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-100 hover:border-blue-100'
        }`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-gray-700/50' : 'bg-blue-50'
            }`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {description}
        </p>
    </div>
);

export default LandingPage;
