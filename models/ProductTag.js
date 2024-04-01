const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true,
    },

    product_name:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    price:{
      type:DataTypes.DECIMAL,
      allowNull:false,
      validate:{  //this is used to validate the decimal
        isDecimal:true, 
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
