# Phillip V. Menditto P.A. – Website

A professional, modern, and high-performance website built for the law office of Phillip V. Menditto, a Broward County DUI & Criminal Defense Attorney. The site is fully responsive, statically served for maximum speed, and features an integrated AI Legal Assistant named "Grace."

## 🚀 Features

- **Blazing Fast Performance**: Built as a zero-dependency, single-page HTML application using React (via Babel Standalone), Tailwind CSS (CDN), and Framer Motion. 
- **AI Legal Assistant ("Grace")**: A built-in chat interface powered by the Gemini 2.5 Flash AI model. It helps users with common legal pipeline questions and funnels them towards scheduling a free consultation.
- **Modern UI/UX**: Dark mode by default with elegant gold accents, clean typography, and smooth scroll animations.
- **Embedded Media**: Native YouTube video integration explaining the firm's elite defense process.
- **Serverless API**: The Gemini API key is securely proxied through a Vercel Serverless Function (`api/chat.js`) to protect sensitive credentials.

## 🛠️ Deployment (Vercel)

This project is configured to be deployed instantly and seamlessly using [Vercel](https://vercel.com).

### Prerequisites
- A Vercel account linked to your GitHub repository.
- A Google Gemini API Key from Google AI Studio.

### Steps to Deploy
1. Push this code to your GitHub repository.
2. Import the repository in your Vercel Dashboard.
3. Vercel will automatically detect the custom configuration file which skips the build process (since no builds are needed for this perfectly static architecture).
4. **CRITICAL:** you **MUST** configure the Gemini API key securely for the Chat Assistant to work!
   - In your Vercel project, go to **Settings** > **Environment Variables**.
   - Add a new variable:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** *Your actual API Key (e.g., AIza...)*   
   - Click **Save**.
5. Click **Deploy**!

## 📁 Project Structure

- `index.html`: The primary frontend file. Contains all user interfaces, components (React), CSS configuration, and text content.
- `api/chat.js`: The backend Vercel Serverless Function. It receives chat requests from the website, injects your secret API key, and forwards it to Google securely.
- `assets/`: Directory for static images (e.g., the hero background).
- `package.json`: Configuration specifying that zero build steps are required to prevent Vercel deployment errors.
