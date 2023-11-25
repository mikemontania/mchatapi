import { GroupMessage } from "../models/index.js";
import { io, getFilePath } from "../utils/index.js";
// Método para enviar un mensaje de texto a un grupo
const sendText = async (req, res) => {
  try {
    const { group_id, message } = req.body;
    const { user_id } = req.user;

    const group_message = new GroupMessage({
      group: group_id,
      user: user_id,
      message,
      type: "TEXT",
    });

    await group_message.save();

    const data = await group_message.populate("user");
    io.sockets.in(group_id).emit("message", data);
    io.sockets.in(`${group_id}_notify`).emit("message_notify", data);

    res.status(201).send({});
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Método para enviar una imagen a un grupo
const sendImage = async (req, res) => {
  try {
    const { group_id } = req.body;
    const { user_id } = req.user;

    const group_message = new GroupMessage({
      group: group_id,
      user: user_id,
      message: getFilePath(req.files.image),
      type: "IMAGE",
    });

    await group_message.save();

    const data = await group_message.populate("user");
    io.sockets.in(group_id).emit("message", data);
    io.sockets.in(`${group_id}_notify`).emit("message_notify", data);

    res.status(201).send({});
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Método para obtener todos los mensajes de un grupo
const getAll = async (req, res) => {
  try {
    const { group_id } = req.params;
    const messages = await GroupMessage.find({ group: group_id })
      .sort({ createdAt: 1 })
      .populate("user");

    const total = await GroupMessage.find({ group: group_id }).count();

    res.status(200).send({ messages, total });
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Método para obtener el total de mensajes de un grupo
const getTotalMessages = async (req, res) => {
  try {
    const { group_id } = req.params;
    const total = await GroupMessage.find({ group: group_id }).count();
    res.status(200).send(JSON.stringify(total));
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Método para obtener el último mensaje de un grupo
const getLastMessage = async (req, res) => {
  try {
    const { group_id } = req.params;
    const response = await GroupMessage.findOne({ group: group_id })
      .sort({ createdAt: -1 })
      .populate("user");

    res.status(200).send(response || {});
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};


export const GroupMessageController = {
  sendText,
  sendImage,
  getAll,
  getTotalMessages,
  getLastMessage,
};
