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
router.patch('/', updateAvatar);
router.patch('/me', updateUserProfile);

module.exports = router;