const express = require('express');
const router = express.Router();
const { crearProducto, obtenerProductos } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', obtenerProductos);
router.post('/', protect, crearProducto);

module.exports = router;