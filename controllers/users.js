const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar
  } = req.body;

  User.create({
      name,
      about,
      avatar
    })
    .then(user => res.send({
      data: user
    }))
    .catch(err => res.status(500).send({
      message: err.message
    }))
}

module.exports.getUsers = (req, res) => {

  User.find({})
    .then(user => res.send({
      data: user
    }))
    .catch(err => res.status(500).send({
      message: err.message
    }))
}

module.exports.getUserById = (req, res) => {

  userid = req.params.userid;

  User.findById(userid)
    .then(user => {
      res.send({
        user
      })
    })
    .catch(err => res.status(500).send({
      message: err.message
    }))

}