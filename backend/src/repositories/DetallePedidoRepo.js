const db = require('../../config/database');

exports.createDetallePedido = async (data, conn = null) => {
    const query = 'INSERT INTO detallePedido SET ?';
    const values = {
        idPedido: data.idPedido,
        idProducto: data.idProducto,
        cantidad: data.cantidad,
        precioUnitario: data.precioUnitario,
        subtotal: data.subtotal
    }
    const detalle = conn
        ? await conn.query(query, values)
        : await db.execute(query, values)
    return detalle.insertId;
}