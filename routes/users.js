const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateAvatar,
  updateUserProfile
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userid', getUserById);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;