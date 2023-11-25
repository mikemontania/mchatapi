import { Group, User } from "../models/index.js";
import { getFilePath } from "../utils/index.js";
// Obtener información del usuario actual
const getMe = async (req, res) => {
  const { user_id } = req.user;

  try {
    const response = await User.findById(user_id).select(["-password"]);

    if (!response) {
      res.status(400).send({ msg: "No se ha encontrado el usuario" });
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Obtener todos los usuarios, excepto el usuario actual
const getUsers = async (req, res) => {
  try {
    const { user_id } = req.user;
    const users = await User.find({ _id: { $ne: user_id } }).select([
      "-password",
    ]);

    if (!users) {
      res.status(400).send({ msg: "No se han encontrado usuarios" });
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Obtener información de un usuario por ID
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await User.findById(id).select(["-password"]);

    if (!response) {
      res.status(400).send({ msg: "No se ha encontrado el usuario" });
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Actualizar información del usuario actual
const updateUser = async (req, res) => {
  const { user_id } = req.user;
  const userData = req.body;

  if (req.files.avatar) {
    const imagePath = getFilePath(req.files.avatar);
    userData.avatar = imagePath;
  }

  try {
    await User.findByIdAndUpdate({ _id: user_id }, userData);

    res.status(200).send(userData);
  } catch (error) {
    res.status(400).send({ msg: "Error al actualizar el usuario" });
  }
};

// Obtener usuarios que no son participantes de un grupo
const getUsersExeptParticipantsGroup = async (req, res) => {
  const { group_id } = req.params;

  try {
    const group = await Group.findById(group_id);
    const participantsStrings = group.participants.toString();
    const participants = participantsStrings.split(",");

    const response = await User.find({ _id: { $nin: participants } }).select([
      "-password",
    ]);

    if (!response) {
      res.status(400).send({ msg: "No se ha encontrado ningún usuario" });
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};


export const UserController = {
  getMe,
  getUsers,
  getUser,
  updateUser,
  getUsersExeptParticipantsGroup,
};
