const categoriaService = require('../service/CategoriaService');

exports.createCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const categoria = {
            nombre,
            descripcion
        };
        const newCategoria = await categoriaService.createCategoria(categoria);
        res.status(201).json({ message: 'Categoría creada'});
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.getCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateCategoria = async (req, res) => {
    try{
        const idCategoria = req.params;
        const {nombre, descripcion} = req.body;
        const dataCategoria = {
            idCategoria,
            nombre,
            descripcion
        }
        const categoria = await categoriaService.updateCategoria(dataCategoria);

        res.status(200).json(categoria);
    }catch(error){
        res.status(500).json({
            message: "internal server error"
        });
    }
}