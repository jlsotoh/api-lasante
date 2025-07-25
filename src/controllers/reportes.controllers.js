import { getConnection } from "../database/connection.js";

export const getReporteRegistrosAsesor = async (req, res) => {
    const { rol, userId } = req.body;
    const pool = await getConnection();

    const result = await pool.request().query(`SELECT * FROM tbl_Lasante_user WHERE Role = 1 OR Role = 2 OR Role = 3;`);
    res.send(result.recordset);
};

export const getReporteRegistrosAdministrador = async (req, res) => {
    const { rol, userId } = req.body;
    const pool = await getConnection();

    const result = await pool.request().query(`SELECT * FROM tbl_Lasante_user WHERE Role = 6 OR Role = 7;`);
    res.send(result.recordset);
};

export const getReporteGeneral = async (req, res) => {
    const { rol, userId } = req.body;
    const pool = await getConnection();

    const result = await pool.request().query(`SELECT * FROM tbl_Lasante_user WHERE Role = 1 OR Role = 2 OR Role = 3 OR Role = 6 OR Role = 7;`);
    res.send(result.recordset);
};