import express from "express";
import {
  getAduan,
  getAduanByID,
  createNewAduan,
  updateAduanById,
  deleteAduanById,
  getStatsByStatus,
  getStatsByStatusAdmin,
  getAduanByUser,
} from "../controller/aduanController.js";

import {
  isAuthenticated,
  isAdmin,
  isMahasiswa,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", isAuthenticated, getStatsByStatus); // HARUS DI ATAS :stats
router.get("/admin/stats", isAuthenticated, isAdmin, getStatsByStatusAdmin);
router.get("/user", isAuthenticated, isMahasiswa, getAduanByUser);

router.get("/", isAuthenticated, getAduan);
router.get("/:id", isAuthenticated, getAduanByID);
router.post("/", isAuthenticated, isMahasiswa, createNewAduan);
router.put("/:id", isAuthenticated, isAdmin, updateAduanById);
router.patch("/:id", isAuthenticated, isAdmin, updateAduanById);
router.delete("/:id", isAuthenticated, isAdmin, deleteAduanById);

export default router;
