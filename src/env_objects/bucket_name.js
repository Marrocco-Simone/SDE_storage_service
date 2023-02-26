require("dotenv").config();

const bucket_name = process.env.BUCKET_NAME;

module.exports = { bucket_name };
