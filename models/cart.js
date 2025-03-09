const { Sequelize } = require("sequelize");

// Connect to the database
const sequelize = require("../utils/database");

const Cart = sequelize.define("cart", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
});

module.exports = Cart;
