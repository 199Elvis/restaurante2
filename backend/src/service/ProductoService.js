const productoRepo = require('../repositories/ProductoRepo');

exports.crearProducto = async (data) => {
    const producto = await productoRepo.createProducto(data);
    return producto;
}