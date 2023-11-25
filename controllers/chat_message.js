import { ChatMessage } from "../models/index.js";
import { io, getFilePath } from "../utils/index.js";

const sendText = async (req, res) => {
  try {
    const { chat_id, message } = req.body;
    const { user_id } = req.user;

    const chat_message = new ChatMessage({
      chat: chat_id,
      user: user_id,
      message,
      type: "TEXT",
    });

    await chat_message.save();

    const data = await chat_message.populate("user").execPopulate();
    io.sockets.in(chat_id).emit("message", data);
    io.sockets.in(`${chat_id}_notify`).emit("message_notify", data);

    res.status(201).send({});
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Error al enviar el mensaje" });
  }
};


const sendImage = async (req, res) => {
  try {
    const { chat_id } = req.body;
    const { user_id } = req.user;

    const chat_message = new ChatMessage({
      chat: chat_id,
      user: user_id,
      message: getFilePath(req.files.image),
      type: "IMAGE",
    });

    await chat_message.save();

    const data = await chat_message.populate("user").execPopulate();
    io.sockets.in(chat_id).emit("message", data);
    io.sockets.in(`${chat_id}_notify`).emit("message_notify", data);

    res.status(201).send({});
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Error al enviar el mensaje" });
  }
};

const getAll = async (req, res) => {
  const { chat_id } = req.params;

  try {
    const messages = await ChatMessage.find({ chat: chat_id })
      .sort({
        createdAt: 1,
      })
      .populate("user");

    const total = await ChatMessage.find({ chat: chat_id }).count();

    res.status(200).send({ messages, total });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
};

const getTotalMessages = async (req, res) => {
  const { chat_id } = req.params;

  try {
    const response = await ChatMessage.find({ chat: chat_id }).count();
    res.status(200).send(JSON.stringify(response));
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
};

const getLastMessage = async (req, res) => {
  const { chat_id } = req.params;

  try {
    const response = await ChatMessage.findOne({ chat: chat_id }).sort({
      createdAt: -1,
    });
    res.status(200).send(response || {});
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
};

export const ChatMessageController = {
  sendText,
  sendImage,
  getAll,
  getTotalMessages,
  getLastMessage,
};
