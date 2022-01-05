const router = require('express').Router();
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

// router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userid', celebrate({
  params: Joi.object().keys({
    userid: Joi.string().required(),
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
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = router;