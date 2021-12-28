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
    .then((user) => res.send({
      data: user,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: '400 — Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(500).send({
          message: '500 — Ошибка по умолчанию.',
        });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({
      data: user,
    }))
    .catch((err) => res.status(500).send({
      message: err.message,
    }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userid)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: '400 - Невалидный id',
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: '404 — данных по указанному _id не найдено.',
        });
      } else {
        res.status(500).send({
          message: '500 — Ошибка по умолчанию.',
        });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const {
    avatar,
  } = req.body;

  User.findByIdAndUpdate(
    req.user._id, {
      avatar,
    }, {
      new: true,
      runValidators: true,
    },
  )
    .then((avatarLink) => {
      res.send({
        data: avatarLink,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: '400 - Некорректные данные',
        });
      } else {
        res.status(500).send({
          message: '500 — Ошибка по умолчанию.',
        });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const {
    name,
    about,
  } = req.body;

  User.findByIdAndUpdate(
    req.user._id, {
      name,
      about,
    }, {
      new: true,
      runValidators: true,
    },
  )
    .then((data) => {
      res.send({
        data,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: '400 - Некорректные данные',
        });
      } else {
        res.status(500).send({
          message: '500 — Ошибка по умолчанию.',
        });
      }
    });
};
