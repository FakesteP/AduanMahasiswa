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
  downloadLampiran,
} from "../controller/aduanController.js";

import {
  isAuthenticated,
  isAdmin,
  isMahasiswa,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/stats", isAuthenticated, getStatsByStatus); // HARUS DI ATAS :stats
router.get("/admin/stats", isAuthenticated, isAdmin, getStatsByStatusAdmin);
router.get("/user", isAuthenticated, isMahasiswa, getAduanByUser);

router.get("/", isAuthenticated, getAduan);
router.get("/:id", isAuthenticated, getAduanByID);
router.get("/:id/lampiran", isAuthenticated, downloadLampiran); // Route untuk download lampiran
router.post(
  "/",
  isAuthenticated,
  isMahasiswa,
  upload.single("lampiran"),
  createNewAduan
);
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  upload.single("lampiran"),
  updateAduanById
);
router.patch(
  "/:id",
  isAuthenticated,
  isAdmin,
  upload.single("lampiran"),
  updateAduanById
);
router.delete("/:id", isAuthenticated, isAdmin, deleteAduanById);

export default router;
