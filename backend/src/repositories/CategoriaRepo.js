const db = require('../../config/database');

exports.createCategoria = async (categoria) => {
    const query = 'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)';
    const [result] = await db.execute(query, [
        categoria.nombre,
        categoria.descripcion
    ]);
    return result.insertId;
}
exports.searchCategoria = async (nombre) => {
    const query = 'SELECT idCategoria, nombre, descripcion FROM categoria WHERE nombre = ?';
    const [result] = await db.execute(query, [nombre]);
    return result;
}
exports.getCategorias = async () => {
    const query = 'SELECT idCategoria, nombre, descripcion FROM categoria';
    const [result] = await db.execute(query);
    return result;
}
exports.updateCategoria = async (categoria, idCategoria, clave) => {
    const query = `UPDATE categoria set  ${clave} = ? WHERE idCategoria = ?`;
    const [result] = await db.query(query,[categoria], idCategoria);
    return result.affectedRows;
}