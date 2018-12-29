const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const LaTex = sequelize.define('LaTex', {
    name: DataTypes.STRING,
  }, {});
  LaTex.associate = function(models) {
    // associations can be defined here
  };
  return LaTex;
};