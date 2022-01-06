const router = require('express').Router();
const validator = require('validator');

const {
  celebrate,
  Joi
} = require('celebrate');

const {
  // createUser,
  getUsers,
  getUserById,
  updateAvatar,
  updateUserProfile,
} = require('../controllers/users');

const validateURL = (value) => {
  if (!validator.isURL(value, {
      require_protocol: true
    })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};
// router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userid', celebrate({
  params: Joi.object().keys({
    userid: Joi.string().length(24).hex(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(15),
    about: Joi.string().required().max(30),
  }),
}), updateUserProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: validateURL,
  }),
}), updateAvatar);

module.exports = router;