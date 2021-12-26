const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const User = require('./models/user');
const router = require('express').Router();


const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb?readPreference=primary&directConnection=true&ssl=false',
{
  useNewUrlParser: true
}, err => {
  if(err){
    console.log(err)
  }else {
    console.log('Connected to MongoDB')
  }
});


createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  console.log(req);
  console.log(about);
  console.log(req.body.about);


  User.create({name, about, avatar})
  .then(user => res.send({data: user}))
  .catch(err => res.status(500).send({message: err.message}))
}

app.use('/users', createUser)

app.use('/cards', require('./routes/cards'))
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
