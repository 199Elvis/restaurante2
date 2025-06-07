const pagoService = require('../service/PagoService');

exports.realizarPago = async (req, res) => {
    try{
        const {idUsuario, idSucursal} = req.params;
        const {metodo, monto, nombre, ci, total, estadoP, estadoPe, listProducto} = req.body;
        const data = {
            idSucursal, idUsuario, metodo, monto, nombre, ci, total, estadoP, estadoPe, listProducto
        }
        const pago = await pagoService.realizarPago(data);
        res.status(200).json(pago);
    }catch(error){
        res.status(500).json(error);
    }
}


