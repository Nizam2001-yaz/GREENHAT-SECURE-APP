import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../../types';

interface QuizScreenProps {
    moduleTitle: string;
    questions: QuizQuestion[];
    onComplete: (score: number, total: number) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ moduleTitle, questions, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    
    const handleAnswerSelect = (answer: string) => {
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        let score = 0;
        for (let i = 0; i < totalQuestions; i++) {
            if (userAnswers[i] === questions[i].correctAnswer) {
                score++;
            }
        }
        onComplete(score, totalQuestions);
    };
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 text-white flex flex-col items-center">
            <div className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-neon-green font-mono">{moduleTitle} Quiz</h1>
                <div className="flex justify-between items-center mt-4 text-sm font-mono">
                    <p>Question {currentQuestionIndex + 1} of {totalQuestions}</p>
                    <p>Time Left: <span className={timeLeft < 60 ? 'text-red-400' : 'text-neon-green'}>{formatTime(timeLeft)}</span></p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                    <div className="bg-neon-green h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                </div>

                <div className="mt-8">
                    <p className="text-lg font-semibold text-gray-200">{currentQuestion.question}</p>
                    <div className="mt-6 space-y-4">
                        {currentQuestion.options.map((option, index) => (
                             <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full p-4 border-2 rounded-lg text-left transition-colors duration-200 flex items-center
                                    ${userAnswers[currentQuestionIndex] === option 
                                        ? 'border-neon-green bg-neon-green/10' 
                                        : 'border-gray-600 hover:border-neon-green/50 hover:bg-gray-800'}`
                                }
                            >
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${userAnswers[currentQuestionIndex] === option ? 'border-neon-green bg-neon-green' : 'border-gray-500'}`}>
                                   {userAnswers[currentQuestionIndex] === option && <div className="w-2 h-2 bg-dark-charcoal rounded-full"></div>}
                                </span>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="mt-8 flex justify-between items-center">
                    <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="px-6 py-2 font-bold bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    {currentQuestionIndex === totalQuestions - 1 ? (
                        <button onClick={handleSubmit} className="px-8 py-3 font-bold text-dark-charcoal bg-neon-green rounded-lg transition-all duration-300 shadow-glow-green hover:shadow-glow-green-light">
                            Submit Quiz
                        </button>
                    ) : (
                        <button onClick={handleNext} className="px-6 py-2 font-bold text-dark-charcoal bg-neon-green rounded-lg hover:bg-green-400">
                           Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizScreen;
