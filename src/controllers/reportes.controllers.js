import { getConnection } from "../database/connection.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { validateRequired } from "../utils/validators.js";
import sql from "mssql";

export const getReporteRegistrosAsesor = async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.body;

    /*  // Validar datos de entrada
     const errors = [];
     const userIdError = validateRequired(userId, 'userId');
     if (userIdError) {
         errors.push({ field: 'userId', message: userIdError });
     }
 
     if (errors.length > 0) {
         return apiResponse.validationError(res, errors, "Datos de entrada inválidos");
     }
 
     const fechaInicioError = validateRequired(fechaInicio, 'fechaInicio');
     if (fechaInicioError) {
         errors.push({ field: 'fechaInicio', message: fechaInicioError });
     }
 
     const fechaFinError = validateRequired(fechaFin, 'fechaFin');
     if (fechaFinError) {
         errors.push({ field: 'fechaFin', message: fechaFinError });
     } */

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('userId', sql.VarChar, userId);
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);

        const result = await request.query(`SELECT q.[No]
            ,CAST(q.Genero AS text) AS Genero
            ,CAST(q.Nombre AS text) AS Nombre
            ,CAST(q.Apellidos AS text) AS Apellidos
            ,CAST(q.Nombre_c AS text) AS Nombre_Completo
            ,CAST(q.Cedula AS text) AS Cedula
            ,q.[Fecha] as Fecha_De_Nacimiento
            ,CAST(q.Celular AS text) AS Celular
            ,CAST(q.Correo AS text) AS Correo
            ,CAST(q.Cadena AS text) AS Cadena
            ,CAST(q.Codigo AS text) AS Codigo_De_Punto
            ,CAST(r.departamento AS text) AS Departamento
            ,CAST(r.ciudad AS text) AS Ciudad
            ,CAST(r.nombre_punto AS text) AS nombre_punto
            ,CAST(r.coordinador AS text) AS Coordinador
            ,CAST(r.PDV AS text) AS PDV
            ,q.[Fecha Creaccion]as Fecha_De_Creacion
            ,CAST(q.Rol AS text) AS Rol
            ,CAST(r.nombre_punto AS text) AS nombre_punto
            ,CASE
                WHEN q.Responsable = 13 THEN 'CENTRO'
                ELSE CAST(ase.Distrito AS text)
            END AS Distrito
            FROM [dbo].[tbl_Lasante_qrs] q
            LEFT JOIN [dbo].[tbl_LasanteRegistros] r
            ON q.Cadena = CAST(r.cadena AS nvarchar(max)) AND q.Codigo = CAST(r.codigo_punto AS nvarchar(max))
            LEFT JOIN tbl_Lasante_CAT_asesor as ase
            ON q.Responsable = ase.Id_asesor
            WHERE ase.Id_asesor LIKE (SELECT Id_asesor FROM tbl_Lasante_CAT_asesor WHERE Cedula = @userId) AND q.Completado = 1
            AND [Fecha Creaccion] between @fechaInicio AND @fechaFin
            ORDER BY 1`);
        res.send(result.recordset);
    } catch (error) {
        console.error(error);
        return apiResponse.error(res, "Error al obtener el reporte de registros", 500);
    }
};

export const getReporteRegistrosCadenasAsesor = async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('userId', sql.VarChar, userId);
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);

        const result = await request.query(`SELECT CAST(cadena AS TEXT) AS cadena, COUNT(cadena) AS num
            FROM  tbl_Lasante_qrs
            WHERE Responsable LIKE @userId AND [Fecha Creaccion] between @fechaInicio AND @fechaFin
            GROUP BY cadena`);
        res.send(result.recordset);
    } catch (error) {
        console.error(error);
        return apiResponse.error(res, "Error al obtener el reporte de registros", 500);
    }
};

