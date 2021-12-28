const Card = require('../models/card');

module.exports.createCard = (req, res) => {
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

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({
      data: cards,
    }))
    .catch((err) => res.status(500).send({
      message: err.message,
    }));
};

module.exports.delCardByid = (req, res) => {
  Card.deleteOne({
    id: req.params.cardId,
  })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res.send({
        data: card,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: '400 — Переданы некорректные данные для постановки/снятии лайка.',
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: '404 — Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(500).send({
          message: '500 — Ошибка по умолчанию.',
        });
      }
    });
};

module.exports.likeCard = (req, res) => {
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
      throw new Error('NotFound');
    })
    .then((likes) => {
      res.send({
        data: likes,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: '400 — Переданы некорректные данные для постановки/снятии лайка.',
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: '404 — Передан несуществующий _id карточки.',
        });
      } else {
        res.status(500).send({
          message: '500 — Ошибка по умолчанию.',
        });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
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
      throw new Error('NotFound');
    })
    .then((likes) => {
      res.send({
        data: likes,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: '400 — Переданы некорректные данные для постановки/снятии лайка.',
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: '404 — Передан несуществующий _id карточки.',
        });
      } else {
        res.status(500).send({
          message: '500 — Ошибка по умолчанию.',
        });
      }
    });
};
