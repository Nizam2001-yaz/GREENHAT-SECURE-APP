import React, { useState, useCallback } from 'react';
import { User, Roadmap } from '../../types';
import RoleSelection from '../roadmap/RoleSelection';
import CareerRoadmap from '../roadmap/CareerRoadmap';
import ResumeAssistant from '../resume/ResumeAssistant';
import LearningHub from '../learning/LearningHub';
import HatBot from '../bot/HatBot';
import { generateCareerRoadmap } from '../../services/geminiService';
import { GreenHatIcon } from '../../constants';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type DashboardView = 'roadmap_flow' | 'modules' | 'resume_assistant';

export const LoadingState: React.FC<{title?: string; subtitle?: string}> = ({
    title = "Generating Your Roadmap...",
    subtitle= "HatBot is analyzing your chosen roles and crafting the perfect plan."
}) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center text-white p-4">
        <GreenHatIcon className="w-20 h-20 text-neon-green animate-pulse" />
        <h2 className="mt-6 text-2xl font-mono">{title}</h2>
        <p className="mt-2 text-gray-400">{subtitle}</p>
        <div className="w-full max-w-md mt-8 bg-gray-700 rounded-full h-2.5">
            <div className="bg-neon-green h-2.5 rounded-full animate-loading-bar"></div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<DashboardView>('roadmap_flow');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);

  const handleRoadmapGenerate = useCallback(async (roles: string[], track: string) => {
    setIsRoadmapLoading(true);
    setError(null);
    try {
      const generatedRoadmap = await generateCareerRoadmap(roles, track);
      setRoadmap(generatedRoadmap);
      setRoadmapGenerated(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setRoadmapGenerated(false);
    } finally {
      setIsRoadmapLoading(false);
    }
  }, []);
  
  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center p-8 text-red-400">
          <h2 className="text-2xl font-bold">Generation Failed</h2>
          <p className="mt-2">{error}</p>
          <button onClick={() => { setError(null); }} className="mt-4 px-6 py-2 bg-neon-green text-dark-charcoal font-bold rounded-lg">Try Again</button>
        </div>
      );
    }

    switch (view) {
      case 'resume_assistant':
        return <ResumeAssistant user={user} />;
      case 'modules':
        return <LearningHub />;
      case 'roadmap_flow':
      default:
        if (isRoadmapLoading) return <LoadingState />;
        if (roadmapGenerated && roadmap) return <CareerRoadmap roadmap={roadmap} />;
        return <RoleSelection onRoadmapGenerate={handleRoadmapGenerate} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-charcoal text-white font-sans">
        <header className="p-4 bg-gray-900/50 backdrop-blur-md border-b border-neon-green/20 flex justify-between items-center sticky top-0 z-40">
            <div className="flex items-center gap-3">
                <GreenHatIcon className="w-10 h-10 text-neon-green"/>
                <span className="font-bold text-xl hidden sm:block">GreenHat Secure</span>
            </div>
            
            <nav className="absolute left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 bg-gray-800/50 p-1 rounded-lg border border-gray-700">
                    <button
                        onClick={() => setView('roadmap_flow')}
                        className={`px-3 py-1.5 sm:px-4 rounded-md text-sm font-semibold transition-colors ${view === 'roadmap_flow' ? 'bg-neon-green text-dark-charcoal' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        Roadmap
                    </button>
                    <button
                        onClick={() => setView('modules')}
                        className={`px-3 py-1.5 sm:px-4 rounded-md text-sm font-semibold transition-colors ${view === 'modules' ? 'bg-neon-green text-dark-charcoal' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        Modules
                    </button>
                    <button
                        onClick={() => setView('resume_assistant')}
                        className={`px-3 py-1.5 sm:px-4 rounded-md text-sm font-semibold transition-colors ${view === 'resume_assistant' ? 'bg-neon-green text-dark-charcoal' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        Resume Builder
                    </button>
                </div>
            </nav>

            <div className="flex items-center gap-4">
                <span className="text-gray-300 hidden md:block">Welcome, {user.fullName.split(' ')[0]}</span>
                <button onClick={onLogout} className="text-gray-400 hover:text-neon-green transition-colors" title="Logout">
                    <ArrowLeftOnRectangleIcon className="h-6 w-6"/>
                </button>
            </div>
        </header>
        <main>
            {renderContent()}
        </main>
        <HatBot />
        <style>{`
            @keyframes loading-bar {
                0% { width: 0%; }
                100% { width: 100%; }
            }
            .animate-loading-bar {
                animation: loading-bar 10s ease-in-out infinite;
            }
        `}</style>
    </div>
  );
};

export default Dashboard;