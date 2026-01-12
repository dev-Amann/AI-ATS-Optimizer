import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error("GROQ_API_KEY is not set in .env file");
        return res.status(500).json({ error: 'Server configuration error: API key not found' });
    }

    try {
        const { role, resumeText } = req.body;

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
        return res.json(data);

    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({
            error: error.message || 'An error occurred while analyzing the resume'
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✓ API server running at http://localhost:${PORT}`);
});
