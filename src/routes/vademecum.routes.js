import { Router } from "express";
import { uploadCsv, getVademecums, getVademecum } from "../controllers/vademecum.controllers.js";

const router = Router();

router.post("/upload-csv", uploadCsv);
router.get("/get-vademecums", getVademecums);
router.get("/get-vademecum/:id", getVademecum);

export default router;