import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateDailyPlan = async (context: string) => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a daily plan for: ${context}`,
    config: {
      systemInstruction: "You are an expert student productivity consultant. Based on the user's classes, tasks, and energy levels, generate a high-performance daily schedule. Return the response in a structured format that can be parsed as JSON.",
    }
  });
  const response = await model;
  return response.text;
};

export const getStudyRecommendation = async (freeTime: string, subjects: string) => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Free time: ${freeTime}. Subjects: ${subjects}. What should I study?`,
    config: {
      systemInstruction: "You are a study coach. Suggest what the student should focus on during their free time based on their subjects and upcoming deadlines.",
    }
  });
  const response = await model;
  return response.text;
};

export const chatWithAssistant = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are Aura, a premium AI student assistant. You help students manage their time, study effectively, and stay motivated. You are professional, encouraging, and highly intelligent.",
    },
  });
  
  const response = await chat.sendMessage({ message });
  return response.text;
};
