require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
  errors
} = require('celebrate');
const {
  celebrate,
  Joi
} = require('celebrate');

const {
  login,
  createUser,
  getUserInfo,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const {
  PORT = 3000,
} = process.env;

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) {
    const e = new Error(err.message);
    e.statusCode = err.code;
    next(e);
  } else {
    console.warn('Connected to MongoDB');
  }
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(15),
    about: Joi.string().max(15),
    avatar: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({
    message: 'Страница не найдена',
  });
});

app.use(errors());
app.use((err, req, res, next) => {
  console.log(err.statusCode);
  res.status(err.statusCode).send({
    message: err.message
  });
});

app.listen(PORT, () => {
  console.error(`App listening on port ${PORT}`);
});