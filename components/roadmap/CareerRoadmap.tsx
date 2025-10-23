import React, { useState } from 'react';
import type { Roadmap, RoadmapMilestone, RoadmapStep } from '../../types';
import { ChevronDownIcon, LinkIcon, AcademicCapIcon, CodeBracketIcon, SparklesIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

const StepIcon: React.FC<{ type: RoadmapStep['type'] }> = ({ type }) => {
    switch (type) {
        case 'Concept': return <AcademicCapIcon className="h-6 w-6 text-neon-green" />;
        case 'Skill': return <SparklesIcon className="h-6 w-6 text-neon-green" />;
        case 'Project': return <CodeBracketIcon className="h-6 w-6 text-neon-green" />;
        case 'Certification': return <DocumentCheckIcon className="h-6 w-6 text-neon-green" />;
        default: return null;
    }
};

const CareerRoadmap: React.FC<{ roadmap: Roadmap }> = ({ roadmap }) => {
    const [openMilestone, setOpenMilestone] = useState<number | null>(0);

    const toggleMilestone = (index: number) => {
        setOpenMilestone(openMilestone === index ? null : index);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 text-white font-sans">
            <h1 className="text-3xl font-bold text-neon-green font-mono">Your Personalised Career Roadmap</h1>
            <p className="mt-2 text-gray-400">Here's your step-by-step guide. Complete each milestone to advance your career.</p>

            <div className="mt-8 relative">
                 {/* Timeline Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-700" aria-hidden="true"></div>
                
                {roadmap.roadmap.map((milestone, index) => (
                    <div key={index} className="relative mb-8">
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-8 h-8 bg-gray-800 border-2 border-neon-green rounded-full">
                               <span className="font-bold text-neon-green">{index + 1}</span>
                            </div>
                            <div className="flex-1 ml-4">
                                <button onClick={() => toggleMilestone(index)} className="w-full p-4 bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-2xl flex justify-between items-center text-left hover:border-neon-green/50 transition-colors">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{milestone.title}</h2>
                                        <p className="text-sm font-mono text-gray-400 mt-1">Est. Duration: {milestone.estimated_duration_weeks} weeks</p>
                                    </div>
                                    <ChevronDownIcon className={`h-6 w-6 text-gray-400 transition-transform ${openMilestone === index ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {openMilestone === index && (
                             <div className="ml-8 mt-4 pl-8 border-l-2 border-gray-700/50 animate-slideDown">
                                <div className="space-y-4">
                                    {milestone.steps.map((step, stepIndex) => (
                                        <div key={stepIndex} className="p-4 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <StepIcon type={step.type} />
                                                <div>
                                                    <h3 className="font-bold text-gray-200">{step.title} <span className="text-xs font-mono px-2 py-0.5 bg-neon-green/20 text-neon-green rounded-full ml-2">{step.type}</span></h3>
                                                    <p className="text-gray-400 mt-1 text-sm">{step.description}</p>
                                                    {step.resources.length > 0 && (
                                                        <div className="mt-3">
                                                            <h4 className="text-xs font-semibold text-gray-400 uppercase">Resources:</h4>
                                                            <ul className="list-none mt-1 space-y-1">
                                                                {step.resources.map((res, resIndex) => (
                                                                    <li key={resIndex}>
                                                                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-neon-green hover:underline">
                                                                            <LinkIcon className="h-4 w-4" />
                                                                            {res.name}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown { animation: slideDown 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default CareerRoadmap;