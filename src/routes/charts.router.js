import { Router } from "express";
import { getCadenasAsesores, getRegistrosAsesores, getDistritosAdministrativo, getCadenasAdministrativo, getRegistrosAdministrativo, getCadenasGerente, getRegistrosGerente } from "../controllers/charts.controllers.js";

const router = Router();

router.post("/asesor/get-cadenas", getCadenasAsesores);
router.post("/asesor/get-registros", getRegistrosAsesores);
router.post("/administrativo/get-distritos", getDistritosAdministrativo);
router.post("/administrativo/get-cadenas", getCadenasAdministrativo);
router.post("/administrativo/get-registros", getRegistrosAdministrativo);
router.post("/gerente/get-cadenas", getCadenasGerente);
router.post("/gerente/get-registros", getRegistrosGerente);

export default router;