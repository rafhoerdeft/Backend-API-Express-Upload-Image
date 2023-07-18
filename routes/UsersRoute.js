import express from "express";
import {
    getUsers, loginUser, logoutUser, registerUser,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import validateUser from "../middleware/validationUser.js";

const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users', validateUser, registerUser);
router.post('/login', loginUser);
router.get('/token', refreshToken);
router.delete('/logout', logoutUser);

export default router;