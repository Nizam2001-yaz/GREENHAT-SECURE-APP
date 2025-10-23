// FIX: Import 'React' type to resolve 'Cannot find namespace 'React'' error.
import type React from 'react';

export interface User {
  fullName: string;
  email: string;
}

export enum AppScreen {
  SPLASH,
  AUTH,
  DASHBOARD,
}

export interface CyberRole {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface RoadmapResource {
  name: string;
  url?: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
  type: 'Concept' | 'Certification' | 'Skill' | 'Project';
  resources: RoadmapResource[];
}

export interface RoadmapMilestone {
  title: string;
  estimated_duration_weeks: number;
  steps: RoadmapStep[];
}

export interface Roadmap {
  roadmap: RoadmapMilestone[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export interface ResumeData {
    fullName: string;
    email: string;
    experience: string;
    skills: string;
    projects: string;
    education: string;
}

export interface GeneratedResumeContent {
    summary: string;
    key_skills: string[];
    bullet_points: string[];
}

export interface Module {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}