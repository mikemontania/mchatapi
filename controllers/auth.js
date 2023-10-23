import { User } from "../models/index.js"
import bcrypt from "bcryptjs";
import { jwt } from "../utils/index.js"

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const emailLower = email.toLowerCase();
        const user = await User.findOne({ email: emailLower });
        if (!user) {
            res.status(500).send({ msg: "Error del servidor" });
        } else {
            bcrypt.compare(password, user.password, (bcryptError, check) => {
                if (bcryptError) {
                    res.status(500).send({ msg: "Error del servidor" });
                } else if (!check) {
                    res.status(400).send({ msg: "Contraseña no valida" });
                } else {
                    res.status(200).send({
                        access: jwt.createAccessToken(user),
                        refresh: jwt.refreshAccessToken(user)
                    });
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error });
    }
}


const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const salt = bcrypt.genSaltSync(10);
        const hastPassword = bcrypt.hashSync(password, salt);
        const user = new User({
            email: email.toLowerCase(),
            password: hastPassword
        });
        const userStorage = await user.save();
        res.status(201).send(userStorage);
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: "Error al registrar usuario" });
    }
}

/*
const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body;

    return jsonwebtoken.decode(token, JWT_SECRET_KEY,true);
}*/


export const AuthController = { register, login };