const productoService = require('../service/ProductoService');

exports.crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, idCategoria, estado } = req.body;
        const data = {nombre, descripcion, stock, precio, idCategoria, estado}
        const producto = await productoService.crearProducto(data);
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json(error);
    }
}