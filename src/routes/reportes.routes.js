import { Router } from "express";
import {
    getReporteRegistrosAsesor, getReporteRegistrosCadenasAsesor, getReporteRegistrosAdministrador,
    getReporteRegistrosGeneral, getReporteRegistrosAsesoresAdministrador, getReporteRegistrosCadenasAdministrador,
    getReporteRegistrosAsesoresGeneral, getReporteRegistrosCadenasGeneral
} from "../controllers/reportes.controllers.js";

const router = Router();

router.post("/asesor/get-registros", getReporteRegistrosAsesor);
router.post("/asesor/get-registros-cadenas", getReporteRegistrosCadenasAsesor);
router.post("/administrador/get-registros", getReporteRegistrosAdministrador);
router.post("/administrador/get-registros-asesor", getReporteRegistrosAsesoresAdministrador);
router.post("/administrador/get-registros-cadenas", getReporteRegistrosCadenasAdministrador);
router.post("/general/get-registros", getReporteRegistrosGeneral);
router.post("/general/get-registros-asesor", getReporteRegistrosAsesoresGeneral);
router.post("/general/get-registros-cadenas", getReporteRegistrosCadenasGeneral);

export default router;