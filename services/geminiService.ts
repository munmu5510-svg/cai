import { GoogleGenAI, Chat } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION_WORKSPACE, INITIAL_SYSTEM_INSTRUCTION_CAI } from '../constants';

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing! Ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

// For the Marketer Agent (Workspace) - High capability with Fallback
export const generateBusinessStrategy = async (
  prompt: string, 
  history: { role: 'user' | 'model', text: string }[] = []
) => {
  const ai = getAI();
  
  // Helper to create chat config
  const createChat = (model: string) => {
    return ai.chats.create({
      model: model,
      config: {
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION_WORKSPACE,
        temperature: 0.8,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });
  };

  try {
    // 1. Try High-Reasoning Model first
    console.log("Attempting generation with gemini-3-pro-preview...");
    const chat = createChat('gemini-3-pro-preview');
    const response = await chat.sendMessage({ message: prompt });
    return response.text;

  } catch (error: any) {
    console.warn("Gemini 3 Pro failed. Falling back to Flash.", error);
    
    try {
        // 2. Fallback to Flash model
        console.log("Attempting fallback generation with gemini-2.5-flash...");
        const chat = createChat('gemini-2.5-flash');
        const response = await chat.sendMessage({ message: prompt });
        return response.text;

    } catch (fallbackError: any) {
        console.error("Critical Error generating strategy:", fallbackError);
        
        const errorMessage = fallbackError.message || fallbackError.toString();
        
        if (errorMessage.includes("API key")) {
             return "Configuration Error: API Key is missing or invalid. Please check your environment variables.";
        }
        
        return `System Error: Unable to generate strategy. Details: ${errorMessage}`;
    }
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
  } catch (error: any) {
    console.error("Error generating CAI response:", error);
    return `Connection Error: ${error.message || "I'm having trouble connecting to my knowledge base."}`;
  }
};