const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
    likes,
    createdAt,
  } = req.body;
  const owner = req.user._id;

  Card.create({
      name,
      link,
      owner,
      likes,
      createdAt,
    })
    .then((card) => res.send({
      data: card,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new Error('400 — Переданы некорректные данные при создании карточки.');
        e.statusCode = 400;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({
      data: cards,
    }))
    .catch((err) => {
      const e = new Error(err.message);
      e.statusCode = 500;
      next(e);
    });
};

module.exports.delCardByid = (req, res, next) => {
  console.log(req.user._id);
  console.log(req.params.cardId);
  Card.findOne({
      _id: req.params.cardId,
      owner: req.user._id,
    })
    .then((card) => {
      if (card) {
        Card.deleteOne({
            _id: req.params.cardId,
          })
          .orFail(() => {
            const e = new Error('500 — Запись не найдена.');
            e.statusCode = 500;
            next(e);
          })
          .then((card) => {
            res.send({
              data: card,
            });
          })
      } else {
        const e = new Error('403 — Запрещено.');
        e.statusCode = 403;
        next(e);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error('400 — Переданы некорректные данные для удаления карточки.');
        e.statusCode = 400;
        next(e);
      } else if (err.name === 'NotFound') {
        const e = new Error('404 — Карточка с указанным _id не найдена.');
        e.statusCode = 404;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });

};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
      req.params.cardId, {
        $addToSet: {
          likes: req.user._id,
        },
      }, {
        new: true,
      },
    )
    .orFail(() => {
      const e = new Error('500 — Запись не найдена.');
      e.statusCode = 500;
      next(e);
    })
    .then((likes) => {
      res.send({
        data: likes,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error('400 — Переданы некорректные данные для постановки/снятии лайка.');
        e.statusCode = 400;
        next(e);
      } else if (err.message === 'NotFound') {
        const e = new Error('404 — Передан несуществующий _id карточки.');
        e.statusCode = 404;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
      req.params.cardId, {
        $pull: {
          likes: req.user._id,
        },
      }, {
        new: true,
      },
    )
    .orFail(() => {
      const e = new Error('500 — Запись не найдена.');
      e.statusCode = 500;
      next(e);
    })
    .then((likes) => {
      res.send({
        data: likes,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error('400 — Переданы некорректные данные для постановки/снятии лайка.');
        e.statusCode = 400;
        next(e);
      } else if (err.message === 'NotFound') {
        const e = new Error('404 — Передан несуществующий _id карточки.');
        e.statusCode = 404;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};