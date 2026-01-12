# ATS Resume Optimizer

An AI-powered resume analyzer that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Get instant feedback on skill matches, missing keywords, and actionable improvements.

![ATS Resume Optimizer Screenshot](https://via.placeholder.com/800x400?text=ATS+Resume+Optimizer)

## Features

- 🎯 **ATS Score Analysis** - Get a match percentage based on keyword relevance and experience
- ✅ **Skill Matching** - See which skills from your resume align with the target role
- ❌ **Gap Identification** - Discover missing or weak skills you should add
- 📝 **Resume Issues** - Find problems like lack of metrics, poor keywords, or structure issues
- 💡 **Improvement Suggestions** - Get actionable steps to boost your ATS score
- 📈 **Score Simulation** - Preview your potential score after implementing suggestions

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| AI Model | Groq (Llama 3.3 70B) |
| Backend | Express (local) / Vercel Serverless (production) |

## Project Structure

```
ats-resume-optimizer/
├── src/                      # React frontend
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main component
│   ├── types/                # TypeScript interfaces
│   ├── components/           # UI components
│   │   ├── Dashboard.tsx     # Results dashboard
│   │   └── ScoreGauge.tsx    # Score visualization
│   └── services/
│       └── geminiService.ts  # API client
├── api/
│   └── analyze.ts            # Vercel serverless function
├── server.ts                 # Local development API server
├── .env                      # Environment variables (gitignored)
├── vercel.json               # Vercel deployment config
└── vite.config.ts            # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Groq API key ([Get one here](https://console.groq.com/keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ats-resume-optimizer.git
   cd ats-resume-optimizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   ```

4. **Start the development servers**

   Open two terminals:

   ```bash
   # Terminal 1: Start the API server
   npm run dev:server
   ```

   ```bash
   # Terminal 2: Start the frontend
   npm run dev
   ```

5. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run dev:server` | Start local Express API server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Import your repository

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `GROQ_API_KEY` = `your_groq_api_key`

4. **Deploy**
   - Vercel will automatically build and deploy

## API Security

✅ **Your API key is secure:**
- Stored only in environment variables (never in code)
- Read server-side only in `/api/analyze.ts`
- Frontend calls `/api/analyze` without ever seeing the key
- `.env` is gitignored and never pushed to version control

## How It Works

```
┌─────────────┐      POST /api/analyze       ┌──────────────────┐
│   Browser   │  ─────────────────────────▶  │  Vercel Function │
│  (Frontend) │                              │   (api/analyze)  │
└─────────────┘                              └────────┬─────────┘
                                                      │
                                                      │ GROQ_API_KEY
                                                      ▼
                                             ┌──────────────────┐
                                             │    Groq API      │
                                             │ (Llama 3.3 70B)  │
                                             └──────────────────┘
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React and Groq AI
