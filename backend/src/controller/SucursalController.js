const sucursalService = require('../service/SucursalServicio');


exports.createSucursal = async (req, res) => {
    try {
        const {nombre, direccion, telefono} = req.body;
        const data = {
            nombre,
            direccion,
            telefono
        }
        const sucursal = await sucursalService.createSucursal(data);
        res.status(200).json(sucursal); 
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.getSucursal = async (req, res) => {
    try {
        const sucursal = await sucursalService.getSucursal();
        res.status(200).json(sucursal);
    } catch (error) {
        res.status(500).json("ocurrio un error");
    }
}

exports.updateSucursal = async (req, res) => {
    try {
        const {nombre, descripcion, telefono} = req.body;
        const data = {
            nombre,
            descripcion,
            telefono
        }
        const sucursal = await sucursalService.updateSucursal(data);
        res.status(200).json(sucursal)
    } catch (error) {
        res.status(500).json('ocurrio un error');
    }
}