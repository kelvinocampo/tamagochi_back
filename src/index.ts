import express from 'express';
import cors from "cors";
import { generalController } from './controller';
const FRONTEND_URL = process.env.FRONTEND_URL || "";

const app = express()
    .use(cors({
        origin: FRONTEND_URL,
        methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization',
        credentials: true
    }));;
const PORT = process.env.PORT || 3000;

app.use(express.json());

const router = express.Router();

router.post('/general', generalController);

app.use("/api", router);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});