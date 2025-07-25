/**
 * Utilidad para generar respuestas API estándar
 */

export const apiResponse = {
    // Respuesta exitosa
    success: (res, data = null, message = "Operación exitosa", statusCode = 200, pagination = null) => {
        const response = {
            success: true,
            message,
            data,
            statusCode,
            timestamp: new Date().toISOString()
        };

        if (pagination) {
            response.pagination = pagination;
        }

        return res.status(statusCode).json(response);
    },

    // Respuesta de error
    error: (res, message = "Error interno del servidor", statusCode = 500, errors = null) => {
        const response = {
            success: false,
            message,
            data: null,
            statusCode,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    },

    // Respuesta para datos no encontrados
    notFound: (res, message = "Recurso no encontrado") => {
        return apiResponse.error(res, message, 404);
    },

    // Respuesta para errores de validación
    validationError: (res, errors, message = "Error de validación") => {
        return apiResponse.error(res, message, 400, errors);
    },

    // Respuesta para errores de autorización
    unauthorized: (res, message = "No autorizado") => {
        return apiResponse.error(res, message, 401);
    },

    // Respuesta para errores de permisos
    forbidden: (res, message = "Acceso denegado") => {
        return apiResponse.error(res, message, 403);
    }
};

// Función para crear respuestas con paginación
export const createPaginationInfo = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    return {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
}; 