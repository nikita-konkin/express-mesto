const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link, owner, likes, createdAt } = req.body;



  Card.create({ name, link, owner, likes, createdAt })
  .then(card => res.send({data: card}))
  .catch(err => res.status(500).send({message: err.message}))
}
