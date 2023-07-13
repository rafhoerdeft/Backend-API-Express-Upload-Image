import { Sequelize } from "sequelize";
import db from "../config/connect.js";

const { DataTypes } = Sequelize;

// Schema
const Users = db.define('users', {
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    refresh_token: {
        type: DataTypes.TEXT,
    },
}, {
    freezeTableName: true
})

export default Users;

// (async()=>{
//     await db.sync(); // otomatis membuat tabel yg ada pada model jika belum ada
// })(); // fungsi ini langsung dipanggil atau langsung dijalankan