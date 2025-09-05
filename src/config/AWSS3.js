import * as AWS from "aws-sdk";

export const S3 = new AWS.S3({
  region: process.env.VUE_APP_ROOT_REGION,
  secretAccessKey: process.env.VUE_APP_ROOT_SECRET_ACCESS,
  accessKeyId: process.env.VUE_APP_ROOT_ACCESS_KEY,
});
