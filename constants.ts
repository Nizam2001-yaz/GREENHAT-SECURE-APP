import React from 'react';
import { ShieldCheckIcon, BugAntIcon, BuildingLibraryIcon, FireIcon, DocumentCheckIcon, EyeIcon, WifiIcon, ComputerDesktopIcon, CodeBracketSquareIcon, CloudIcon, KeyIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { CyberRole, Module } from './types';

// FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
// The file contains a React component but has a .ts extension, which does not allow JSX syntax by default.
export const GreenHatIcon: React.FC<{ className?: string }> = ({ className }) => (
    React.createElement('svg', { className, viewBox: "0 0 100 80", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement('path', { d: "M50 0C77.6142 0 100 11.1929 100 25V30H0V25C0 11.1929 22.3858 0 50 0Z", fill: "#00e676" }),
        React.createElement('path', { d: "M95 30H5V35C5 48.8071 25.1193 60 50 60C74.8807 60 95 48.8071 95 35V30Z", fill: "#00e676" }),
        React.createElement('path', { d: "M5 30H95V32H5V30Z", fill: "#1a1a1a" })
    )
);

export const CYBER_ROLES: CyberRole[] = [
  { id: 'soc-analyst', title: 'SOC Analyst', description: 'Be the first line of defense, monitoring and analyzing security alerts.', icon: EyeIcon },
  { id: 'pentester', title: 'Pentester / Ethical Hacker', description: 'Legally hack systems to find and fix security vulnerabilities.', icon: BugAntIcon },
  { id: 'incident-responder', title: 'Incident Responder', description: 'Respond to and mitigate cyberattacks in real-time.', icon: FireIcon },
  { id: 'security-analyst', title: 'Security Analyst', description: 'Protect systems and networks from cyber threats.', icon: ShieldCheckIcon },
  { id: 'grc-analyst', title: 'GRC Analyst', description: 'Manage governance, risk, and compliance within an organization.', icon: BuildingLibraryIcon },
  { id: 'compliance-analyst', title: 'Compliance Analyst', description: 'Ensure the organization adheres to security standards and regulations.', icon: DocumentCheckIcon },
];

export const MODULES: Module[] = [
    { id: 'networking', title: 'Networking Fundamentals', description: 'Understand the core concepts of networking, protocols, and architecture.', icon: WifiIcon },
    { id: 'os-security', title: 'Operating System Security', description: 'Learn to secure Windows, Linux, and macOS environments.', icon: ComputerDesktopIcon },
    { id: 'scripting', title: 'Scripting for Security', description: 'Automate tasks and build tools with Python and Bash.', icon: CodeBracketSquareIcon },
    { id: 'web-app-sec', title: 'Web App Security', description: 'Discover vulnerabilities like XSS, SQLi, and how to defend against them.', icon: ShieldCheckIcon },
    { id: 'crypto', title: 'Cryptography Basics', description: 'Grasp the fundamentals of encryption, hashing, and public key infrastructure.', icon: KeyIcon },
    { id: 'cloud-security', title: 'Cloud Security', description: 'Explore security principles for AWS, Azure, and GCP environments.', icon: CloudIcon },
    { id: 'forensics', title: 'Digital Forensics', description: 'Learn the process of investigating digital evidence after a security incident.', icon: CircleStackIcon },
];