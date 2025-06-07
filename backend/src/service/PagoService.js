// En src/service/PagoService.js

const clienteRepo = require('../repositories/ClienteRepo');
const facturaRepo = require('../repositories/FacturaRepo');
const detallePedidoRepo = require('../repositories/DetallePedidoRepo');
const pedidoRepo = require('../repositories/PedidoRepo'); // Corregido 'peidoRepo'
const pagoRepo = require('../repositories/PagoRepo');
const { getTransaction } = require('../../config/database');
const { cadenas, numeros, fechas, soloTexto } = require('../validation/validationUtils');
const fechaActual = require('../utils/dateNow'); // Asegúrate de que la ruta sea correcta

exports.realizarPago = async (data) => {
    let con;
    try {
        const fechaAc = fechaActual();

        con = await getTransaction();
        const pago = await crearPago({
            monto: data.monto,
            fecha: fechaAc,
            metodo: data.metodo,
            estadoP: data.estadoP
        }, con);
        const cliente = await crearCliente({
            nombre: data.nombre,
            ci: data.ci
        }, con);
        const pedido = await crearPedido({
            fecha: fechaAc,
            total: data.total,
            idSucursal: data.idSucursal,
            idUsuario: data.idUsuario,
            estadoPe: data.estadoPe, // Ojo: si en tu DB es 'estado', aquí debería ser 'estado'
            idCliente: cliente, // ¡Pasar el ID del cliente, no el objeto completo!
            idPago: pago // ¡Pasar el ID del pago, no el objeto completo!
        }, con);

        console.log(data);
        console.log(data.listProducto)
        const detallePromises = [];
        if (Array.isArray(data.listProducto)) {
            data.listProducto.forEach((listaProductos) => { // 'index' no se usa
                if (Array.isArray(listaProductos)) { // Asegurarse de que `listaProductos` es un array
                    listaProductos.forEach(clave => {
                        detallePromises.push(crearDetalle({
                            idPedido: pedido, // ¡Pasar el ID del pedido!
                            idProducto: clave.idProducto,
                            cantidad: clave.cantidad,
                            precioUnitario: clave.precioUnitario,
                            subtotal: clave.subtotal
                        }, con)); // Pasar la conexión
                    });
                } else {
                    console.warn('Advertencia: Se esperaba un array de arrays para productos. Verifique la estructura de data.productos.');
                }
            });
        } else {
            console.error('Error: data.productos no es un array o su estructura es inesperada.');
            throw new Error('Formato de productos incorrecto en la solicitud.');
        }

        await Promise.all(detallePromises); // Esperar a que todos los detalles se inserten

        await con.commit(); // Si todo salió bien, confirma la transacción
        console.log("Transacción confirmada exitosamente.");
        return { success: true, pedido };

    } catch (error) {
        console.error('Error al realizar el pago o en la transacción:', error);

        if (con) {
            console.log("Intentando rollback de la transacción...");
            try {
                await con.rollback();
                console.log("Transacción revertida exitosamente.");
            } catch (rollbackError) {
                console.error("Error al intentar revertir la transacción:", rollbackError);
            }
        }
        // Devolver un resultado de fallo
        return { success: false, error: error.message || "Error desconocido en el pago." };

    } finally {
        if (con) {
            console.log("Liberando conexión al pool.");
            con.release(); // Libera la conexión
        }
    }
};

// --- Funciones auxiliares: Asegurarse de que reciban `con` y los datos correctos ---

async function crearPago({ monto, fecha, metodo, estadoP }, con) {
    const data = { monto, fecha, metodo, estado: estadoP };
    try {
        const pago = await pagoRepo.createPago(data, con);
        return pago; // `pago` debería contener el ID insertado
    } catch (error) {
        // ¡Mejora crucial: lanzar el error original para depurar!
        console.error("Error original en pagoRepo.createPago:", error);
        throw new Error('Ocurrió un error al crear el pago: ' + error.message);
    }
}

async function crearCliente({ nombre, ci }, con) {
    const data = { nombre, ci };
    try {
        const cliente = await clienteRepo.createCliente(data, con);
        return cliente; // `cliente` debería contener el ID insertado
    } catch (error) {
        console.error("Error original en clienteRepo.createCliente:", error);
        throw new Error('Ocurrió un error al crear el cliente: ' + error.message);
    }
}

async function crearPedido({ fecha, total, idSucursal, idUsuario, estadoPe, idCliente, idPago }, con) {
    const data = {
        fecha,
        total,
        idSucursal,
        idUsuario,
        estado: estadoPe, // Asumo que el campo en DB es 'estado'
        idCliente,
        idPago
    };
    try {
        const pedido = await pedidoRepo.createPedido(data, con);
        return pedido; // `pedido` debería contener el ID insertado
    } catch (error) {
        console.error("Error original en pedidoRepo.createPedido:", error); // <-- ¡Esto es vital!
        throw new Error('Ocurrió un error al crear el pedido: ' + error.message); // Incluye el mensaje original
    }
}

async function crearDetalle({ idPedido, idProducto, cantidad, precioUnitario, subtotal }, con) {
    const data = { idPedido, idProducto, cantidad, precioUnitario, subtotal };
    try {
        const detalle = await detallePedidoRepo.createDetallePedido(data, con);
        return detalle;
    } catch (error) {
        console.error("Error original en detallePedidoRepo.createDetallePedido:", error);
        throw new Error('Ocurrió un error al agregar el detalle del pedido: ' + error.message);
    }
}