import { getConnection } from "../database/connection.js";
import { apiResponse } from "../utils/apiResponse.js";
import sql from "mssql";
import { parse } from "csv-parse/sync";

export const uploadCsv = async (req, res) => {
    const { file, isBase64 } = req.body;

    if (!file) {
        return apiResponse.unauthorized(res, "Archivo CSV requerido");
    }

    try {
        let csvText = file;
        if (typeof csvText === 'string' && csvText.startsWith('data:')) {
            const base64Payload = csvText.split(',')[1] ?? '';
            csvText = Buffer.from(base64Payload, 'base64').toString('utf8');
        } else if (isBase64 === true) {
            csvText = Buffer.from(csvText, 'base64').toString('utf8');
        }

        const records = parse(csvText, {
            columns: true,
            bom: true,
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true
        });

        if (!Array.isArray(records) || records.length === 0) {
            return apiResponse.error(res, "El CSV no contiene registros", 400);
        }

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            let insertedCount = 0;

            for (const record of records) {
                const imagen = record.imagen ?? null;
                const icono = record.icono ?? null;
                const nombre = record.nombre ?? null;
                const presentacion = record.presentacion ?? null;
                const texto = record.texto ?? null;
                const registro_sanitario = record.registro_sanitario ?? null;
                const idStatus = 1

                if (!nombre) {
                    throw new Error("Campo 'nombre' es obligatorio en todas las filas");
                }

                const request = new sql.Request(transaction);
                request.input('imagen', sql.NVarChar(255), imagen);
                request.input('icono', sql.NVarChar(100), icono);
                request.input('nombre', sql.NVarChar(200), nombre);
                request.input('presentacion', sql.NVarChar(sql.MAX), presentacion);
                request.input('texto', sql.NVarChar(sql.MAX), texto);
                request.input('registro_sanitario', sql.NVarChar(sql.MAX), registro_sanitario);
                request.input('idStatus', sql.Int, Number.isNaN(idStatus) ? 1 : idStatus);

                await request.query(
                    `INSERT INTO tbl_lasante_vademecum 
                    (imagen, icono, nombre, presentacion, texto, registro_sanitario, idStatus)
                    VALUES (@imagen, @icono, @nombre, @presentacion, @texto, @registro_sanitario, @idStatus)`
                );

                insertedCount += 1;
            }

            await transaction.commit();

            return apiResponse.success(
                res,
                { inserted: insertedCount },
                `Se insertaron ${insertedCount} registros del CSV`,
                200
            );
        } catch (innerErr) {
            await transaction.rollback();
            console.error('Rollback vademecum:', innerErr);
            return apiResponse.error(res, `Error al procesar CSV: ${innerErr.message}`, 500);
        }
    } catch (error) {
        console.error('Error en vademecum:', error);
        return apiResponse.error(res, "Error al subir el archivo", 500);
    }
};

export const getVademecums = async (req, res) => {
    try {
        const pool = await getConnection();
        const request = pool.request();
        const result = await request.query(`SELECT * FROM tbl_Lasante_Vademecum`);
        const registros = result.recordset;
        if (registros.length <= 0) {
            return apiResponse.unauthorized(res, "No se encontraron registros");
        }

        const responseData = {
            registros: registros
        }

        return apiResponse.success(res, responseData, "Registros obtenidos correctamente", 200);
    } catch (error) {
        console.error('Error en vademecum:', error);
        return apiResponse.error(res, "Error al obtener los vademecums", 500);
    }
};

export const getVademecum = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input('id', sql.Int, id);
        const result = await request.query(`SELECT * FROM tbl_Lasante_Vademecum WHERE id = @id`);
        const registros = result.recordset;
        if (registros.length <= 0) {
            return apiResponse.unauthorized(res, "No se encontraron registros");
        }

        const responseData = {
            registros: registros
        }

        return apiResponse.success(res, responseData, "Registro obtenido correctamente", 200);
    } catch (error) {
        console.error('Error en vademecum:', error);
        return apiResponse.error(res, "Error al obtener el vademecum", 500);
    }
};