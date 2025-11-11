import { Stats } from "./types";
import { GoogleGenAI, Part } from "@google/genai";
import dotenv from "dotenv";

dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("La clave GEMINI_API_KEY no se cargó. Revisa tu archivo .env y la configuración de dotenv.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generalService(name: string, stats: Stats) {
    const [status, response] = await IAGeneral(name, stats)
    const result = {
        success: status,
        message: response
    };
    return result;
}

export async function IAGeneral(name: string, stats: Stats): Promise<[boolean, string]> {
    const status = true
    const statsDescription = `
        **Estado actual de ${name}:**
        - Hambre: ${stats.hunger}
        - Felicidad: ${stats.happiness}
        - Salud: ${stats.health}
        - Energía: ${stats.energy}
        - Vejiga: ${stats.bladder}
        - Higiene: ${stats.hygiene}
        - Durmiendo: ${stats.isSleeping ? 'Sí' : 'No'}
    `;
    const context: Part[] = [
        {
            text: `Responde en menos de 10 palabras según tu estado actual.
           Las estadísticas van de 0% (peor) a 100% (mejor), 
           excepto la vejiga: 0% es mejor (vacía) y 100% es peor (llena).
           No incluyas emojis ni formato Markdown como \\n o similares.
           No menciones valores numéricos en tu respuesta.`,
        },
        {
            text: `Eres una mascota dinosaurio amigable y tierno. Tu nombre es ${name}. 
               Comenta sobre tu estado o sobre alguna de tus estadísticas. 
               Mantén el mensaje breve, corto y divertido.`,
        },
        {
            text: statsDescription,
        },
    ];
    console.log(context);


    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: context,
        config: {
            thinkingConfig: {
                thinkingBudget: 0,
            },
        }
    });

    return [status, response.text || ''];
}