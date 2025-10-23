
import React, { useState } from 'react';
import { CYBER_ROLES } from '../../constants';
import type { CyberRole } from '../../types';

interface RoleSelectionProps {
    onRoadmapGenerate: (roles: string[], track: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoadmapGenerate }) => {
    const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
    const [track, setTrack] = useState<'Balanced' | 'Fast track' | 'Part-time'>('Balanced');

    const handleRoleSelect = (roleId: string) => {
        const newSelection = new Set(selectedRoles);
        if (newSelection.has(roleId)) {
            newSelection.delete(roleId);
        } else {
            newSelection.add(roleId);
        }
        setSelectedRoles(newSelection);
    };

    const handleSubmit = () => {
        const selectedRoleTitles = CYBER_ROLES
            .filter(role => selectedRoles.has(role.id))
            .map(role => role.title);
        
        if (selectedRoleTitles.length > 0) {
            onRoadmapGenerate(selectedRoleTitles, track);
        }
    };
    
    return (
        <div className="p-4 sm:p-6 md:p-8 text-white">
            <h1 className="text-3xl font-bold text-neon-green font-mono">Choose Your Path</h1>
            <p className="mt-2 text-gray-400 max-w-2xl">Select one or more roles you're interested in. We'll generate a personalized roadmap to guide your journey.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {CYBER_ROLES.map((role: CyberRole) => (
                    <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`p-6 bg-gray-900/50 backdrop-blur-sm border-2 rounded-2xl text-left transition-all duration-300 hover:border-neon-green hover:-translate-y-1
                            ${selectedRoles.has(role.id) ? 'border-neon-green shadow-glow-green-light' : 'border-gray-700'}`}
                    >
                        <role.icon className="h-10 w-10 mb-4 text-neon-green" />
                        <h3 className="text-xl font-bold text-white">{role.title}</h3>
                        <p className="mt-2 text-gray-400 text-sm">{role.description}</p>
                    </button>
                ))}
            </div>

            <div className="mt-10 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl">
                 <h2 className="text-xl font-bold text-white mb-4">Select Your Learning Pace</h2>
                 <div className="flex flex-col sm:flex-row gap-4">
                    {(['Fast track', 'Balanced', 'Part-time'] as const).map(pace => (
                         <button key={pace} onClick={() => setTrack(pace)} className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${track === pace ? 'bg-neon-green text-dark-charcoal' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                            {pace}
                         </button>
                    ))}
                 </div>
            </div>

            <div className="mt-10 text-center">
                <button 
                    onClick={handleSubmit}
                    disabled={selectedRoles.size === 0}
                    className="px-10 py-4 font-bold text-dark-charcoal bg-neon-green rounded-lg transition-all duration-300 shadow-glow-green hover:shadow-glow-green-light disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed text-lg"
                >
                    Generate My Roadmap
                </button>
                {selectedRoles.size === 0 && <p className="mt-4 text-gray-500 font-mono">Please select at least one role to proceed.</p>}
            </div>
        </div>
    );
};

export default RoleSelection;
