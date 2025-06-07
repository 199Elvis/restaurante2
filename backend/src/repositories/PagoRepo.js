const db = require('../../config/database');

exports.createPago = async (data, conn = null) => {
    
    const query = 'INSERT INTO pago SET ?';
    const values = {
        monto: data.monto,
        fecha: data.fecha,
        metodo: data.metodo,
        estado: data.estadoP
    }
    const [pago] = conn
        ? await conn.query(query, values)
        : await db.execute(query, values);
    return pago.insertId;
}