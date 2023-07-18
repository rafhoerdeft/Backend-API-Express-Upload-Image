import {check, validationResult} from "express-validator"
import Users from "../models/UserModel.js";

const rules = [
    check('name')
        .notEmpty().withMessage('Nama tidak boleh kosong')
        .isString()
        .isLength({min: 3}).withMessage('Nama minimal 3 karakter')
        .trim()
        .escape(),

    check('email')
        .notEmpty().withMessage('Email tidak boleh kosong')
        .isEmail().withMessage('Field harus berisi email yang valid')
        .custom(async (value) => {
            const user = await Users.findOne({ where: { email: value } });
            if (user) {
              throw new Error('Email sudah terdaftar');
            }
            return true;
          }),

    check('password')
        .notEmpty().withMessage('Password tidak boleh kosong')
        .isString()
        .isLength({min: 3}).withMessage('Password minimal 3 karakter')
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password harus terdiri dari setidaknya 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 karakter khusus')
        .matches(/^(?=.*[a-z])/).withMessage('Password harus terdiri dari setidaknya 1 huruf kecil')
        .matches(/^(?=.*[A-Z])/).withMessage('Password harus terdiri dari setidaknya 1 huruf besar')
        .matches(/^(?=.*\d)/).withMessage('Password harus terdiri dari setidaknya 1 angka')
        .matches(/^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password harus terdiri dari setidaknya 1 karakter khusus')
        .trim()
        .escape(),

    check('confPassword')
        .notEmpty().withMessage('Konfirmasi password tidak boleh kosong')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Password dan Confirm Password tidak cocok');
            }
            return true;
        })
]

const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()}) // error 422 -> konten tidak dapat diproses
    }
    next();
}

const validateUser = [
    rules,
    runValidation
]

export default validateUser