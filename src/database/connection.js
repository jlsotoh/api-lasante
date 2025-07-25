import sql from "mssql";
import 'dotenv/config';

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
}

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        /*  const result = await pool.request().query("SELECT GETDATE()");
         console.log(result); */
        return pool;
    } catch (error) {
        console.error(error);
    }
}

