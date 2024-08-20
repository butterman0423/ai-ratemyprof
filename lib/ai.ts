import { GoogleGenerativeAI } from "@google/generative-ai";

export type Embedding = number;
export type Log = {
    role: 'user' | 'model',
    parts: [{ text: string}]
}

export const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const embedModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

export const SYSTEM_PROMPT = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`

export async function createEmbedding(input: string): Promise<Embedding[]> {
    const res = await model.embedContent(input);
    return res.embedding.values;
}

export async function getResponseStream(startPrompt: string, logs: Log[]) {
    return model.generateContentStream({
        contents: [
            {
                role: 'user',
                parts: [{ text: '' }]
            },
            ...logs
        ],
        systemInstruction: startPrompt
    });
}