const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const {
  NODE_ENV,
  JWT_SECRET
} = process.env;

module.exports.login = (req, res, next) => {
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

      req.user = user

      return bcrypt.compare(password, user.password)

    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      const token = jwt.sign({
        _id: req.user._id
      }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret')
      res.cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60,
          httpOnly: true
        })
        .end()
    })
    .catch((err) => {
      const e = new Error(err.message);
      e.statusCode = 401;

      next(e);
    });
}

module.exports.createUser = (req, res, next) => {
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
        const e = new Error('400 — Переданы некорректные данные при создании карточки.');
        e.statusCode = 400;
        next(e);
      } else if (err.name === "MongoServerError" && err.code === 11000) {
        const e = new Error('409 - Пользователь уже зарегистрирован по данному email.');
        e.statusCode = 409;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({
      data: user,
    }))
    .catch((err) => {
      const e = new Error(err.message);
      e.statusCode = 500;
      next(e);
    })
};

module.exports.getUserById = (req, res, next) => {
  let userid = req.params.userid;
  if (userid == 'me') {
    userid = req.user._id;
  }

  User.findById(userid)
    .orFail(() => {
      const e = new Error('500 — Запись не найдена.');
      e.statusCode = 500;
      next(e);
    })
    .then((user) => {
      res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error('400 - Невалидный id');
        e.statusCode = 400;
        next(e);
      } else if (err.message === 'NotFound') {
        const e = new Error('404 — данных по указанному _id не найдено.');
        e.statusCode = 404;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const {
    avatar,
  } = req.body;
  console.log(avatar);
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
        const e = new Error(err);
        e.statusCode = 400;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
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
        const e = new Error('400 - Некорректные данные');
        e.statusCode = 400;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};