export const getReporteRegistrosAdministrador = async (req, res) => {
    const { fechaInicio, fechaFin } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);

        const result = await request.query(`SELECT q.[No]
        ,CAST(q.Genero AS text) AS Genero
        ,CAST(q.Nombre AS text) AS Nombre
        ,CAST(q.Apellidos AS text) AS Apellidos
        ,CAST(q.Nombre_c AS text) AS Nombre_Completo
        ,CAST(q.Cedula AS text) AS Cedula
        ,q.[Fecha] as Fecha_De_Nacimiento
        ,CAST(q.Celular AS text) AS Celular
        ,CAST(q.Correo AS text) AS Correo
        ,CAST(q.Cadena AS text) AS Cadena
        ,CAST(q.Codigo AS text) AS Codigo_De_Punto
        ,CAST(r.departamento AS text) AS Departamento
        ,CAST(r.ciudad AS text) AS Ciudad
        ,CAST(r.nombre_punto AS text) AS nombre_punto
        ,CAST(r.coordinador AS text) AS Coordinador
        ,CAST(r.PDV AS text) AS PDV
        ,q.[Fecha Creaccion]as Fecha_De_Creacion
        ,CAST(q.Rol AS text) AS Rol
        ,CAST(r.nombre_punto AS text) AS nombre_punto
        ,CASE
                WHEN q.Responsable = 13 THEN 'EDISSON FERNANDO GUTIÉRREZ BRICEÑO'
                ELSE CAST(ase.Nombre AS text)
            END AS asesor
        ,CASE
            WHEN q.Responsable = 13 THEN 'CENTRO'
            ELSE CAST(ase.Distrito AS text)
        END AS Distrito
        FROM [dbo].[tbl_Lasante_qrs] q
        LEFT JOIN [dbo].[tbl_LasanteRegistros] r
        ON q.Cadena = CAST(r.cadena AS nvarchar(max)) AND q.Codigo = CAST(r.codigo_punto AS nvarchar(max))
        LEFT JOIN tbl_Lasante_CAT_asesor as ase
        ON q.Responsable = ase.Id_asesor
        WHERE q.Completado = 1 AND [Fecha Creaccion] between @fechaInicio AND @fechaFin
        ORDER BY 1`);
        res.send(result.recordset);
    } catch (error) {
        console.error(error);
        return apiResponse.error(res, "Error al obtener el reporte de registros", 500);
    }
};

export const getReporteRegistrosAsesoresAdministrador = async (req, res) => {
    const { userId, fechaInicio, fechaFin } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('userId', sql.VarChar, userId);
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);

        const result = await request.query(`SELECT 
        a.Id_asesor,
        a.Nombre,
        a.Distrito,
        COUNT(qr.cadena) AS num,
        (SELECT COUNT(*) 
        FROM tbl_Lasante_qrs AS qr2 
        WHERE qr2.Responsable = a.Id_asesor 
        AND qr2.[Fecha Creaccion] BETWEEN @fechaInicio AND @fechaFin) AS total_num
        FROM tbl_Lasante_CAT_asesor AS a
        LEFT JOIN tbl_Lasante_qrs AS qr ON a.Id_asesor = qr.Responsable
        WHERE a.Activo = 1 AND qr.[Fecha Creaccion] BETWEEN @fechaInicio AND @fechaFin
        GROUP BY a.Id_asesor, a.Nombre, a.Distrito, qr.cadena
        ORDER BY  a.Distrito, a.Nombre, num DESC`);
        res.send(result.recordset);
    } catch (error) {
        console.error(error);
        return apiResponse.error(res, "Error al obtener el reporte de registros", 500);
    }
};

export const getReporteRegistrosCadenasAdministrador = async (req, res) => {
    const { userId, fechaInicio, fechaFin } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('userId', sql.VarChar, userId);
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);

        const result = await request.query(`SELECT CAST(a.Distrito AS TEXT) AS dis, COUNT(Distrito) AS num
            FROM  tbl_Lasante_qrs as q
			LEFT JOIN tbl_Lasante_CAT_asesor as a
			ON q.Responsable=a.Id_asesor 
			WHERE Distrito IN('SUR OCCIDENTE','CENTRO','NORTE')
            GROUP BY a.Distrito`);

        const result2 = await request.query(`SELECT CAST(cadena AS TEXT) AS cadena, COUNT(cadena) AS num
            FROM  tbl_Lasante_qrs as q
			LEFT JOIN tbl_Lasante_CAT_asesor as a
			ON q.Responsable=a.Id_asesor 
            AND q.[Fecha Creaccion] BETWEEN @fechaInicio AND @fechaFin
            GROUP BY q.cadena`);

        res.send({ result: result.recordset, result2: result2.recordset });
    } catch (error) {
        console.error(error);
        return apiResponse.error(res, "Error al obtener el reporte de registros", 500);
    }
};

