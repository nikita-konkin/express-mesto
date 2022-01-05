const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const {
  NODE_ENV,
  JWT_SECRET
} = process.env;

module.exports.login = (req, res) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({
      email: email
    }).select('+password')
    .then((user) => {

      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return {
        pass: bcrypt.compare(password, user.password),
        user
      };
    })

    .then((matched) => {
      // console.log(matched.user);
      // console.log(matched.pass);
      if (!matched.pass) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      const token = jwt.sign({
        _id: matched.user._id
      }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret')
      // console.log(token);
      res.cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60,
          httpOnly: true
        })
        .end()
    })
    .catch((err) => {
      res.status(401)
        .send({
          message: err.message
        });
    });
}

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
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
  let userid = req.params.userid;
  if (userid == 'me') {
    userid = req.user._id;
  }

  User.findById(userid)
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