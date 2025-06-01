const usuarioService = require('../service/CategoriaService');

exports.createCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const categoria = {
            nombre,
            descripcion
        };
        const newCategoria = await usuarioService.createCategoria(categoria);
        res.status(201).json({ message: 'Categoría creada'});
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}