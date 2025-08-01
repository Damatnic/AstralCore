import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { GoogleGenAI, Content } from "@google/genai";

interface AIChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { 
        statusCode: 405, 
        body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    const { messages, systemInstruction } = JSON.parse(event.body || '{}');

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return { 
          statusCode: 400, 
          body: JSON.stringify({ message: 'Bad Request: "messages" is a required array.' }) 
        };
    }
    
    if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not set in environment variables.');
        return { 
            statusCode: 500, 
            body: JSON.stringify({ message: 'Server configuration error.' }) 
        };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Transform the incoming message format to the format expected by the Gemini API
    const contents: Content[] = messages.map((msg: AIChatMessage) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents, // Pass the whole history
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ text: response.text }),
      headers: { 'Content-Type': 'application/json' },
    };

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return { 
        statusCode: 500, 
        body: JSON.stringify({ message: error.message || 'Internal Server Error' }) 
    };
  }
};

export { handler };
