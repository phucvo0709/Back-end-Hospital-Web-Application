if (process.env.NODE_ENV === "production") {
  module.exports = process.env.PROD_DATABASE;
} else {
  module.exports = process.env.DEV_DATABASE;
}
