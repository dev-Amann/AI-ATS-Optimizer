import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

interface AnalyzeRequestBody {
    role: string;
    resumeText: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get API key from server-side environment variable
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("GROQ_API_KEY is not set in environment variables");
        return res.status(500).json({ error: 'Server configuration error: API key not found' });
    }

    try {
        const { role, resumeText } = req.body as AnalyzeRequestBody;

        // Validate input
        if (!role || !resumeText) {
            return res.status(400).json({ error: 'Missing required fields: role and resumeText' });
        }

        const groq = new Groq({ apiKey });

        const prompt = `You are an expert Applicant Tracking System (ATS) and Career Coach.

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

Respond ONLY with valid JSON in this exact format:
{
  "skill_match_percentage": <number 0-100>,
  "matched_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "resume_issues": ["issue1", "issue2", ...],
  "improvement_suggestions": ["suggestion1", "suggestion2", ...],
  "simulated_score_after_improvements": <number 0-100>
}`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a strict but helpful ATS analyzer. Be critical about missing keywords and metrics. Always respond with valid JSON only, no markdown or explanations."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const responseText = completion.choices[0]?.message?.content;
        if (!responseText) {
            return res.status(500).json({ error: 'No response received from AI model' });
        }

        const data = JSON.parse(responseText);
        return res.status(200).json(data);

    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({
            error: error.message || 'An error occurred while analyzing the resume'
        });
    }
}
