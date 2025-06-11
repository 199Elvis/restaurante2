const productoRepo = require('../repositories/ProductoRepo');
const clienteRepo = require('../repositories/ClienteRepo');
const facturaRepo = require('../repositories/FacturaRepo');
const detallePedidoRepo = require('../repositories/DetallePedidoRepo');
const pedidoRepo = require('../repositories/PedidoRepo'); // Corregido 'peidoRepo'
const pagoRepo = require('../repositories/PagoRepo');
const { getTransaction } = require('../../config/database');
const { cadenas, numeros, fechas, soloTexto, decimales } = require('../validation/validationUtils');
const fechaActual = require('../utils/dateNow'); // Asegúrate de que la ruta sea correcta

exports.realizarPago = async (data) => {
    let con;
    try {
        const fechaAc = fechaActual();
        let tot = 0;
        let sub = 0;
        if (!validarDatosEntrada(data)) {
            throw new Error('Datos de entrada no válidos');
        }
        data.listProducto.forEach((lista) => {
            lista.forEach(clave => {
                sub = clave.precioUnitario * clave.cantidad;
                tot = tot + sub;
            })
        })
        
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
            total: tot.toFixed(2),
            idSucursal: data.idSucursal,
            idUsuario: data.idUsuario,
            estadoPe: data.estadoPe,
            idCliente: cliente,
            idPago: pago
        }, con);
        const detallePromises = [];
        const stockPromises = [];
        if (Array.isArray(data.listProducto)) {
            const isValidStructure = data.listProducto.every(lista => Array.isArray(lista));
            
            if (!isValidStructure) {
                throw new Error('Formato incorrecto: cada elemento debe ser un array de productos');
            }
            for (const listaProductos of data.listProducto) {
                for (const producto of listaProductos) {
                    try {
                        const pre = await productoRepo.precioUnitario(producto.idProducto, con);
                        console.log("holas",pre);
                        if (Math.abs(pre - producto.precioUnitario) > 0.01) {
                            console.warn(`Precio diferente para producto ${producto.idProducto}: 
                                DB=${pre}, Recibido=${producto.precioUnitario}`);
                        }
                        const subTo = producto.precioUnitario * producto.cantidad;
                        detallePromises.push(crearDetalle({
                            idPedido: pedido,
                            idProducto: producto.idProducto,
                            cantidad: producto.cantidad,
                            precioUnitario: producto.precioUnitario,
                            subtotal: subTo.toFixed(2)
                        }, con));

                        stockPromises.push(actualizarStock({
                            cantidad: producto.cantidad, 
                            idProducto: producto.idProducto
                        }, con));
                        
                    } catch (error) {
                        console.error(`Error procesando producto ${producto.idProducto}:`, error);
                        throw new Error(`Error en producto ID ${producto.idProducto}: ${error.message}`);
                    }
                }
            }
        } else {
            console.error('Error: data.listProducto no es un array');
            throw new Error('Formato de productos incorrecto en la solicitud.');
        }
        /*
        if (Array.isArray(data.listProducto)) {
            data.listProducto.forEach((listaProductos) => {
                if (Array.isArray(listaProductos)) {
                    listaProductos.forEach(clave => {
                        const subTo = clave.precioUnitario * clave.cantidad
                        const pre = await productoRepo.precioUnitario(clave.idProducto)
                        detallePromises.push(crearDetalle({
                            idPedido: pedido,
                            idProducto: clave.idProducto,
                            cantidad: clave.cantidad,
                            precioUnitario: clave.precioUnitario,
                            subtotal: subTo.toFixed(2)
                        }, con));
                        stockPromises.push(actualizarStock({
                            cantidad: clave.cantidad, 
                            idProducto: clave.idProducto
                        }, con));
                    });
                } else {
                    console.warn('Advertencia: Se esperaba un array de arrays para productos. Verifique la estructura de data.productos.');
                }
            });
        } else {
            console.error('Error: data.productos no es un array o su estructura es inesperada.');
            throw new Error('Formato de productos incorrecto en la solicitud.');
        }*/

        await Promise.all(detallePromises);
        await Promise.all(stockPromises);

        await con.commit();
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

async function crearPago({ monto, fecha, metodo, estadoP }, con) {
    const data = { monto, fecha, metodo, estado: estadoP };
    try {
        const pago = await pagoRepo.createPago(data, con);
        return pago;
    } catch (error) {
        console.error("Error original en pagoRepo.createPago:", error);
        throw new Error('Ocurrió un error al crear el pago: ' + error.message);
    }
}

async function crearCliente({ nombre, ci }, con) {
    const data = { nombre, ci };
    try {
        const cliente = await clienteRepo.createCliente(data, con);
        return cliente;
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
        estado: estadoPe,
        idCliente,
        idPago
    };
    try {
        const pedido = await pedidoRepo.createPedido(data, con);
        return pedido;
    } catch (error) {
        console.error("Error original en pedidoRepo.createPedido:", error);
        throw new Error('Ocurrió un error al crear el pedido: ' + error.message);
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

async function actualizarStock({cantidad, idProducto}, con){
    try {
        const producto = await productoRepo.updateStock({cantidad, idProducto}, con);
        return producto;        
    } catch (error) {
        console.error("Error original en detallePedidoRepo.createDetallePedido:", error);
        throw new Error('Ocurrió un error al actualizar el stock: ' + error.message);
    }
}


function validarDatosEntrada(data) {
    const camposRequeridos = ['monto', 'metodo', 'nombre', 'ci', 'listProducto'];
    console.log(data);
    for (const campo of camposRequeridos) {
        if (!data[campo]) {
            throw new Error(`Campo requerido faltante: ${campo}`);
        }
    }
    if (!decimales(data.monto.toString())) {
        throw new Error('Monto no válido');
    }
    if (!soloTexto(data.metodo) || !soloTexto(data.nombre)) {
        throw new Error('Metodo o nombre no válidos');
    }
    if (!numeros(data.ci)) {
        throw new Error('CI no válida');
    }
    if (!Array.isArray(data.listProducto)) {
        throw new Error('Formato de productos inválido');
    }
    for (const lista of data.listProducto) {
        if (!Array.isArray(lista)) {
            throw new Error('Cada elemento de listaProductos debe ser un array');
        }
        for (const producto of lista) {
            if (!numeros(producto.idProducto) || 
                !numeros(producto.cantidad) || 
                !decimales(producto.precioUnitario.toString())) {
                throw new Error('Datos de producto no válidos');
            }
        }
    }
    return true;
}