import {Sequelize} from "sequelize";

const db = new Sequelize('node_crud','root','',{
    host: 'localhost',
    dialect: "mysql"
});

export default db;