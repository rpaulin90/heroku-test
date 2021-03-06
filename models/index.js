'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Associations/////////////////////
db.User.belongsTo(db.Base);
db.Base.hasMany(db.User);
db.Item.belongsTo(db.Category);
db.Category.hasMany(db.Item);
db.User.hasMany(db.Item);
db.Item.belongsTo(db.User);
//////////// JUST ADDED ////////
db.Base.hasMany(db.Item);
db.Item.belongsTo(db.Base);
////////////////////////////////////
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
