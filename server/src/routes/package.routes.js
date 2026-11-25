const { Router } = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { requireAdmin } = require("../middlewares/requireAdmin");
const { upload } = require("../middlewares/upload");
const {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/package.controller");

const router = Router();

router.get("/", listPackages);
router.get("/:id", getPackage);
router.post("/", verifyToken, requireAdmin, upload.single("image"), createPackage);
router.put("/:id", verifyToken, requireAdmin, upload.single("image"), updatePackage);
router.delete("/:id", verifyToken, requireAdmin, deletePackage);

module.exports = router;