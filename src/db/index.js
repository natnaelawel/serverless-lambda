const AWS = require("aws-sdk");
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === "true") {
  console.log("IS_OFFLINE", IS_OFFLINE)
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
    accessKeyId: "yyyy", // needed if you don't have aws credentials at all in env
    secretAccessKey: "xxxx", // needed if you don't have aws credentials at all in env
  });
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

module.exports.DB = dynamoDb;
