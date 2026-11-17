const Product = require('../models/Product');

const crearProducto = async (req, res) => {
    try {
        const producto = await Product.create(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear producto', error: error.message });
    }
};

const obtenerProductos = async (req, res) => {
    const productos = await Product.find({});
    res.json(productos);
};

module.exports = { crearProducto, obtenerProductos };