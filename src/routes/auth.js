const express = require("express");
const AWS = require("aws-sdk");

const router = express.Router();
const cognito = new AWS.CognitoIdentityServiceProvider();

router.get("/", (req, res) => {
  const response = {
    message: "Hello from auth",
  };
  return res.status(402).json(response);
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const params = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const response = await cognito.adminInitiateAuth(params).promise();

    if (response.AuthenticationResult) {
      return res.status(200).json({ response });
    }
    return res
      .status(500)
      .json({ error: "Something went wrong", res: JSON.stringify(response) });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    };

    const response = await cognito.adminCreateUser(params).promise();

    if (response.User) {
      const params = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
        Password: password,
        Permanent: true,
      };

      const response = await cognito.adminSetUserPassword(params).promise();
      return res.status(200).json({ response });
    }

    return res
      .status(500)
      .json({ error: "Something went wrong", res: JSON.stringify(response) });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports.authRoute = router;
