import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ATSAnalysis } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    skill_match_percentage: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating how well the resume matches the job description.",
    },
    matched_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of skills found in the resume that match the job description.",
    },
    missing_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of important skills for the role that are missing from the resume.",
    },
    resume_issues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific weaknesses identified in the resume (e.g., lack of metrics, poor formatting, buzzwords).",
    },
    improvement_suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable steps the candidate can take to improve their ATS score.",
    },
    simulated_score_after_improvements: {
      type: Type.NUMBER,
      description: "A projected score (0-100) if the candidate implements the top suggestions.",
    },
  },
  required: [
    "skill_match_percentage",
    "matched_skills",
    "missing_skills",
    "resume_issues",
    "improvement_suggestions",
    "simulated_score_after_improvements",
  ],
};

export const analyzeResume = async (role: string, resumeText: string): Promise<ATSAnalysis> => {
  try {
    const ai = createClient();
    
    // We use gemini-3-flash-preview for speed and efficiency with JSON
    const modelId = "gemini-3-flash-preview"; 
    
    const prompt = `
      You are an expert Applicant Tracking System (ATS) and Career Coach.
      
      Analyze the following resume against the target job role.
      
      Target Role: ${role}
      
      Resume Content:
      ${resumeText}
      
      Tasks:
      1. Calculate a Skill Match Percentage (0–100) based on keyword relevance and experience.
      2. List matched skills present in the resume.
      3. List missing or weak skills required for the role that are absent.
      4. Identify resume weaknesses (projects, lack of metrics, bad keywords, structure issues).
      5. Suggest clear, actionable improvements to increase the ATS score.
      6. Simulate improvement: if the candidate adds the top 2 missing skills/fixes, estimate the new match percentage.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a strict but helpful ATS analyzer. Be critical about missing keywords and metrics.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(jsonText) as ATSAnalysis;
    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};