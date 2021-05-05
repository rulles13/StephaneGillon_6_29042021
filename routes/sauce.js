const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.post('/', auth, multer, sauceCtrl.createSauce);


router.put('/:id', auth, multer, sauceCtrl.modifyThing);
router.delete('/:id', auth, sauceCtrl.deleteThing);
router.get('/', auth, sauceCtrl.getAllThings);
router.get('/:id', auth, sauceCtrl.getOneThing);


module.exports = router;