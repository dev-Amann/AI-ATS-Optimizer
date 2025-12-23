<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YnBEtoDFF6SNuB-hdF29LpggFd7M19h-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

To deploy this application to Vercel, follow these steps:

1. **Push to GitHub**: Make sure your project is pushed to a GitHub repository.

2. **Import Project**:
   - Go to [Vercel](https://vercel.com/) and log in.
   - Click **"Add New..."** -> **"Project"**.
   - Select your GitHub repository.

3. **Configure Environment Variables**:
   - In the **"Environment Variables"** section of the deployment configuration:
   - Key: `GEMINI_API_KEY`
   - Value: Your actual Gemini API Key (e.g., `AIzaSy...`)

4. **Deploy**:
   - Click **"Deploy"**.
   - Vercel will build and deploy your application. Once finished, you will get a live URL.
