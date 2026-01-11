import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full border border-red-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                            <p className="text-gray-600 mb-6">
                                The application encountered an error and could not load.
                            </p>

                            <div className="w-full bg-red-50 p-4 rounded-lg border border-red-100 text-left overflow-x-auto mb-6">
                                <p className="font-mono text-sm text-red-700 whitespace-pre-wrap break-words">
                                    {this.state.error?.message}
                                </p>
                                {this.state.error?.message?.includes('supabase') && (
                                    <p className="mt-4 text-xs text-red-600 font-semibold border-t border-red-200 pt-2">
                                        Tip: This usually means your Supabase URL or Key is missing in Netlify Environment Variables.
                                    </p>
                                )}
                            </div>

                            <button
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => window.location.reload()}
                            >
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
