import { getConnection } from "../database/connection.js";
import { apiResponse } from "../utils/apiResponse.js";
import sql from "mssql";

export const getCadenasAsesores = async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.body;

    if (!fechaInicio || !fechaFin || !userId) {
        return apiResponse.unauthorized(res, "Credenciales inválidas");
    }


    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);
        request.input('userId', sql.VarChar, userId);

        const result = await request.query(`SELECT CAST(cadena AS TEXT) AS cadena, COUNT(cadena) AS num
            FROM  tbl_Lasante_qrs 
            WHERE Responsable = (SELECT  Id_asesor FROM  tbl_Lasante_CAT_asesor WHERE Cedula = @userId) 
            AND [Fecha Creaccion] between @fechaInicio AND @fechaFin
            GROUP BY cadena;`);

        const cadenas = result.recordset;

        if (cadenas.length <= 0) {
            return apiResponse.unauthorized(res, "No se encontraron cadenas");
        }

        const responseData = {
            cadenas: cadenas
        }

        return apiResponse.success(res, responseData, "Cadenas obtenidas correctamente", 200);
    } catch (error) {
        console.error('Error en charts:', error);
        return apiResponse.error(res, "Error al procesar las cadenas del chart", 500);
    }
};

export const getRegistrosAsesores = async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.body;
    const pool = await getConnection();
    const request = pool.request();
    request.input('fechaInicio', sql.VarChar, fechaInicio);
    request.input('fechaFin', sql.VarChar, fechaFin);
    request.input('userId', sql.VarChar, userId);

    const result = await request.query(`
            WITH Numeros AS (
                SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS n
                FROM master.dbo.spt_values
            ), Dias AS (
                SELECT DATEADD(DAY, n, @FechaInicio) AS Fecha
                FROM Numeros
                WHERE DATEADD(DAY, n, @FechaInicio) <= @FechaFin
                )
            SELECT 
            D.Fecha,
            COALESCE(COUNT(T.[Fecha Creaccion]), 0) AS CantidadRegistros
            FROM 
            Dias D  
            LEFT JOIN 
            tbl_Lasante_qrs T ON CONVERT(DATE, T.[Fecha Creaccion]) = D.Fecha
            AND Responsable LIKE (SELECT Id_asesor FROM tbl_Lasante_CAT_asesor WHERE Cedula = @userId) 
            GROUP BY 
            D.Fecha
            ORDER BY 
            D.Fecha;`);

    if (!result.recordset || result.recordset.length === 0) {
        return apiResponse.unauthorized(res, "Credenciales inválidas");
    }

    const registros = result.recordset;

    if (registros.length <= 0) {
        return apiResponse.unauthorized(res, "No se encontraron registros");
    }

    const responseData = {
        registros: registros
    }

    return apiResponse.success(res, responseData, "registros obtenidas correctamente", 200);
};

export const getDistritosAdministrativo = async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);
        request.input('userId', sql.VarChar, userId);

        const result = await request.query(`SELECT CAST(a.Distrito AS TEXT) AS dis, COUNT(Distrito) AS num
            FROM  tbl_Lasante_qrs as q
            LEFT JOIN tbl_Lasante_CAT_asesor as a
            ON q.Responsable=a.Id_asesor 
            WHERE Distrito IN('SUR OCCIDENTE','CENTRO','NORTE') 
            AND [Fecha Creaccion] between @fechaInicio AND @fechaFin
            GROUP BY a.Distrito
            `);


        if (!result.recordset || result.recordset.length === 0) {
            return apiResponse.unauthorized(res, "Credenciales inválidas");
        }

        const distritos = result.recordset;

        if (distritos.length <= 0) {
            return apiResponse.unauthorized(res, "No se encontraron datos");
        }

        const responseData = {
            distritos: distritos
        }

        return apiResponse.success(res, responseData, "Distritos obtenido correctamente", 200);
    } catch (error) {
        console.error('Error en charts:', error);
        return apiResponse.error(res, "Error al procesar el distrito del chart", 500);
    }

}

export const getCadenasAdministrativo = async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);
        request.input('userId', sql.VarChar, userId);

        const result = await request.query(`SELECT CAST(cadena AS TEXT) AS cadena, COUNT(cadena) AS num
                FROM  tbl_Lasante_qrs as q
                LEFT JOIN tbl_Lasante_CAT_asesor as a
                ON q.Responsable=a.Id_asesor 
                WHERE [Fecha Creaccion] between @fechaInicio AND @fechaFin
                GROUP BY q.cadena
                `);


        if (!result.recordset || result.recordset.length === 0) {
            return apiResponse.unauthorized(res, "Credenciales inválidas");
        }

        const cadenas = result.recordset;

        if (cadenas.length <= 0) {
            return apiResponse.unauthorized(res, "No se encontraron datos");
        }

        const responseData = {
            cadenas: cadenas
        }

        return apiResponse.success(res, responseData, "cadenas obtenidas correctamente", 200);
    } catch (error) {
        console.error('Error en charts:', error);
        return apiResponse.error(res, "Error al procesar las cadenas del chart", 500);
    }
}

