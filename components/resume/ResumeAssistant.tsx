import React, { useState } from 'react';
import { CYBER_ROLES } from '../../constants';
import { generateResumeContent } from '../../services/geminiService';
import type { User, GeneratedResumeContent } from '../../types';
import { ClipboardDocumentIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { GreenHatIcon } from '../../constants';

interface ResumeAssistantProps {
    user: User;
}

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-white p-4">
        <GreenHatIcon className="w-16 h-16 text-neon-green animate-pulse" />
        <h2 className="mt-6 text-xl font-mono">Crafting Your Resume...</h2>
        <p className="mt-2 text-gray-400">HatBot is tailoring your experience for your target role.</p>
        <div className="w-full max-w-md mt-8 bg-gray-700 rounded-full h-2.5">
            <div className="bg-neon-green h-2.5 rounded-full animate-loading-bar"></div>
        </div>
    </div>
);

const CopyToClipboardButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={handleCopy} className="absolute top-3 right-3 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600">
            {copied ? <CheckIcon className="h-5 w-5 text-neon-green" /> : <ClipboardDocumentIcon className="h-5 w-5 text-gray-400" />}
        </button>
    );
};

const ResumeAssistant: React.FC<ResumeAssistantProps> = ({ user }) => {
    const [formData, setFormData] = useState({
        experience: '', skills: '', projects: '', education: ''
    });
    const [targetRole, setTargetRole] = useState(CYBER_ROLES[0].title);
    const [generatedContent, setGeneratedContent] = useState<GeneratedResumeContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        if (!formData.experience || !formData.skills) {
            setError("Please fill in at least the Experience and Skills fields.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedContent(null);
        try {
            const content = await generateResumeContent({ ...formData, fullName: user.fullName, email: user.email }, targetRole);
            setGeneratedContent(content);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green transition-all placeholder-gray-500";
    const labelClass = "block mb-2 text-sm font-bold text-gray-300";

    return (
        <div className="p-4 sm:p-6 md:p-8 text-white">
            <h1 className="text-3xl font-bold text-neon-green font-mono">AI Resume Assistant</h1>
            <p className="mt-2 text-gray-400 max-w-3xl">Provide your details, choose a target role, and let HatBot generate key sections for your cybersecurity resume.</p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="space-y-6 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl">
                    <div>
                        <label htmlFor="targetRole" className={labelClass}>Target Role</label>
                        <select id="targetRole" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className={inputClass}>
                            {CYBER_ROLES.map(role => <option key={role.id} value={role.title}>{role.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="experience" className={labelClass}>Work Experience</label>
                        <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} rows={5} className={inputClass} placeholder="Describe your job roles and responsibilities..." />
                    </div>
                    <div>
                        <label htmlFor="skills" className={labelClass}>Skills</label>
                        <textarea id="skills" name="skills" value={formData.skills} onChange={handleChange} rows={3} className={inputClass} placeholder="List your technical skills, e.g., Python, Nmap, Wireshark, SIEM..." />
                    </div>
                    <div>
                        <label htmlFor="projects" className={labelClass}>Projects</label>
                        <textarea id="projects" name="projects" value={formData.projects} onChange={handleChange} rows={3} className={inputClass} placeholder="Describe any personal or academic projects..." />
                    </div>
                     <div>
                        <label htmlFor="education" className={labelClass}>Education</label>
                        <textarea id="education" name="education" value={formData.education} onChange={handleChange} rows={2} className={inputClass} placeholder="e.g., B.S. in Computer Science, CompTIA Security+..." />
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full py-3 font-bold text-dark-charcoal bg-neon-green rounded-lg transition-all duration-300 shadow-glow-green hover:shadow-glow-green-light disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2">
                        <SparklesIcon className="h-6 w-6" />
                        {isLoading ? 'Generating...' : 'Generate Content'}
                    </button>
                    {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                </div>

                {/* Generated Content Section */}
                <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl min-h-[400px]">
                    <h2 className="text-2xl font-bold text-white mb-4 font-mono">Generated Content</h2>
                    {isLoading && <LoadingState />}
                    {!isLoading && !generatedContent && (
                        <div className="flex items-center justify-center h-full text-center text-gray-500">
                            <p>Your AI-crafted resume content will appear here.</p>
                        </div>
                    )}
                    {generatedContent && (
                        <div className="space-y-6 animate-fadeIn">
                             <div className="relative p-4 bg-gray-800/50 rounded-lg">
                                <h3 className="font-bold text-neon-green mb-2">Professional Summary</h3>
                                <CopyToClipboardButton textToCopy={generatedContent.summary} />
                                <p className="text-gray-300 whitespace-pre-wrap">{generatedContent.summary}</p>
                            </div>
                            <div className="relative p-4 bg-gray-800/50 rounded-lg">
                                <h3 className="font-bold text-neon-green mb-2">Key Skills</h3>
                                <CopyToClipboardButton textToCopy={generatedContent.key_skills.join(', ')} />
                                <ul className="flex flex-wrap gap-2">
                                    {generatedContent.key_skills.map((skill, i) => (
                                        <li key={i} className="px-3 py-1 bg-neon-green/10 text-neon-green text-sm rounded-full">{skill}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative p-4 bg-gray-800/50 rounded-lg">
                                <h3 className="font-bold text-neon-green mb-2">Experience Bullet Points</h3>
                                <CopyToClipboardButton textToCopy={generatedContent.bullet_points.map(p => `- ${p}`).join('\n')} />
                                <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    {generatedContent.bullet_points.map((point, i) => <li key={i}>{point}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
            `}</style>
        </div>
    );
};

export default ResumeAssistant;
