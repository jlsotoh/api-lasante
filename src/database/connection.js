import sql from "mssql";
import 'dotenv/config';

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    charset: 'utf8',
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

export const encodeUtf8 = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => {
            const newItem = {};
            for (const [key, value] of Object.entries(item)) {
                newItem[key] = typeof value === 'string' ?
                    Buffer.from(value, 'utf8').toString() : value;
            }
            return newItem;
        });
    }
    return data;
}