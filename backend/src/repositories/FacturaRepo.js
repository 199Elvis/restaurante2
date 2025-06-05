const db = require('../../config/database');

exports.createFactura = async (data, conn = null) => {
    const query = 'INSERT INTO factura SET ?';
    const values = {
        idPedido: data.idPedido,
        numeroFactura: data.numeroFactura,
        totalFinal: data.totalFinal,
        fechaEmision: data.fechaEmision
    }
    const [factura] = conn
        ? await conn.query(query, values)
        : await db.execute(query, values)
    return factura[0].insertId;
}