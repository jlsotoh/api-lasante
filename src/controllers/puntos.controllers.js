import { getConnection } from "../database/connection.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { validateRequired } from "../utils/validators.js";
import sql from "mssql";

export const getPuntosTrivias = asyncHandler(async (req, res) => {
    const { rol, userId } = req.body;

    // Validar datos de entrada
    const errors = [];
    const rolError = validateRequired(rol, 'rol');
    if (rolError) {
        errors.push({ field: 'rol', message: rolError });
    }
    const userIdError = validateRequired(userId, 'userId');
    if (userIdError) {
        errors.push({ field: 'userId', message: userIdError });
    }

    if (errors.length > 0) {
        return apiResponse.validationError(res, errors, "Datos de entrada inválidos");
    }

    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input('userId', sql.VarChar, userId);

        let query = '';
        let data = [];

        // Verificar permisos y ejecutar consulta correspondiente
        if (rol === 6 || rol === 7) {
            // Administradores
            query = `
                SELECT cat.Id_Encuesta, ISNULL(t.Puntaje,0) as Puntaje, cat.Nombre 
                FROM tbl_Lasante_TriviasJugadaSalidable as t
                LEFT JOIN tbl_Lasante_CAT_encuestas as cat
                ON t.Id_Encuesta = cat.Id_Encuesta
                WHERE cat.Type = 1 AND t.Cedula = @userId
                ORDER BY cat.Id_Encuesta
            `;

            const result = await request.query(query);
            data = result.recordset;

        } else if (rol === 1 || rol === 2 || rol === 3) {
            // Asesores
            query = `
                SELECT cat.Id_Encuesta, ISNULL(t.Puntaje,0) as Puntaje, cat.Nombre 
                FROM tbl_Lasante_Trivias as t
                LEFT JOIN tbl_Lasante_CAT_encuestas as cat
                ON t.Id_Encuesta = cat.Id_Encuesta
                WHERE cat.Type = 1 AND t.Cedula = @userId
                ORDER BY cat.Id_Encuesta
            `;

            const result = await request.query(query);
            data = result.recordset;

        } else {
            // Rol no autorizado
            return apiResponse.forbidden(res, "No tienes permisos para ver los puntos de las trivias");
        }

        // Calcular estadísticas adicionales
        const totalPuntos = data.reduce((sum, item) => sum + (item.Puntaje || 0), 0);
        const triviasCompletadas = data.filter(item => item.Puntaje > 0).length;

        const responseData = {
            trivias: data,
            estadisticas: {
                totalPuntos,
                triviasCompletadas,
                totalTrivias: data.length
            }
        };

        return apiResponse.success(res, responseData, "Puntos de trivias obtenidos exitosamente");

    } catch (error) {
        console.error('Error al obtener puntos de trivias:', error);
        return apiResponse.error(res, "Error al obtener los puntos de las trivias", 500);
    }
});

export const getPuntosVideos = async (req, res) => {
    const { rol, userId } = req.body;
    const pool = await getConnection();

    if (rol === 6 || rol === 7) {
        const result = await pool.request().query(`SELECT cat.Id_Encuesta,ISNULL(t.Puntaje,0) as Puntaje, cat.Nombre 
            FROM tbl_Lasante_TriviasJugadaSalidable as t
            LEFT JOIN tbl_Lasante_CAT_encuestas as cat
            ON t.Id_Encuesta = cat.Id_Encuesta
            WHERE cat.Type = 2 AND t.Cedula='${userId}'
            ORDER BY 1`);
        res.send(result.recordset);
    }

    if (rol === 1 || rol === 2 || rol === 3) {
        const result = await pool.request().query(`SELECT cat.Id_Encuesta,ISNULL(t.Puntaje,0) as Puntaje, cat.Nombre 
            FROM tbl_Lasante_Trivias as t
            LEFT JOIN tbl_Lasante_CAT_encuestas as cat
            ON t.Id_Encuesta = cat.Id_Encuesta
            WHERE cat.Type = 2 AND t.Cedula='${userId}'
            ORDER BY 1;`);
        res.send(result.recordset);
    }

    res.send({ message: "No tienes permisos para ver los puntos de los videos" });
};

export const getPuntosEncuestas = async (req, res) => {
    const { rol, userId } = req.body;
    const pool = await getConnection();

    if (rol === 6 || rol === 7) {
        const result = await pool.request().query(`SELECT cat.Id_Encuesta,ISNULL(t.Puntaje,0) as Puntaje, cat.Nombre 
            FROM tbl_Lasante_TriviasJugadaSalidable as t
            LEFT JOIN tbl_Lasante_CAT_encuestas as cat
            ON t.Id_Encuesta = cat.Id_Encuesta
            WHERE cat.Type = 3 AND t.Cedula='${userId}'
            ORDER BY 1;`);
        res.send(result.recordset);
    }

    if (rol === 1 || rol === 2 || rol === 3) {
        const result = await pool.request().query(`SELECT cat.Id_Encuesta,ISNULL(t.Puntaje,0) as Puntaje, cat.Nombre 
            FROM tbl_Lasante_Trivias as t
            LEFT JOIN tbl_Lasante_CAT_encuestas as cat
            ON t.Id_Encuesta = cat.Id_Encuesta
            WHERE cat.Type = 3 AND t.Cedula='${userId}'
            ORDER BY 1;`);
        res.send(result.recordset);
    }

    res.send({ message: "No tienes permisos para ver los puntos de las encuestas" });
};

export const getPuntosOtros = async (req, res) => {
    const { rol, userId } = req.body;
    const pool = await getConnection();

    if (rol === 6 || rol === 7) {
        const result = await pool.request().query(`SELECT cat.Id_Encuesta,ISNULL(t.Puntaje,0) as Puntaje, cat.Nombre 
            FROM tbl_Lasante_TriviasJugadaSalidable as t
            LEFT JOIN tbl_Lasante_CAT_encuestas as cat
            ON t.Id_Encuesta = cat.Id_Encuesta
            WHERE cat.Type = 11 AND t.Cedula='${userId}'
            ORDER BY 1;`);
        res.send(result.recordset);
    }

    if (rol === 1 || rol === 2 || rol === 3) {
        const result = await pool.request().query(`SELECT cat.Id_Encuesta,ISNULL(t.Puntaje,0) as Puntaje, cat.Nombre 
            FROM tbl_Lasante_Trivias as t
            LEFT JOIN tbl_Lasante_CAT_encuestas as cat
            ON t.Id_Encuesta = cat.Id_Encuesta
            WHERE cat.Type = 11 AND t.Cedula='${userId}'
            ORDER BY 1;`);
        res.send(result.recordset);
    }

    res.send({ message: "No tienes permisos para ver los puntos otros" });
};