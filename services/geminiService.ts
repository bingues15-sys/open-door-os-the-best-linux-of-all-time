import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// We reuse the client, but for different purposes we might create new instances if needed strictly by guidelines
// But sharing the instance is fine if the key doesn't change.
// The guidelines say: "Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key from the dialog." 
// Since we don't have a dialog here (using env), we can instantiate it on demand.

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const executeTerminalCommand = async (command: string, history: string[]): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `
      You are the kernel of Open Door OS, a web-based Linux simulation.
      User is 'guest'. Hostname is 'opendoor'.
      Current simulated directory is /home/guest.
      
      History of commands:
      ${history.slice(-5).join('\n')}
      
      The user just typed: "${command}"
      
      Rules:
      1. Act EXACTLY like a Linux bash terminal.
      2. If it's a standard command (ls, pwd, uname, cat, etc.), output the realistic result.
      3. If it's a question, answer it concisely as if printed to stdout.
      4. Do not use markdown blocks. Just raw text.
      5. Keep it brief.
      6. If the command is 'neofetch', show a cool ASCII art logo for Open Door OS.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || '';
  } catch (error) {
    console.error("Gemini Terminal Error:", error);
    return `Error: command execution failed. ${error}`;
  }
};

export const chatWithAssistant = async (message: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are Open Door AI, the intelligent assistant built into Open Door OS. You are helpful, friendly, and concise.",
      }
    });
    return response.text || "I'm having trouble connecting to the network.";
  } catch (error) {
    return "Error connecting to AI service.";
  }
};