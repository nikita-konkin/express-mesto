const jwt = require('jsonwebtoken');

const {
  NODE_ENV,
  JWT_SECRET
} = process.env;

module.exports = (req, res, next) => {

  const authorization = req.cookies.jwt;

  if (!authorization) {
    return res
      .status(401)
      .send({
        message: 'Необходима авторизация'
      });
  }

  const token = authorization;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res
      .status(401)
      .send({
        message: 'Необходима авторизация'
      });
  }

  req.user = payload;

  next();
};