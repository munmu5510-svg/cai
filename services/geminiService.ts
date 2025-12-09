import { GoogleGenAI, Chat } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION_WORKSPACE, INITIAL_SYSTEM_INSTRUCTION_CAI } from '../constants';

const getAI = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.error("API Key is missing!");
  }
  return new GoogleGenAI({ apiKey });
};

// For the Marketer Agent (Workspace) - High capability
export const generateBusinessStrategy = async (
  prompt: string, 
  history: { role: 'user' | 'model', text: string }[] = []
) => {
  const ai = getAI();
  try {
    // Using gemini-3-pro-preview for complex reasoning tasks (business strategy)
    const chat: Chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION_WORKSPACE,
        temperature: 0.8, // Slightly creative
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("Error generating strategy:", error);
    return "I apologize, but I encountered an error while processing your request. Please try again.";
  }
};

// For CAI (Customer Support) - Fast and efficient
export const generateCAIResponse = async (
  message: string,
  history: { role: 'user' | 'model', text: string }[] = []
) => {
  const ai = getAI();
  try {
    // Using gemini-2.5-flash for responsive chat
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION_CAI,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message: message });
    return response.text;
  } catch (error) {
    console.error("Error generating CAI response:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};
