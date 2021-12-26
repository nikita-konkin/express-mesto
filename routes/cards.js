const router = require('express').Router();
const {
  createCard,
  getCards,
  delCardByid
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', delCardByid);

module.exports = router;