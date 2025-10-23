import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Roadmap, ChatMessage, ResumeData, GeneratedResumeContent, QuizQuestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          estimated_duration_weeks: { type: Type.INTEGER },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Concept', 'Certification', 'Skill', 'Project'] },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      url: { type: Type.STRING },
                    },
                    required: ['name'],
                  },
                },
              },
              required: ['title', 'description', 'type', 'resources'],
            },
          },
        },
        required: ['title', 'estimated_duration_weeks', 'steps'],
      },
    },
  },
  required: ['roadmap'],
};

export const generateCareerRoadmap = async (roles: string[], track: string): Promise<Roadmap> => {
  const prompt = `You are an expert cybersecurity career coach. A user has selected the following roles: ${roles.join(', ')}. They have chosen a ${track} learning pace. Generate a comprehensive, step-by-step career roadmap in a structured JSON format. The roadmap should guide them from foundational knowledge to job-readiness for the selected roles.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Roadmap;
  } catch (error) {
    console.error("Error generating career roadmap:", error);
    throw new Error("Failed to generate career roadmap. Please try again.");
  }
};


let chatInstance: Chat | null = null;

const getChatInstance = () => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are HatBot, a friendly and helpful AI assistant for aspiring cybersecurity professionals using the GreenHat Secure app. Be encouraging, slightly playful, and provide concise, accurate information. If you don't know something, say so. Prioritize pointing users to sections within the app if their question relates to learning, roadmaps, or quizzes.",
      },
    });
  }
  return chatInstance;
};

export const streamChatResponse = async (history: ChatMessage[], newMessage: string) => {
    const chat = getChatInstance();
    // Re-hydrate history if needed. For this app, we'll start fresh each time HatBot opens.
    // In a real app, you'd pass the existing history to the create method.
    return chat.sendMessageStream({ message: newMessage });
};


export const getJobMarketInsights = async (role: string) => {
    const prompt = `As a job market analyst, provide the latest insights for a "${role}" cybersecurity professional. Use your search tool to find current data. Return a concise summary covering: 1. Top 5 in-demand technical skills. 2. Average salary range in the USA (provide a source if possible). 3. Two highly recommended certifications right now. Format the output in clean markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || [];

        return {
            insights: response.text,
            sources: sources,
        };

    } catch (error) {
        console.error("Error fetching job market insights:", error);
        throw new Error("Failed to fetch job market insights.");
    }
};

export const generateResumeSummary = async (userInfo: string, role: string) => {
    const prompt = `Craft a professional and compelling resume summary (3-4 sentences) for a "${role}" role based on these user details: ${userInfo}. Highlight key strengths and align them with typical requirements for the role.`;
    
    try {
        const response = await ai.models.generateContent({
            // FIX: Updated model name to 'gemini-flash-lite-latest' according to the provided guidelines.
            model: "gemini-flash-lite-latest",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating resume summary:", error);
        throw new Error("Failed to generate resume summary.");
    }
}

const resumeContentSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A professional summary of 3-4 sentences."
        },
        key_skills: {
            type: Type.ARRAY,
            description: "A list of 5-7 key technical skills relevant to the target role.",
            items: { type: Type.STRING }
        },
        bullet_points: {
            type: Type.ARRAY,
            description: "A list of 3-5 impactful, action-oriented bullet points for the user's experience.",
            items: { type: Type.STRING }
        }
    },
    required: ['summary', 'key_skills', 'bullet_points']
};

export const generateResumeContent = async (userInfo: ResumeData, role: string): Promise<GeneratedResumeContent> => {
    const prompt = `You are an expert resume writer specializing in the cybersecurity field. A user wants to create a resume for a "${role}" position. Based on their provided information, generate ATS-friendly resume content in a structured JSON format. Focus on action verbs and quantifiable achievements.

User's Information:
- Full Name: ${userInfo.fullName}
- Email: ${userInfo.email}
- Education: ${userInfo.education}
- Skills: ${userInfo.skills}
- Projects: ${userInfo.projects}
- Experience: ${userInfo.experience}

Generate the following:
1.  A compelling professional summary (3-4 sentences).
2.  A list of 5-7 key technical skills, derived from the user's input but tailored for the "${role}" role.
3.  A list of 3-5 impactful, action-oriented bullet points that rewrite and enhance the user's experience description. Use the STAR method (Situation, Task, Action, Result) where possible.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeContentSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GeneratedResumeContent;
    } catch (error) {
        console.error("Error generating resume content:", error);
        throw new Error("Failed to generate resume content. Please try again.");
    }
};

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        minItems: 4,
                        maxItems: 4,
                    },
                    correctAnswer: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctAnswer'],
            },
        },
    },
    required: ['questions'],
};

export const generateQuizQuestions = async (moduleTitle: string): Promise<QuizQuestion[]> => {
    const prompt = `You are a cybersecurity curriculum developer. Create a quiz with exactly 50 multiple-choice questions for the module titled "${moduleTitle}". The questions should be challenging and cover a wide range of topics within the subject, suitable for someone preparing for a certification exam. Each question must have exactly 4 options. The 'correctAnswer' field must exactly match one of the strings in the 'options' array. Ensure the questions are diverse and not repetitive.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.questions as QuizQuestion[];
    } catch (error) {
        console.error("Error generating quiz questions:", error);
        throw new Error("Failed to generate quiz questions. The AI may be experiencing high load. Please try again in a moment.");
    }
};