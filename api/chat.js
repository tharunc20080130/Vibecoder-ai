const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, systemPrompt } = req.body;
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ error: "messages array required" });

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: systemPrompt || `You are VibeCoder AI — a sharp, witty coding assistant with serious technical chops and a chill, modern vibe. You help developers write better code, debug issues, architect systems, and level up their skills.

Your personality:
- Direct and confident, never wishy-washy
- Use occasional dev slang naturally (no cringe)
- Give code examples freely — always formatted cleanly
- Acknowledge when something is genuinely complex vs trivially simple
- Celebrate good solutions with genuine enthusiasm
- You love elegant code and hate unnecessary complexity

Always format code blocks with the language identifier. Keep explanations tight unless depth is requested.`,
        },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const reply = response.choices[0]?.message?.content || "";
    const usage = response.usage;
    return res.status(200).json({ reply, usage });
  } catch (err) {
    console.error("Groq error:", err);
    return res.status(500).json({ error: err.message || "API error" });
  }
};
