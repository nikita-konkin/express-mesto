const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({
      name,
      about,
      avatar,
    })
    .then(user => res.send({
      data: user,
    }))
    .catch((err) => {
      if (err.name == 'ValidationError') {
        res.status(400).send({
          message: "400 — Переданы некорректные данные при создании карточки.",
        })
      } else {
        res.status(500).send({
          message: "500 — Ошибка по умолчанию.",
        })
      }
    })
};

module.exports.getUsers = (req, res) => {

  User.find({})
    .then((user) => res.send({
      data: user,
    }))
    .catch(err => res.status(404).send({
      message: err.message,
    }))
};

module.exports.getUserById = (req, res) => {

  User.findById(req.params.userid)
    .then((user) => {
      res.send({
        data: user,
      })
    })
    .catch((err) => {
      if (err.path === '_id') {
        res.status(404).send({
          message: "404 — Пользователь по указанному _id не найден.",
        })
      } else {
        res.status(500).send({
          message: "500 — Ошибка по умолчанию.",
        })
      }
    })
};

module.exports.updateAvatar = (req, res) => {

  const {
    avatar
  } = req.body;

  User.updateOne({
      "_id": req.user._id,
    }, {
      "avatar": avatar,
    })
    .then((avatar) => {
      if (!avatar.acknowledged) {
        throw "avatarError"
      }
      res.send({
        data: avatar,
      })
    })
    .catch((err) => {
      if (err == 'avatarError') {
        res.status(404).send({
          message: "404 — Пользователь с указанным _id не найден.",
        })
      } else if (err.path === '_id') {
        res.status(404).send({
          message: "404 — Пользователь с указанным _id не найден.",
        })
      } else {
        res.status(500).send({
          message: "500 — Ошибка по умолчанию.",
        })
      }
    })
};

module.exports.updateUserProfile = (req, res) => {

  const {
    name,
    about,
  } = req.body;

  User.updateMany({
      "_id": req.user._id,
    }, {
      "name": name,
      "about": about,
    })
    .then((data) => {
      if (!data.acknowledged) {
        throw "userDataError"
      }
      res.send({
        data: data,
      })
    })
    .catch((err) => {
      if (err == 'userDataError') {
        res.status(400).send({
          message: "400 — Переданы некорректные данные при обновлении аватара.",
        })
      } else if (err.path === '_id') {
        res.status(404).send({
          message: "404 — Пользователь с указанным _id не найден.",
        })
      } else {
        res.status(500).send({
          message: "500 — Ошибка по умолчанию.",
        })
      }
    })
};