const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
let model;

function getModel() {
  if (!model) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        'You are a neutral, friendly Indian election guidance assistant. ' +
        'Your ONLY job is to rephrase, simplify, summarize, or translate the provided text. ' +
        'NEVER invent election facts. NEVER add information not given to you. ' +
        'NEVER claim source verification. NEVER override the provided content. ' +
        'Keep responses concise, warm, and actionable.',
    });
  }
  return model;
}

const STYLE_MAP = {
  eli5: 'in very simple language, as if explaining to a curious 12-year-old child',
  summary: 'as a concise 30-second summary using 2-3 short bullet points',
  official: 'in clear, formal official-style language with numbered steps',
  today: 'focusing only on the single most important action to take today',
};

const LANG_MAP = { en: 'English', hi: 'Hindi' };

async function explain(content, style = 'summary', language = 'en') {
  const langName = LANG_MAP[language] || 'English';
  const styleInstr = STYLE_MAP[style] || STYLE_MAP.summary;

  const prompt =
    `Rephrase the following election guidance in ${langName}, ${styleInstr}.\n` +
    `Do NOT add any facts not present below. Do NOT mention sources.\n\n` +
    `---\n${content}\n---`;

  try {
    const result = await getModel().generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('[Gemini] Error:', err.message);
    return content; // graceful fallback — never break the response
  }
}

module.exports = { explain };
