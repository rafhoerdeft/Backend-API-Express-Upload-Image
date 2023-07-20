import express from "express";
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct,
    getProductsPaging
} from "../controllers/ProductController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.use('/products', verifyToken); // Middleware for all route products (like GROUP)
router.get('/products', getProducts);
router.get('/products/paging', getProductsPaging);
router.get('/products/:id', getProductById);
router.post('/products', saveProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;