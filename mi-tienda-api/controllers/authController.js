const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'tu_clave_secreta_de_ejemplo', { expiresIn: '1d' });
};

const registrarUsuario = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const existeUsuario = await User.findOne({ email });
        if (existeUsuario) return res.status(400).json({ message: 'El usuario ya existe' });
        
        const usuario = await User.create({ nombre, email, password });
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: { _id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
            token: generarToken(usuario._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar', error: error.message });
    }
};

const loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await User.findOne({ email });
        if (usuario && (await usuario.matchPassword(password))) {
            res.status(200).json({
                message: 'Autenticación exitosa',
                token: generarToken(usuario._id),
                usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol }
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error: error.message });
    }
};

module.exports = { registrarUsuario, loginUsuario };