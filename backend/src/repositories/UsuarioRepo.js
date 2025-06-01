//1
const db = require('../../config/database');

exports.createUsuario = async (usuario) => {
    const query = 'INSERT INTO usuario (nombre, ci, cargo, email, password, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [
        usuario.nombre,
        usuario.ci,
        usuario.cargo,
        usuario.email,
        usuario.password,
        usuario.fechaRegistro
    ]);
    return result.insertId;
}
exports.buscarUsuario = async (ci, email) => {
    const query = 'SELECT nombre FROM usuario WHERE email =? OR ci =?';
    const [result] = await db.execute(query, [
        email,
        ci
    ]);
    return result;
}
exports.getUsuarios = async () => {
    const query = 'SELECT idUsuario, nombre, ci, cargo, email, fechaRegistro FROM usuario';
    const [result] = await db.execute(query);
    return result;
}
exports.getUsuarioCi = async (ci) => {
    const query = 'SELECT nombre, cargo, email, ci FROM usuario WHERE ci = ?';
    const result = await db.execute(query, [ci]);
    return result[0];
}
exports.updateUsuario = async (ci, campo, dato) => {
    const query = `UPDATE usuario SET ${campo} = ? WHERE ci = ?`;
    const [result] = await db.execute(query, [
        dato,
        ci
    ]);
    return result.affectedRows;
}
exports.deleteUser = async (ci) => {
    const query = 'DELETE FROM usuario WHERE ci = ?';
    const [result] = await db.execute(query, [ci]);
    return result.affectedRows;
}