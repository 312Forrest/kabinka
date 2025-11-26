import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateImage(parts: Part[]): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{
        parts: parts,
      }],
    });

    // Check for prompt feedback if no candidates are returned
    if (response.promptFeedback?.blockReason) {
       throw new Error(`Požadavek byl zablokován. Důvod: ${response.promptFeedback.blockReason}. To se může stát u selfie. Zkuste prosím jiný obrázek nebo pokyn.`);
    }

    const candidate = response.candidates?.[0];

    if (!candidate) {
      throw new Error("Model nevrátil platnou odpověď. Zkuste to prosím znovu.");
    }
    
    // Check for blocking at the candidate level
    if (candidate.finishReason && candidate.finishReason === 'SAFETY') {
        throw new Error(`Generování obrázku bylo zablokováno z bezpečnostních důvodů. To se může stát u obrázků lidí. Zkuste prosím jiný obrázek.`);
    }

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        throw new Error(`Generování obrázku se neočekávaně zastavilo. Důvod: ${candidate.finishReason}.`);
    }
    
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    const textResponse = response.text;
    if (textResponse) {
        throw new Error(`Model vrátil textovou zprávu místo obrázku: "${textResponse}"`);
    }

    throw new Error("V odpovědi nebyla nalezena žádná obrazová data. Model mohl odmítnout generovat obrázek z důvodu bezpečnostních pravidel.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Re-throw the specific error from the try block
        throw error;
    }
    throw new Error("Při komunikaci s modelem AI došlo k neznámé chybě.");
  }
}