import express from 'express';
import { generalController } from './controller';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const router = express.Router();

router.post('/general', generalController);

app.use("/api", router);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});