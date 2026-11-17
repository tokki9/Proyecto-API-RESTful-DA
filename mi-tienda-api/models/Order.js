const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productos: [{
        producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        cantidad: { type: Number, required: true, min: 1 }
    }],
    total: { type: Number, required: true },
    estado: { type: String, enum: ['pendiente', 'pagada', 'enviada', 'entregada', 'cancelada', 'devuelta'], default: 'pendiente' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);