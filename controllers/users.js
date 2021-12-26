const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  console.log(req);
  console.log(about);
  console.log(req.body.about);


  User.create({name, about, avatar})
  .then(user => res.send({data: user}))
  .catch(err => res.status(500).send({message: err.message}))
}
