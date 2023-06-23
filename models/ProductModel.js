import { Sequelize } from "sequelize";
import db from "../config/connect.js";

const {DataTypes} = Sequelize;

const Product = db.define('product', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
}, {
    // agar tetap menggunakan nama tabel yg di define
    freezeTableName: true
});

export default Product;

(async()=>{
    await db.sync();
})(); // fungsi ini langsung dipanggil atau langsung dijalankan