import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error.message);
    }
}

export const registerUser = async(req, res) => {
    const { name, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({msg: "Register berhasil"});
    } catch (error) {
        console.log(error.message);
    }
}

export const loginUser = async(req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Password salah"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s' // expired dalam 20 second
        });

        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d' // expired dalam 1 day
        });

        await Users.update({
            refresh_token: refreshToken
        }, {
            where: {
                id: userId
            }
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // expired dalam 1 hari (satuan dalam milisecond)
            // secure: true, // jika menggunakan https
        });
        res.json({accessToken});
    } catch (error) {
        res.status(404).json({msg: "Email tidak ditemukan"});
    }
}

export const logoutUser = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204); // No Content
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!user[0]) return res.sendStatus(204); // No Content
    const userId = user[0].id;
    await Users.update({
        refresh_token: null
    }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200); // OK
}