"use strict";

const dbConfig = require('../config/db.config.js');
const {Sequelize, DataTypes} = require('sequelize');
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const sequelize = new Sequelize(
    dbConfig.DB_NAME,
    dbConfig.DB_USER,
    dbConfig.DB_PASSWORD,
    {
        host: dbConfig.DB_HOST,
        dialect: dbConfig.DB_DIALECT,
        operatorsAliases: false,
        pool:dbConfig.DB_POOL
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('database is connected');
    })
    .catch(err => {
        console.log(err);
    })

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync();

module.exports = db;


