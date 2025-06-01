const usuarioService = require('../service/UsuarioService');

//posteriormente configurar el next para errores personalizados
exports.createUsuario = async (req, res) => {
    try {
        const { nombre, ci, cargo, email, password, fechaRegistro } = req.body;
        const usuario = {
            nombre,
            ci,
            cargo,
            email,
            password, // Asegúrate de hashear la contraseña antes de guardarla
            fechaRegistro // Asegúrate de que la fecha esté en el formato correcto
        };
        const d = await usuarioService.createUsuario(usuario);
        console.log('Usuario creado con ID:', d);
        res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.getUsuarios = async (req, res) => {
    try{
        const usuarios = await usuarioService.getUsuarios();
        res.status(200).json(usuarios);
    }catch(error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateUsuario = async (req, res) => {
    try {
        const { ci } = req.params;
        const { nombre, cargo, email } = req.body;
        const dato = {
            nombre: nombre || '',
            cargo: cargo || '',
            email: email || ''
        };
        await usuarioService.updateUser(ci, dato);
        res.status(200).json({ message: 'Usuario actualizado' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.deleteUsuario = async (req, res) => {
    try {
        const { ciAdmin} = req.params;
        const { ci } = req.body;
        await usuarioService.deleteUsuario(ciAdmin, ci);
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}