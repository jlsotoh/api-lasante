import { Router } from "express";
import { getReporteRegistrosAsesor, getReporteRegistrosAdministrador, getReporteGeneral } from "../controllers/reportes.controllers.js";

const router = Router();

router.post("/get-reporte-registros-asesor", getReporteRegistrosAsesor);
router.post("/get-reporte-registros-administrador", getReporteRegistrosAdministrador);
router.post("/get-reporte-general", getReporteGeneral);

export default router;