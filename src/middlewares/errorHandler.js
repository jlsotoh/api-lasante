import { apiResponse } from '../utils/apiResponse.js';

// Middleware para manejo de errores
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de validación
    if (err.name === 'ValidationError') {
        return apiResponse.validationError(res, err.errors, err.message);
    }

    // Error de base de datos
    if (err.code === 'EREQUEST' || err.name === 'RequestError') {
        return apiResponse.error(res, "Error en la base de datos", 500);
    }

    // Error personalizado
    if (err.statusCode) {
        return apiResponse.error(res, err.message, err.statusCode);
    }

    // Error interno del servidor
    return apiResponse.error(res, "Error interno del servidor", 500);
};

// Wrapper para controladores async
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}; 