import { User, Group, GroupMessage } from "../models/index.js";
import { getFilePath } from "../utils/index.js";
// Método para crear un grupo
const create = async (req, res) => {
  try {
    const { user_id } = req.user;
    const group = new Group(req.body);
    group.creator = user_id;
    group.participants = JSON.parse(req.body.participants);
    group.participants = [...group.participants, user_id];

    if (req.files.image) {
      const imagePath = getFilePath(req.files.image);
      group.image = imagePath;
    }

    await group.save();

    if (!group) {
      res.status(400).send({ msg: "Error al crear el grupo" });
    } else {
      res.status(201).send(group);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Método para obtener todos los grupos de un usuario
const getAll = async (req, res) => {
  try {
    const { user_id } = req.user;
    const groups = await Group.find({ participants: user_id })
      .populate("creator")
      .populate("participants");

    const arrayGroups = [];
    for await (const group of groups) {
      const response = await GroupMessage.findOne({ group: group._id }).sort({
        createdAt: -1,
      });

      arrayGroups.push({
        ...group._doc,
        last_message_date: response?.createdAt || null,
      });
    }

    res.status(200).send(arrayGroups);
  } catch (error) {
    res.status(500).send({ msg: "Error al obtener los grupos" });
  }
};

// Método para obtener un grupo específico
const getGroup = async (req, res) => {
  try {
    const group_id = req.params.id;
    const groupStorage = await Group.findById(group_id).populate("participants");

    if (!groupStorage) {
      res.status(400).send({ msg: "No se ha encontrado el grupo" });
    } else {
      res.status(200).send(groupStorage);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Método para actualizar un grupo
const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const group = await Group.findById(id);

    if (name) group.name = name;

    if (req.files.image) {
      const imagePath = getFilePath(req.files.image);
      group.image = imagePath;
    }

    await Group.findByIdAndUpdate(id, group);

    res.status(200).send({ image: group.image, name: group.name });
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Método para salir de un grupo
const exitGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const group = await Group.findById(id);

    const newParticipants = group.participants.filter(
      (participant) => participant.toString() !== user_id
    );

    const newData = {
      ...group._doc,
      participants: newParticipants,
    };

    await Group.findByIdAndUpdate(id, newData);

    res.status(200).send({ msg: "Salida exitosa" });
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Método para añadir participantes a un grupo
const addParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const { users_id } = req.body;

    const group = await Group.findById(id);
    const users = await User.find({ _id: users_id });

    const arrayObjectIds = users.map((user) => user._id);

    const newData = {
      ...group._doc,
      participants: [...group.participants, ...arrayObjectIds],
    };

    await Group.findByIdAndUpdate(id, newData);

    res.status(200).send({ msg: "Participantes añadidos correctamente" });
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

// Método para banear a un participante de un grupo
const banParticipant = async (req, res) => {
  try {
    const { group_id, user_id } = req.body;

    const group = await Group.findById(group_id);

    const newParticipants = group.participants.filter(
      (participant) => participant.toString() !== user_id
    );

    const newData = {
      ...group._doc,
      participants: newParticipants,
    };

    await Group.findByIdAndUpdate(group_id, newData);

    res.status(200).send({ msg: "Baneo con éxito" });
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};


export const GroupController = {
  create,
  getAll,
  getGroup,
  updateGroup,
  exitGroup,
  addParticipants,
  banParticipant,
};
