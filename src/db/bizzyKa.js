const { v4: uuidv4 } = require("uuid");
const { DB } = require("./index");

const getAllBusinessByUserId = async (userId) => {
  
  let params = {
    TableName: process.env.BUSINESS_USERS_TABLE,
    IndexName: "userIdIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  console.log("params", params);

  try {
    const data = await DB.query(params).promise();
    console.log("data", data);
    if (!data) {
      throw Error("There was an error fetching the data");
    }
    console.log("data-", data);
    const businessIds = data.Items.map((item) => item.businessId);
    console.log("businessIds", businessIds);
    const businessDetails = await Promise.all(
      businessIds.map(async (businessId) => await getBusinessById(businessId))
    );
    console.log("businessDetails", businessDetails);

    return businessDetails;
  } catch (error) {
    console.log("error", error);
    throw Error(`There was an error ${error}`);
  }
};

const getBusinessById = async (id) => {
  try {
    const data = await DB.get({
      TableName: process.env.BUSINESS_TABLE,
      Key: {
        id,
      },
    }).promise();
    if (!data) {
      console.log("data", data);
      throw Error("There was an error fetching the data");
    }
    return data;
  } catch (error) {
    console.log("error", error);
    throw Error(`There was an error ${error}`);
  }
};

const createBusinessByUserId = async (userId, business) => {
  const businessId = uuidv4();
  const params = {
    TableName: process.env.BUSINESS_TABLE,
    Item: {
      id: businessId,
      ...business,
    },
  };

  try {
    console.log("params", params);
    const data = await DB.put(params).promise();
    console.log("data", data);
    // create business user relationship
    const businessUserParams = {
      TableName: process.env.BUSINESS_USERS_TABLE,
      Item: {
        id: uuidv4(),
        userId,
        businessId,
        ownerRights: true,
        productRights: false,
        salesRights: false,
        inventoryRights: false,
        salesPosRights: false,
        supplierRights: false,
        analyticsViewRights: false,
      },
    };
    console.log("businessUserParams", businessUserParams);
    await DB.put(businessUserParams).promise();
    console.log("data", data);
    if (!data) {
      throw Error("There was an error creating the data");
    }
    return params.Item;
  } catch (error) {
    console.log("error", error);
    throw Error(`There was an error ${error}`);
  }
};

const updateBusinessByUserId = async (userId, businessId, business) => {
  try {
   
    const accessParams = {
      TableName: process.env.BUSINESS_USERS_TABLE,
      IndexName: "businessIdUserIdIndex",
      KeyConditionExpression: "businessId = :businessId and userId = :userId",
      ExpressionAttributeValues: {
        ":businessId": businessId,
        ":userId": userId,
      },
    };
    const accessData = await DB.query(accessParams).promise();
    if (!accessData || !accessData.Items > 0 || !accessData.Items[0].ownerRights) {
      console.log("accessData", accessData);
      throw Error("Not allowed to update this business");
    }

    const params = {
      TableName: process.env.BUSINESS_TABLE,
      Key: {
        id: accessData.Items[0].businessId,
      },
      UpdateExpression:
        "set legalName = :legalName, displayName = :displayName, websiteLink = :websiteLink, currency = :currency, phoneNumber = :phoneNumber, email = :email, address = :address",
      ExpressionAttributeValues: {
        ":legalName": business.legalName,
        ":displayName": business.displayName,
        ":websiteLink": business.websiteLink,
        ":currency": business.currency,
        ":phoneNumber": business.phoneNumber,
        ":email": business.email,
        ":address": business.address,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const data = await DB.update(params).promise();
    if (!data) {
      throw Error("There was an error updating the data");
    }
    return data;
  } catch (error) {
    console.log("error", error);
    throw Error(`There was an error ${error}`);
  }
};

const deleteBusinessByUserId = async (userId, businessId) => {
  try {
  
    const accessParams = {
      TableName: process.env.BUSINESS_USERS_TABLE,
      IndexName: "businessIdUserIdIndex",
      KeyConditionExpression: "businessId = :businessId and userId = :userId",
      ExpressionAttributeValues: {
        ":businessId": businessId,
        ":userId": userId,
      },
    };


    const accessData = await DB.query(accessParams).promise();
    if (!accessData || !accessData.Item || !accessData.Items[0].ownerRights) {
      console.log("accessData", accessData);
      throw Error("Not allowed to delete this business");
    }

    const params = {
      TableName: process.env.BUSINESS_TABLE,
      Key: {
        id: businessId,
      },
    };

    const data = await DB.delete(params).promise();
    if (!data) {
      console.log("data", data);
      throw Error("There was an error deleting the data");
    }

    // delete business user relationship
    const businessUserParams = {
      TableName: process.env.BUSINESS_USERS_TABLE,
      Key: {
        userId,
        businessId,
      },
    };
    await DB.delete(businessUserParams).promise();

    return data;
  } catch (error) {
    console.log("error", error);
    throw Error(`There was an error ${error}`);
  }
};

// get businessUsers by businessId, and userId

const getRoleByUserIdAndBusinessId = async (businessId, userId) => {
  try {
    const params = {
      TableName: process.env.BUSINESS_USERS_TABLE,
      IndexName: "businessIdUserIdIndex",
      KeyConditionExpression: "businessId = :businessId and userId = :userId",
      ExpressionAttributeValues: {
        ":businessId": businessId,
        ":userId": userId,
      },
    };

    const data = await DB.query(params).promise();
    if (!data) {
      throw Error("There was an error fetching the data");
    }
    return data;
  } catch (error) {
    console.log("error", error);
    throw Error(`There was an error ${error}`);
  }
};

const createRoleByUserIdBusinessId = async (businessId, userId, data) => {
  const {
    ownerRights,
    productRights,
    salesRights,
    inventoryRights,
    salesPosRights,
    supplierRights,
    analyticsViewRights,
  } = data;
  const params = {
    TableName: process.env.BUSINESS_USERS_TABLE,
    Item: {
      id: uuidv4(),
      businessId,
      userId,
      ownerRights,
      productRights,
      salesRights,
      inventoryRights,
      salesPosRights,
      supplierRights,
      analyticsViewRights,
    },
  };

  try {
    const data = await DB.put(params).promise();
    if (!data) {
      throw Error("There was an error creating the data");
    }
    return data;
  } catch (error) {
    console.log("error", error);
    throw Error(`There was an error ${error}`);
  }
};

const updateRoleUserByUserIdBusinessId = async (
  businessId,
  userId,
  businessUser
) => {
  try {
     const accessParams = {
      TableName: process.env.BUSINESS_USERS_TABLE,
      IndexName: "businessIdUserIdIndex",
      KeyConditionExpression: "businessId = :businessId and userId = :userId",
      ExpressionAttributeValues: {
        ":businessId": businessId,
        ":userId": userId,
      },
    };

    const accessData = await DB.query(accessParams).promise();
    
    if (!accessData || !accessData.Item || !accessData.Items[0].ownerRights) {
      console.log("accessData", accessData);
      throw Error("Not allowed to update this business");
    }

    const params = {
      TableName: process.env.BUSINESS_USERS_TABLE,
      Key: {
        id: accessData.Items[0].id,
      },
      UpdateExpression: "set ownerRights = :ownerRights",
      ExpressionAttributeValues: {
        ":ownerRights": businessUser.ownerRights,
      },
      ReturnValues: "UPDATED_NEW",
    };
    const data = await DB.update(params).promise();
    if (!data) {
      throw Error("There was an error updating the data");
    }
    return data;
  } catch (error) {
    console.log("error", error);
    throw Error(`There was an error ${error}`);
  }
};

const deleteRoleUserByUserIdBusinessId = async (businessId, userId) => {
  try {
     const accessParams = {
      TableName: process.env.BUSINESS_USERS_TABLE,
      IndexName: "businessIdUserIdIndex",
      KeyConditionExpression: "businessId = :businessId and userId = :userId",
      ExpressionAttributeValues: {
        ":businessId": businessId,
        ":userId": userId,
      },
    };

    const accessData = await DB.query(accessParams).promise();
    console.log("accessData", accessData);

    if (!accessData || !accessData.Item > 0 || !accessData.Items[0].ownerRights) {
      console.log("accessData", accessData);
      throw Error("Not allowed to delete this business");
    }

    const params = {
      TableName: process.env.BUSINESS_USERS_TABLE,
      Key: {
        id: accessData.Items[0].id,
      },
    };

    const data = await DB.delete(params).promise();
    if (!data) {
      throw Error("There was an error deleting the data");
    }

    return data;
  } catch (error) {
    console.log("error", error);
    throw Error(`There was an error ${error}`);
  }
};

module.exports = {
  // business
  getAllBusinessByUserId,
  getBusinessById,
  createBusinessByUserId,
  updateBusinessByUserId,
  deleteBusinessByUserId,

  // businessUsers
  getRoleByUserIdAndBusinessId,
  createRoleByUserIdBusinessId,
  updateRoleUserByUserIdBusinessId,
  deleteRoleUserByUserIdBusinessId,
};
