const db = require('../../config/database');

exports.createProducto = async (producto) => {
    const query = 'INSERT INTO producto (nombre, descripcion, precio, stock, idCategoria, estado) VALUES (?, ?, ?, ?, ?, ?)';
    const newProducto = await db.execute(query, [
        producto.nombre, 
        producto.descripcion, 
        producto.stock,
        producto.idCategoria,
        producto.estado
    ]);
    return newProducto.insertId;
}

exports.getProductos = async () => {
    const query = `SELECT idProducto, nombre, descripcion, precio, stock, idCategoria FROM productos WHERE estado = 'venta'`;
    const productos = await db.execute(query);
    return productos;
}
//actualizar estock

exports.getStock = async (idProducto) => {
    const query = 'SELECT stock FROM productos WHERE idProducto = ?';
    const [stock] = await db.execute(query, [idProducto]);
    return stock[0];
}
exports.updateStock = async (data) => {
    const query = 'UPDATE productos SET stock = ? WHERE idProducto = ?';
    const productoStock = await db.execute(query, [data.stock, data.idProducto]);
    return productoStock.insertId;
}