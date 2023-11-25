import bscrypt from "bcryptjs";
import { User } from "../models/index.js";
import { jwt } from "../utils/index.js";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = new User({
      email: email.toLowerCase(),
    });

    const salt = bscrypt.genSaltSync(10);
    const hashPassword = bscrypt.hashSync(password, salt);
    user.password = hashPassword;

    const userStorage = await user.save();
    res.status(201).send(userStorage);
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Error al registrar el usuario" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLowerCase = email.toLowerCase();

    const userStorage = await User.findOne({ email: emailLowerCase });

    if (!userStorage) {
      res.status(400).send({ msg: "Usuario no encontrado" });
      return;
    }

    const check = await bscrypt.compare(password, userStorage.password);

    if (!check) {
      res.status(400).send({ msg: "Contraseña incorrecta" });
      return;
    }

    res.status(200).send({
      access: jwt.createAccessToken(userStorage),
      refresh: jwt.createRefreshToken(userStorage),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).send({ msg: "Token requerido" });
      return;
    }

    const hasExpired = jwt.hasExpiredToken(refreshToken);

    if (hasExpired) {
      res.status(400).send({ msg: "Token expirado" });
      return;
    }

    const { user_id } = jwt.decoded(refreshToken);
    const userStorage = await User.findById(user_id);

    if (!userStorage) {
      res.status(400).send({ msg: "Usuario no encontrado" });
      return;
    }

    res.status(200).send({
      accessToken: jwt.createAccessToken(userStorage),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
};

export const AuthController = {
  register,
  login,
  refreshAccessToken,
};
