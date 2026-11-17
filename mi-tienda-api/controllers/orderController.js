const Order = require('../models/Order');
const Product = require('../models/Product');

const crearOrden = async (req, res) => {
    const { productos, total } = req.body;
    try {
        // Descontar stock
        for (const item of productos) {
            const productoDB = await Product.findById(item.producto);
            if (!productoDB || productoDB.stock < item.cantidad) {
                return res.status(400).json({ message: 'Stock insuficiente para el producto ' + item.producto });
            }
            productoDB.stock -= item.cantidad;
            await productoDB.save();
        }

        const orden = await Order.create({
            usuario: req.user.id,
            productos,
            total
        });
        res.status(201).json({ message: 'Orden creada exitosamente', orden });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear orden', error: error.message });
    }
};

const devolverOrden = async (req, res) => {
    try {
        const orden = await Order.findById(req.params.id);
        if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });
        if (orden.estado === 'devuelta') return res.status(400).json({ message: 'La orden ya fue devuelta' });

        // Restaurar stock
        for (const item of orden.productos) {
            const productoDB = await Product.findById(item.producto);
            if (productoDB) {
                productoDB.stock += item.cantidad;
                await productoDB.save();
            }
        }

        orden.estado = 'devuelta';
        await orden.save();
        res.status(200).json({ message: 'Orden devuelta y stock restaurado exitosamente', orden });
    } catch (error) {
        res.status(500).json({ message: 'Error al devolver orden', error: error.message });
    }
};

module.exports = { crearOrden, devolverOrden };