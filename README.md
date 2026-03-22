# VibeCoder AI 🚀

Chatbot powered by **Groq + Llama 3.3**. Works locally and on Vercel.

---

## Run Locally

### 1. Install Node.js
Download from nodejs.org if not installed.

### 2. Get Free Groq API Key
- Go to console.groq.com → sign up free
- Click API Keys → Create API Key
- Copy the key (starts with gsk_)

### 3. Create .env file
Copy .env.example to .env and add your key:
```
GROQ_API_KEY=gsk_your_key_here
```

### 4. Install & Run
```bash
npm install
npm run dev
```

### 5. Open in browser
Go to http://localhost:3000

---

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/YOUR_USERNAME/vibecoder-ai.git
git push -u origin main
```

### 2. Deploy
- Go to vercel.com → Add New Project → Import your repo
- Add Environment Variable: GROQ_API_KEY = gsk_your_key
- Click Deploy ✅

---

## File Structure
```
vibecoder-ai/
├── api/
│   └── chat.js        ← Groq API serverless function
├── public/
│   └── index.html     ← Full frontend UI
├── server.js          ← Local dev server (not used on Vercel)
├── vercel.json        ← Vercel routing config
├── package.json       ← Dependencies
├── .env.example       ← API key template
└── .gitignore
```
