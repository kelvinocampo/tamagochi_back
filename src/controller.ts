import { Request, Response } from 'express';
import { generalService } from './service';
import { Stats } from './types';

export async function generalController(req: Request, res: Response) {
    try {
        const { stats, name } = req.body;

        const result = await generalService(name as string, stats as Stats);

        return res.status(201).json({ success: result.success, status: 'ok', message: result.message });

    } catch (error: any) {
        console.error("Error en 'general/' :", error);
        return res.status(500).json({ success: false, status: 'error', message: "Error interno del servidor", error: error });
    }
}