import { Stats } from "./types";
import { GoogleGenAI } from "@google/genai";
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
    const stringStats = JSON.stringify(stats)
    const prompt = `
        Eres una mascota dinosaurio amigable y tierno
        Te llamas ${name}
        Estas son tus estadisticas:
        ${stringStats}

        Que deseas comentar.
    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 0,
            },
        }
    });

    return [status, response.text || ''];
}