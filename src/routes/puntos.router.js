import { Router } from "express";
import { getPuntosTrivias, getPuntosVideos, getPuntosEncuestas, getPuntosOtros } from "../controllers/puntos.controllers.js";

const router = Router();

router.post("/get-puntos-trivias", getPuntosTrivias);
router.post("/get-puntos-videos", getPuntosVideos);
router.post("/get-puntos-encuestas", getPuntosEncuestas);
router.post("/get-puntos-otros", getPuntosOtros);

export default router;