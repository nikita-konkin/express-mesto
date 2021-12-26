const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb',
{
  useNewUrlParser: true
}, err => {
  if(err){
    console.log(err)
  }else {
    console.log('Connected to MongoDB')
  }
});

app.use('/users', require('./routes/users'))

app.use('/cards', require('./routes/cards'))

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
