const express = require('express');
const router = express.Router();
const { crearOrden, devolverOrden } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, crearOrden);
router.put('/:id/devolver', protect, devolverOrden);

module.exports = router;