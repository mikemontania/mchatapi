import { Chat, ChatMessage } from "../models/index.js";
// Método para crear un nuevo chat
const create = async (req, res) => {
  try {
    const { participant_id_one, participant_id_two } = req.body;

    const foundOne = await Chat.findOne({
      participant_one: participant_id_one,
      participant_two: participant_id_two,
    });

    const foundTwo = await Chat.findOne({
      participant_one: participant_id_two,
      participant_two: participant_id_one,
    });

    if (foundOne || foundTwo) {
      res.status(200).send({ msg: "Ya tienes un chat con este usuario" });
      return;
    }

    const chat = new Chat({
      participant_one: participant_id_one,
      participant_two: participant_id_two,
    });

    const chatStorage = await chat.save();
    res.status(201).send(chatStorage);
  } catch (error) {
    res.status(400).send({ msg: "Error al crear el chat" });
  }
};

// Método para obtener todos los chats de un usuario
const getAll = async (req, res) => {
  try {
    const { user_id } = req.user;

    const chats = await Chat.find({
      $or: [{ participant_one: user_id }, { participant_two: user_id }],
    })
      .populate("participant_one")
      .populate("participant_two");

    const arrayChats = [];
    for await (const chat of chats) {
      const response = await ChatMessage.findOne({ chat: chat._id }).sort({
        createdAt: -1,
      });

      arrayChats.push({
        ...chat._doc,
        last_message_date: response?.createdAt || null,
      });
    }

    res.status(200).send(arrayChats);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener los chats" });
  }
};

// Método para eliminar un chat por su ID
const deleteChat = async (req, res) => {
  try {
    const chat_id = req.params.id;
    await Chat.findByIdAndDelete(chat_id);
    res.status(200).send({ msg: "Chat eliminado" });
  } catch (error) {
    res.status(400).send({ msg: "Error al eliminar el chat" });
  }
};

// Método para obtener un chat por su ID
const getChat = async (req, res) => {
  try {
    const chat_id = req.params.id;
    const chatStorage = await Chat.findById(chat_id)
      .populate("participant_one")
      .populate("participant_two");

    res.status(200).send(chatStorage);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener el chat" });
  }
};


export const ChatController = {
  create,
  getAll,
  deleteChat,
  getChat,
};
