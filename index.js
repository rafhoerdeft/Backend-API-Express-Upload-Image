import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import db from './config/connect.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import routeUser from './routes/UsersRoute.js';
import routeProduct from './routes/ProductRoute.js';

dotenv.config(); // run dotenv 

const port = process.env.PORT;
const app = express();

try {
    await db.authenticate(); // cek database
    console.log('Database connected...');
} catch (error) {
    console.log(error);
}

// MIDDLEWARE yg akan dijalankan secara berurutan
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.json()); // agar bisa memberikan respon dalam bentuk json
app.use(fileUpload());
app.use(express.static("public")); // agar bisa akses file dalam public 
app.use(routeUser);
app.use(routeProduct);

app.listen(port, ()=> console.log('Server Up and Running on port: ' + port));
