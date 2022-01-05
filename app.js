require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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
    console.warn(err);
  } else {
    console.warn('Connected to MongoDB');
  }
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({
    message: 'Страница не найдена',
  });
});

app.listen(PORT, () => {
  console.error(`App listening on port ${PORT}`);
});