require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
    max: 20,  // Increase the maximum number of connections
    min: 5,
    acquire: 30000,  // Time in ms to wait for a connection before throwing an error
    idle: 10000,  // Time in ms to wait before closing an unused connection
  },
  },
};
