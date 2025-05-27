import express from "express";
import {
  getAduan,
  getAduanByID,
  createNewAduan,
  updateAduanById,
  deleteAduanById,
} from "../controller/aduanController.js";

const router = express.Router();

router.get("/", getAduan);
router.get("/:id", getAduanByID);
router.post("/", createNewAduan);
router.put("/:id", updateAduanById);
router.delete("/:id", deleteAduanById);

export default router;
