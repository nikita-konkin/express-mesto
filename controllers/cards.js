const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const {
    name,
    link,
    likes,
    createdAt
  } = req.body;
  const owner = req.user._id

  Card.create({
      name,
      link,
      owner,
      likes,
      createdAt
    })
    .then(card => res.send({
      data: card
    }))
    .catch(err => res.status(500).send({
      message: err.message
    }))
}

module.exports.getCards = (req, res) => {

  Card.find({})
    .then(cards => res.send({
      data: cards
    }))
    .catch(err => res.status(500).send({
      message: err.message
    }))
}

module.exports.delCardByid = (req, res) => {

  cardId = req.params.cardId;

  Card.deleteOne({
      id: cardId
    })
    .then(card => {
      res.send({
        data: card
      })
    })
    .catch(err => res.status(500).send({
      message: err.message
    }))

}