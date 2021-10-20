const db = require("../db/bizzyKa");

const getAllBusinessByUserId = async (req, res, next) => {
  try {
    const { sub: userId } = req.headers["x-amzn-oidc-data"];
    console.log("userId", userId)
    const result = await db.getAllBusinessByUserId(userId);
    console.log("result", result)
    return res.status(200).json(result);
  } catch (error) {
    res.json({
      message: "Something went wrong",
      error: JSON.stringify(error),
    });
  }
};

const createBusinessByUserId = async (req, res, next) => {
  try {
    console.log("req.user", req.user)
    const { sub: userId } = req.headers["x-amzn-oidc-data"];
    console.log("req.headers", userId)

    const {
      legalName,
      displayName,
      websiteLink,
      currency,
      phoneNumber,
      email,
      address,
    } = req.body;
    console.log("req.body", req.body)
    const result = await db.createBusinessByUserId(userId, {
      legalName,
      displayName,
      websiteLink,
      currency,
      phoneNumber,
      email,
      address,
    });
    console.log("result", result)
    return res.status(200).json(result);
  } catch (error) {
    console.log("error", error)
    res.json({
      message: "",
      error: JSON.stringify(error),
    });
  }
};

const updateBusinessByUserId = async (req, res, next) => {
  try {
    const { sub: userId } = req.headers["x-amzn-oidc-data"];
    const businessId = req.headers["business-id"];
    const {
      legalName,
      displayName,
      websiteLink,
      currency,
      phoneNumber,
      email,
      address,
    } = req.body;
    const result = await db.updateBusinessByUserId(userId, businessId, {
      legalName,
      displayName,
      websiteLink,
      currency,
      phoneNumber,
      email,
      address,
    });
    return res.status(200).json(result);
  } catch (error) {
    res.json({
      message: "",
      error: JSON.stringify(error)
    });
  }
};

const deleteBusinessByUserId = async (req, res, next) => {
  try {
    const { sub: userId } = req.headers["x-amzn-oidc-data"];
    const businessId = req.headers["business-id"];
    const result = await db.deleteBusinessByUserId(userId, businessId);
    return res.status(200).json(result);
  } catch (error) {
    res.json({
      message: "",
      error: JSON.stringify(error),
    });
  }
};

const getRoleByUserIdAndBusinessId = async (req, res, next) => {
  try {
    const { sub: userId } = req.headers["x-amzn-oidc-data"];
    const businessId = req.headers["business-id"];
    const result = await db.getRoleByUserIdAndBusinessId(userId, businessId);
    return res.status(200).json(result);
  } catch (error) {
    res.json({
      message: "",
      error: JSON.stringify(error),
    });
  }
};

const createRoleByUserIdAndBusinessId = async (req, res, next) => {
  try {
    const { sub: userId } = req.headers["x-amzn-oidc-data"];
    const businessId = req.headers["business-id"];
    const {
      ownerRights,
      productRights,
      salesRights,
      inventoryRights,
      salesPosRights,
      supplierRights,
      analyticsViewRights,
    } = req.body;

    const result = await db.createRoleByUserIdBusinessId(userId, businessId, {
      ownerRights,
      productRights,
      salesRights,
      inventoryRights,
      salesPosRights,
      supplierRights,
      analyticsViewRights,
    });
    return res.status(200).json(result);
  } catch (error) {
    res.json({
      message: "",
      error: JSON.stringify(error),
    });
  }
};

const updateRoleByUserIdAndBusinessId = async (req, res, next) => {
  try {
    const { sub: userId } = req.headers["x-amzn-oidc-data"];
    const businessId = req.headers["business-id"];
    const {
      ownerRights,
      productRights,
      salesRights,
      inventoryRights,
      salesPosRights,
      supplierRights,
      analyticsViewRights,
    } = req.body;
    const result = await db.updateRoleByUserIdAndBusinessId(
      userId,
      businessId,
      {
        ownerRights,
        productRights,
        salesRights,
        inventoryRights,
        salesPosRights,
        supplierRights,
        analyticsViewRights,
      }
    );
    return res.status(200).json(result);
  } catch (error) {
    res.json({
      message: "",
      error: JSON.stringify(error),
    });
  }
};

const deleteRoleByUserIdAndBusinessId = async (req, res, next) => {
  try {
    const { sub: userId } = req.headers["x-amzn-oidc-data"];
    const businessId = req.headers["business-id"];
    const result = await db.deleteRoleByUserIdAndBusinessId(userId, businessId);
    return res.status(200).json(result);
  } catch (error) {
    res.json({
      message: "",
      error: JSON.stringify(error),
    });
  }
};

module.exports = {
  // business
  getAllBusinessByUserId,
  createBusinessByUserId,
  updateBusinessByUserId,
  deleteBusinessByUserId,

  // businessUsers
  getRoleByUserIdAndBusinessId,
  createRoleByUserIdAndBusinessId,
  updateRoleByUserIdAndBusinessId,
  deleteRoleByUserIdAndBusinessId,
};
