const db = require('../../config/database');

exports.createPedido = async (data, con = null) => {
    const query = 'INSERT INTO pedido SET ?';
    const values = {
        fecha: data.fecha,
        total: data.total,
        idSucursal: data.idSucursal,
        idUsuario: data.idUsuario,
        estado: data.estado,
        edCliente: data.idCliente
    }
    const pedido = con
        ? await con.query(query, values)
        : await db.execute(query, values);
    return pedido.insertId;
}