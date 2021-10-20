const express = require("express");
const {
  getAllBusinessByUserId,
  createBusinessByUserId,
  createRoleByUserIdAndBusinessId,
  deleteBusinessByUserId,
  deleteRoleByUserIdAndBusinessId,
  getRoleByUserIdAndBusinessId,
  updateBusinessByUserId,
  updateRoleByUserIdAndBusinessId,
} = require("../controller/bizzyKa");

const router = express.Router();

router.get("/", getAllBusinessByUserId);
router.post("/", createBusinessByUserId);
router.put("/", updateBusinessByUserId);
router.delete("/", deleteBusinessByUserId);

router.get("/user", getRoleByUserIdAndBusinessId);
router.post("/user", createRoleByUserIdAndBusinessId);
router.put("/user", updateRoleByUserIdAndBusinessId);
router.delete("/user", deleteRoleByUserIdAndBusinessId);

router.post("/test", (req, res) => res.send("Hello from bizzyKa"));
module.exports.businessesRoute = router;
