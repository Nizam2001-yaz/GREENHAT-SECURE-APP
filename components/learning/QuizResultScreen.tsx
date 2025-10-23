import React from 'react';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon, Squares2X2Icon } from '@heroicons/react/24/solid';

interface QuizResultScreenProps {
    score: number;
    total: number;
    onRetry: () => void;
    onBack: () => void;
}

const QuizResultScreen: React.FC<QuizResultScreenProps> = ({ score, total, onRetry, onBack }) => {
    const percentage = Math.round((score / total) * 100);
    const passingScore = 60; // 60% to pass
    const passed = percentage >= passingScore;

    return (
        <div className="p-4 sm:p-6 md:p-8 text-white flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center animate-fadeIn">
                <h1 className="text-3xl font-bold font-mono mb-4">Quiz Complete!</h1>
                
                <div className={`inline-block p-4 rounded-full ${passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {passed ? (
                        <CheckCircleIcon className="h-16 w-16 text-neon-green" />
                    ) : (
                        <XCircleIcon className="h-16 w-16 text-red-400" />
                    )}
                </div>

                <h2 className={`mt-4 text-4xl font-bold ${passed ? 'text-neon-green' : 'text-red-400'}`}>
                    {passed ? 'Congratulations, You Passed!' : 'Keep Trying!'}
                </h2>
                
                <p className="mt-2 text-gray-300 text-lg">You scored</p>
                <p className="text-6xl font-bold my-4 text-white">{score} <span className="text-4xl font-normal text-gray-400">/ {total}</span></p>
                <p className="text-2xl text-neon-green font-mono">({percentage}%)</p>

                <div className="mt-8 flex justify-center gap-4">
                    <button 
                        onClick={onRetry} 
                        className="flex items-center gap-2 px-6 py-3 font-bold bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <ArrowPathIcon className="h-5 w-5" />
                        Try Again
                    </button>
                    <button 
                        onClick={onBack} 
                        className="flex items-center gap-2 px-6 py-3 font-bold text-dark-charcoal bg-neon-green rounded-lg hover:bg-green-400 transition-colors"
                    >
                        <Squares2X2Icon className="h-5 w-5" />
                        Back to Modules
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
            `}</style>
        </div>
    );
};

export default QuizResultScreen;
