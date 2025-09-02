import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes.js";
import puntosRoutes from "./routes/puntos.router.js";
import reportesRoutes from './routes/reportes.routes.js'
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiResponse } from "./utils/apiResponse.js";
import chartsRoutes from "./routes/charts.router.js";
import vademecumRoutes from "./routes/vademecum.routes.js";

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/puntos', puntosRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/charts', chartsRoutes);
app.use('/api/vademecum', vademecumRoutes);

// Ruta de prueba de API
app.get('/api/health', (req, res) => {
    apiResponse.success(res, { status: 'OK', timestamp: new Date().toISOString() }, 'API funcionando correctamente');
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    apiResponse.notFound(res, `Ruta ${req.method} ${req.originalUrl} no encontrada`);
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;