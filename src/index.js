import app from "./app.js";
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor API corriendo en puerto ${PORT}`);
});
