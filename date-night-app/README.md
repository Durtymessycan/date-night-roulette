# 💕 Spin the Romance — Date Night Planner

An AI-powered date night planner that finds real restaurants and activities near you, with Classic and Adventure modes, saved dates, partner sharing, and a Surprise Me button.

---

## 🚀 Deploy to Vercel in 5 Steps

### Step 1 — Get your Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Push to GitHub
1. Create a new repo at [github.com/new](https://github.com/new)
2. In your terminal, from this folder:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **Add New Project**
3. Import your GitHub repo
4. Leave all build settings as default — Vercel auto-detects Vite
5. Click **Deploy**

### Step 4 — Add your API Key
1. In your Vercel project, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from Step 1
   - **Environments:** Production, Preview, Development ✓ all three
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

### Step 5 — Share it!
Your app is now live at `https://your-project-name.vercel.app` 🎉

---

## 💻 Run Locally

```bash
# Install dependencies
npm install

# Copy env file and add your key
cp .env.example .env.local
# Edit .env.local and paste your ANTHROPIC_API_KEY

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
date-night-app/
├── api/
│   └── claude.js        # Vercel serverless proxy (keeps API key secret)
├── src/
│   ├── main.jsx         # React entry point
│   └── App.jsx          # Main app component
├── index.html           # HTML shell
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel routing config
├── .env.example         # Template for environment variables
└── package.json
```

---

## 🔑 Why the API Proxy?

The `api/claude.js` file is a Vercel serverless function that sits between your app and Anthropic. Your API key lives only in Vercel's environment variables — it's **never sent to the browser** and can't be stolen by users inspecting your site.

---

## ✨ Features

- 🥂 **Classic Date Night** — restaurant + fun activity (movies, axe throwing, concerts, escape rooms...)
- 🏔️ **Wild Adventure** — outdoor thrills (rafting, hiking, kayaking, climbing, zip-lining...)
- 🎲 **Surprise Me** — randomizes vibe, budget, and radius for you
- 💰 Budget selector (budget / mid-range / splurge)
- 📍 Travel radius (5 / 10 / 25 / 50 miles)
- 📡 GPS location detection
- 🔗 Booking links for restaurants and activities
- ♡ Save favorite date plans (stored locally)
- 💌 Share with your partner via copy, text, or WhatsApp
