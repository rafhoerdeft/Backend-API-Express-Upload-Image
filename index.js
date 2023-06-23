import {} from 'dotenv/config';

import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import routeProduct from './routes/ProductRoute.js';

const port = process.env.PORT;
const app = express();

// MIDDLEWARE yg akan dijalankan secara berurutan
app.use(cors());
app.use(express.json()); // agar bisa memberikan respon dalam bentuk json
app.use(fileUpload());
app.use(express.static("public")); // agar bisa akses file dalam public 
app.use(routeProduct);

app.listen(port, ()=> console.log('Server Up and Running on port: ' + port));
