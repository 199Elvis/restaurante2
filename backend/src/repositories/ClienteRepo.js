const db = require('../../config/database');

exports.createCliente = async (cliente, conn = null) => {
    const query = 'INSERT INTO cliente SET ?';
    const values = {
        nombre: cliente.nombre, 
        ci: cliente.ci
    }
    const [nuevoCliente] = conn
        ? await conn.query(query, values)
        : await db.execute(query, values)
    return nuevoCliente.insertId;
}

exports.updateCliente = async (cliente) => {
    const query = 'UPDATE usuario SET nombre = ? WHERE ci = ?';
    const actualizadoCliente = await db.execute(query, [cliente.nombre, cliente.ci]);
    return actualizadoCliente.insertId;
}

exports.searchCliente = async (ci) => {
    const query = 'SELECT nombre, ci FROM cliente WHERE ci = ?';
    const cliente = await db.execute(query, [ci]);
    return cliente;
}
//trabajar la forma de traer a la lista de los clientes necesito ver si traeremos a todos los clientes 
// o ver si trar de 10 en 10
