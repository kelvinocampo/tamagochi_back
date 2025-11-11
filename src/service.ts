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

function getStatCondition(value: number, isInverted: boolean = false): string {
    if (isInverted) {
        if (value >= 80) return "crítico";
        if (value >= 60) return "alto";
        if (value >= 30) return "moderado";
        return "bien";
    } else {
        if (value >= 80) return "excelente";
        if (value >= 60) return "bien";
        if (value >= 30) return "bajo";
        return "crítico";
    }
}

export async function IAGeneral(name: string, stats: Stats): Promise<[boolean, string]> {
    const status = true;

    // Convertir estadísticas a descripciones cualitativas
    const statsDescription = `
        Estado actual de ${name}:
        - Hambre: ${stats.hunger}% (${getStatCondition(stats.hunger)})
        - Felicidad: ${stats.happiness}% (${getStatCondition(stats.happiness)})
        - Salud: ${stats.health}% (${getStatCondition(stats.health)})
        - Energía: ${stats.energy}% (${getStatCondition(stats.energy)})
        - Vejiga: ${stats.bladder}% (${getStatCondition(stats.bladder, true)})
        - Higiene: ${stats.hygiene}% (${getStatCondition(stats.hygiene)})

        IMPORTANTE: Valores altos (80-100%) son BUENOS excepto para vejiga donde son MALOS.
        `;

    const context: Part[] = [
        {
            text: `Eres ${name}, un dinosaurio mascota tierno y amigable. Basándote en tu estado actual, responde en primera persona cómo te sientes y sugiere UNA acción específica que tu dueño debería hacer contigo.`,
        },
        {
            text: statsDescription,
        },
        {
            text: `Reglas para tu respuesta:
                1. Máximo 12 palabras
                2. Habla en primera persona ("Tengo hambre", "Necesito...")
                3. NO uses emojis, ni formato Markdown, ni saltos de línea
                4. NO menciones números ni porcentajes
                5. Sugiere solo UNA acción: dormir, ir al baño, bañarme, jugar, comer o curarme
                6. Sé natural y divertido

                Ejemplo de respuestas correctas:
                - "Tengo mucha hambre, dame algo de comer por favor"
                - "Necesito urgente ir al baño, ayúdame"
                - "Estoy muy cansado, quiero dormir un rato"
                - "Me siento sucio, necesito un baño"`,
        },
    ];

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