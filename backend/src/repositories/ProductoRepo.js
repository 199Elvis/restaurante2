const db = require('../../config/database');

exports.createProducto = async (producto) => {
    console.log(producto);
    const query = 'INSERT INTO producto (nombre, descripcion, precio, stock, idCategoria, estado) VALUES (?, ?, ?, ?, ?, ?)';
    const newProducto = await db.execute(query, [
        producto.nombre, 
        producto.descripcion,
        producto.precio, 
        producto.stock,
        producto.idCategoria,
        producto.estado
    ]);
    console.log(newProducto);
    return newProducto[0].insertId;
}

exports.getProductos = async () => {
    const query = `SELECT idProducto, nombre, descripcion, precio, stock, idCategoria FROM producto WHERE estado = 'venta'`;
    const productos = await db.execute(query);
    return productos;
}
//actualizar estock

exports.getStock = async (idProducto) => {
    const query = 'SELECT stock FROM producto WHERE idProducto = ?';
    const [stock] = await db.execute(query, [idProducto]);
    return stock[0];
}

exports.updateStock = async (data, con = null) => {
    const query = `UPDATE producto SET stock = stock - ? WHERE idProducto = ?`;
    const values = [
        data.cantidad,
        data.idProducto
    ]
    console.log(values);
    const [producto] = con
            ? await con.query(query, values)
            : await db.execute(query, values);
    console.log("ocurrio un error", [data.cantidad, data.idProducto]);
    return producto.affectedRows;
}
/*
exports.updateStock = async (data, con = null) => {
    // Validación de entrada
    if (!data || typeof data !== 'object') {
        throw new Error('Datos de entrada inválidos: se esperaba un objeto');
    }

    if (!data.cantidad || !data.idProducto) {
        throw new Error('Faltan campos requeridos: cantidad e idProducto son obligatorios');
    }

    if (isNaN(data.cantidad) || data.cantidad <= 0) {
        throw new Error('La cantidad debe ser un número positivo');
    }

    const query = `UPDATE producto SET stock = stock - ? WHERE idProducto = ?`;
    const params = [data.cantidad, data.idProducto]; // Usamos array en lugar de objeto

    try {
        console.log('Ejecutando consulta:', query);
        console.log('Con parámetros:', params);

        const [result] = con 
            ? await con.query(query, params)
            : await db.execute(query, params);

        console.log('Resultado de la actualización:', {
            affectedRows: result.affectedRows,
            changedRows: result.changedRows
        });

        if (result.affectedRows === 0) {
            throw new Error('No se actualizó ningún registro. ¿Existe el producto?');
        }

        return result.affectedRows;

    } catch (error) {
        console.error('Error en updateStock:', {
            query,
            params,
            errorMessage: error.message,
            errorStack: error.stack,
            timestamp: new Date().toISOString()
        });

        // Distingue entre diferentes tipos de errores
        if (error.code === 'ER_NO_SUCH_TABLE') {
            throw new Error('La tabla producto no existe en la base de datos');
        } else if (error.code === 'ER_BAD_FIELD_ERROR') {
            throw new Error('Error en los campos de la tabla producto');
        } else if (error.code === 'ER_PARSE_ERROR') {
            throw new Error('Error de sintaxis en la consulta SQL');
        } else {
            throw new Error(`Error al actualizar el stock: ${error.message}`);
        }
    }
};
*/
exports.precioUnitario = async (idProducto, con = null) => {
    const query = 'SELECT precio FROM producto WHERE idProducto = ?';
    const [producto] = con
        ? await con.query(query, idProducto)
        : await db.execute(query, idProducto);
    return producto;
}