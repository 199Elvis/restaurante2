const db = require('../../config/database');

exports.createSucursal = async (sucursal) => {
    const query = 'INSERT INTO sucursal (nombre, direccion, telefono) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [
        sucursal.nombre,
        sucursal.direccion,
        sucursal.telefono
    ])
    return result.insertId;
}

exports.getSucursal = async () => {
    const query = 'SELECT idSucursal, nombre, direccion, telefono FROM sucursal LIMIT 1';
    const [result] = await db.execute(query);
    return result;
}

exports.updateSucursal = async (clave, valor, idSucursal) => {
    const query = `UPDATE sucursal SET ${clave} = ? WHERE idSucursal = ?`;
    const [result] = await db.execute(query, [valor, idSucursal]);
    return result.affectedRows;
}