export const getRegistrosAdministrativo = async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);
        request.input('userId', sql.VarChar, userId);

        const result = await request.query(`WITH Numeros AS (
                SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS n
                FROM master.dbo.spt_values
            )
            , Dias AS (
                SELECT DATEADD(DAY, n, @FechaInicio) AS Fecha
                FROM Numeros
                WHERE DATEADD(DAY, n, @FechaInicio) <= @FechaFin
            )
            SELECT 
                D.Fecha,
                COALESCE(COUNT(T.[Fecha Creaccion]), 0) AS CantidadRegistros
            FROM 
                Dias D
            LEFT JOIN 
                tbl_Lasante_qrs T ON CONVERT(DATE, T.[Fecha Creaccion]) = D.Fecha
            GROUP BY 
                D.Fecha
            ORDER BY 
                D.Fecha;
            `);


        if (!result.recordset || result.recordset.length === 0) {
            return apiResponse.unauthorized(res, "Credenciales inválidas");
        }

        const registros = result.recordset;

        if (registros.length <= 0) {
            return apiResponse.unauthorized(res, "No se encontraron datos");
        }

        const responseData = {
            registros: registros
        }

        return apiResponse.success(res, responseData, "registros obtenidas correctamente", 200);
    } catch (error) {
        console.error('Error en charts:', error);
        return apiResponse.error(res, "Error al procesar los registros del chart", 500);
    }
}

export const getCadenasGerente = async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);
        request.input('userId', sql.VarChar, userId);

        const result = await request.query(`SELECT CAST(cadena AS TEXT) AS cadena, COUNT(cadena) AS num
                FROM  tbl_Lasante_qrs as q
                LEFT JOIN tbl_Lasante_CAT_asesor as a
                ON q.Responsable=a.Id_asesor
                WHERE a.Distrito LIKE (SELECT Distrito
                                    FROM  tbl_Lasante_CAT_asesor
                                    WHERE Cedula = @userId) 
                AND [Fecha Creaccion] between @fechaInicio AND @fechaFin
                GROUP BY q.cadena 
                `);


        if (!result.recordset || result.recordset.length === 0) {
            return apiResponse.unauthorized(res, "Credenciales inválidas");
        }

        const cadenas = result.recordset;

        if (cadenas.length <= 0) {
            return apiResponse.unauthorized(res, "No se encontraron datos");
        }

        const responseData = {
            cadenas: cadenas
        }

        return apiResponse.success(res, responseData, "cadenas obtenidas correctamente", 200);
    } catch (error) {
        console.error('Error en charts:', error);
        return apiResponse.error(res, "Error al procesar las cadenas del chart", 500);
    }
}

export const getRegistrosGerente = async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);
        request.input('userId', sql.VarChar, userId);

        const result = await request.query(`WITH Numeros AS (
                SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS n
                FROM master.dbo.spt_values
            )
            , Dias AS (
                SELECT DATEADD(DAY, n, @FechaInicio) AS Fecha
                FROM Numeros
                WHERE DATEADD(DAY, n, @FechaInicio) <= @FechaFin
            )
            SELECT 
                D.Fecha,
                COALESCE(COUNT(T.[Fecha Creaccion]), 0) AS CantidadRegistros
            FROM 
                Dias D
            LEFT JOIN 
                tbl_Lasante_qrs T ON CONVERT(DATE, T.[Fecha Creaccion]) = D.Fecha
                LEFT JOIN tbl_Lasante_CAT_asesor a ON T.Responsable= a.Id_asesor AND a.Distrito=(SELECT Distrito
					FROM  tbl_Lasante_CAT_asesor
					WHERE Cedula = @userId) 
            GROUP BY 
                D.Fecha
            ORDER BY 
                D.Fecha;
            `);


        if (!result.recordset || result.recordset.length === 0) {
            return apiResponse.unauthorized(res, "Credenciales inválidas");
        }

        const registros = result.recordset;

        if (registros.length <= 0) {
            return apiResponse.unauthorized(res, "No se encontraron datos");
        }

        const responseData = {
            registros: registros
        }

        return apiResponse.success(res, responseData, "registros obtenidas correctamente", 200);
    } catch (error) {
        console.error('Error en charts:', error);
        return apiResponse.error(res, "Error al procesar los registros del chart", 500);
    }
}