export const getReporteRegistrosGeneral = async (req, res) => {
    const { fechaInicio, fechaFin, distrito } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('distrito', sql.VarChar, distrito);
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);

        const result = await request.query(`SELECT q.[No]
        ,CAST(q.Genero AS text) AS Genero
        ,CAST(q.Nombre AS text) AS Nombre
        ,CAST(q.Apellidos AS text) AS Apellidos
        ,CAST(q.Nombre_c AS text) AS Nombre_Completo
        ,CAST(q.Cedula AS text) AS Cedula       
        ,q.[Fecha] as Fecha_De_Nacimiento
        ,CAST(q.Celular AS text) AS Celular
        ,CAST(q.Correo AS text) AS Correo
        ,CAST(q.Cadena AS text) AS Cadena
        ,CAST(q.Codigo AS text) AS Codigo_De_Punto
        ,CAST(r.departamento AS text) AS Departamento
        ,CAST(r.ciudad AS text) AS Ciudad
        ,CAST(r.nombre_punto AS text) AS nombre_punto
        ,CAST(r.coordinador AS text) AS Coordinador
        ,CAST(r.PDV AS text) AS PDV
        ,q.[Fecha Creaccion]as Fecha_De_Creacion
        ,CAST(q.Rol AS text) AS Rol
        ,CAST(r.nombre_punto AS text) AS nombre_punto
        ,CASE
                WHEN q.Responsable = 13 THEN 'EDISSON FERNANDO GUTIÉRREZ BRICEÑO'
                ELSE CAST(ase.Nombre AS text)
            END AS asesor
        ,CASE
            WHEN q.Responsable = 13 THEN 'CENTRO'
            ELSE CAST(ase.Distrito AS text)
        END AS Distrito
        FROM [dbo].[tbl_Lasante_qrs] q
        LEFT JOIN [dbo].[tbl_LasanteRegistros] r
        ON q.Cadena = CAST(r.cadena AS nvarchar(max)) AND q.Codigo = CAST(r.codigo_punto AS nvarchar(max))
        LEFT JOIN tbl_Lasante_CAT_asesor as ase
        ON q.Responsable = ase.Id_asesor
        WHERE ase.Distrito LIKE @distrito AND q.Completado = 1 
        AND q.[Fecha Creaccion] BETWEEN @fechaInicio AND @fechaFin
        ORDER BY 1
        `);
        res.send(result.recordset);
    } catch (error) {
        console.error(error);
        return apiResponse.error(res, "Error al obtener el reporte de registros", 500);
    }
};

export const getReporteRegistrosAsesoresGeneral = async (req, res) => {
    const { fechaInicio, fechaFin, distrito } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('distrito', sql.VarChar, distrito);
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);

        const resultado = [];

        const result = await request.query(`SELECT  Id_asesor,a.Nombre, COUNT(cadena) AS num
        FROM  tbl_Lasante_CAT_asesor as a
        LEFT JOIN  tbl_Lasante_qrs as qr
        ON a.Id_asesor=qr.Responsable
        WHERE a.Activo = 1 AND a.Distrito=@distrito AND a.Cargo NOT LIKE 'GERENTE%' 
        AND [Fecha Creaccion] BETWEEN @fechaInicio AND @fechaFin
        GROUP BY a.Id_asesor,a.Nombre
        ORDER BY 3 DESC`);

        const rowsQuery1 = result.recordset;

        for (const row of rowsQuery1) {
            const result2 = await request.query(`SELECT CAST(cadena AS TEXT) AS cadena, COUNT(cadena) AS total
                FROM  tbl_Lasante_qrs
                WHERE Responsable LIKE ${row.Id_asesor} AND [Fecha Creaccion] BETWEEN @fechaInicio AND @fechaFin
                GROUP BY cadena`);

            resultado.push({
                Id_asesor: row.Id_asesor,
                Nombre: row.Nombre,
                total: row.num,
                cadena: result2.recordset
            });
        }

        res.send({ result: resultado });
    } catch (error) {
        console.error(error);
        return apiResponse.error(res, "Error al obtener el reporte de registros", 500);
    }
};

export const getReporteRegistrosCadenasGeneral = async (req, res) => {
    const { fechaInicio, fechaFin, distrito } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('distrito', sql.VarChar, distrito);
        request.input('fechaInicio', sql.VarChar, fechaInicio);
        request.input('fechaFin', sql.VarChar, fechaFin);

        const result = await request.query(`SELECT CAST(cadena AS TEXT) AS cadena, COUNT(cadena) AS total
            FROM  tbl_Lasante_qrs as q
			LEFT JOIN tbl_Lasante_CAT_asesor as a
			ON q.Responsable=a.Id_asesor 
            WHERE a.Distrito LIKE @distrito
            AND [Fecha Creaccion] BETWEEN @fechaInicio AND @fechaFin
            GROUP BY q.cadena`);
        res.send(result.recordset);
    } catch (error) {
        console.error(error);
        return apiResponse.error(res, "Error al obtener el reporte de registros", 500);
    }
};