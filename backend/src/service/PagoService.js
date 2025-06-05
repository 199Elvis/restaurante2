    const clienteRepo = require('../repositories/ClienteRepo');
    const facturaRepo = require('../repositories/FacturaRepo');
    const detallePedidoRepo = require('../repositories/DetallePedidoRepo');
    const peidoRepo = require('../repositories/PedidoRepo');
    const pagoRepo = require('../repositories/PagoRepo');
    const {getTransaction} = require('../../config/database');


    const {cadenas,numeros,fechas,soloTexto} = require('../validation/validationUtils');

    exports.realizarPedido = async (data) => {
        const con = await getTransaction();
        try{
            const pago = crearPago(data.monto, data.fecha, data.metodo, data.estado);
            const cliente = crearCliente(data.nombre, data.ci);
            const pedido = crearPedido(data.fecha, data.total, data.idSucursal, data.idUsuario, data.estado, cliente, pago);
            data.productos.forEach((listaProductos,index) => {
                listaProductos.forEach(clave => {
                    crearDetalle(pedido, clave.idProducto, clave.cantidad, clave.precioUnitario, clave.subtotal)
                })
            })
            await con.commit();
            return {success: true, pedido}
        }catch(error){

        }finally{
            con.release();
        }
    }


    async function crearPago({monto, fecha, metodo, estado}, con){
        const data = {monto, fecha, metodo, estado
            }
        try {
            const pago = await pagoRepo.createPago(data, con);
            return pago;
        } catch (error) {
            throw new Error('ocurrio un error al crear el pago');
        }
    }
    async function crearCliente({nombre, ci}, con){
        const data = {
            nombre,
            ci
        }
        try {
            const cliente = await clienteRepo.createCliente(data, con);
            return cliente;
        } catch (error) {
            throw new Error('ocurrio un error al crear el cliente');
        }
    }
    async function crearPedido({fecha, total, idSucursal, idUsuario, estado, idCliente, idPago}, con){
        const data = {
            fecha, total, idSucursal, idUsuario, estado, idCliente, idPago
        }
        try{
            const pedido = await peidoRepo.createPedido(data, con);
            return pedido;
        }catch(error){
            throw new Error('ocurrio un error a crear el pedido');
        }
    }
    async function crearDetalle({idPedido, idProducto, cantidad, precioUnitario, subtotal}, con){
        const data = {
            idPedido, idProducto, cantidad, precioUnitario, subtotal
        }
        try {
            const detalle = await detallePedidoRepo.createDetallePedido(data, con);
            return detalle;
        } catch (error) {
            throw new Error('ocurrio un error al agregar el pedido');
        }
    }
