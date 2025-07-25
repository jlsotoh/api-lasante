import { getConnection } from "../database/connection.js";
import sha1 from "sha1";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { validateLogin } from "../utils/validators.js";
import sql from "mssql";

export const loginUser = asyncHandler(async (req, res) => {
    const { documento, password } = req.body;

    // Validar datos de entrada
    const validationErrors = validateLogin(documento, password);
    if (validationErrors.length > 0) {
        return apiResponse.validationError(res, validationErrors, "Datos de entrada inválidos");
    }

    try {
        const pass = sha1(password);
        const pool = await getConnection();

        // Usar parámetros para evitar SQL injection
        const request = pool.request();
        request.input('documento', sql.VarChar, documento);
        request.input('password', sql.VarChar, pass);

        const result = await request.query(`
            SELECT UserId, Pass_hash, Role, 
                   CASE 
                       WHEN Role = 1 THEN 'droguista'
                       WHEN Role = 2 THEN 'droguista' 
                       WHEN Role = 3 THEN 'droguista'
                       WHEN Role = 6 THEN 'droguista'
                       WHEN Role = 7 THEN 'droguista'
                       WHEN Role = 4 THEN 'asesor'
                       WHEN Role = 5 THEN 'gerente de distrito'
                       WHEN Role = 8 THEN 'ejecutivo'
                       WHEN Role = 9 THEN 'administrativo' 
                       ELSE 'Usuario'
                   END as RoleName
            FROM tbl_Lasante_user
            WHERE UserId = @documento AND Pass_hash = @password
        `);

        // Verificar si se encontró el usuario
        if (!result.recordset || result.recordset.length === 0) {
            return apiResponse.unauthorized(res, "Credenciales inválidas");
        }

        const user = result.recordset[0];

        // No devolver el hash de la contraseña en la respuesta
        const userResponse = {
            userId: user.UserId,
            role: user.Role,
            roleName: user.RoleName
        };

        return apiResponse.success(res, userResponse, "Login exitoso", 200);

    } catch (error) {
        console.error('Error en login:', error);
        return apiResponse.error(res, "Error al procesar el login", 500);
    }
});
