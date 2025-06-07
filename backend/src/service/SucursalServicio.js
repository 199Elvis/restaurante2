const sucursalRepo = require('../repositories/SucursalRepo');
const { soloTexto, numeros } = require('../validation/validationUtils');


exports.createSucursal = async (sucursal) => {
    if (!soloTexto(sucursal.nombre)) {
        throw new Error('El nombre debe contener solo letras y tener una longitud máxima de 15 caracteres');
    }
    if (!soloTexto(sucursal.direccion)) {
        throw new Error('La dirección debe contener solo letras y tener una longitud máxima de 50 caracteres');
    }
    if (!numeros(sucursal.telefono)) {
        throw new Error('El teléfono debe ser un número válido de hasta 10 dígitos');
    }
    console.log(sucursal);
    const buscar = await sucursalRepo.getSucursal();
    console.log(buscar);
    if (buscar.length > 0) {
        throw new Error('Ya existe una sucursal registrada');
    }
    
    const new_sucursal = await sucursalRepo.createSucursal(sucursal);
    return new_sucursal;
}

exports.getSucursal = async () => {
    const sucursal = await sucursalRepo.getSucursal();
    if (sucursal.length === 0) {
        throw new Error('No hay sucursal registrada');
    }
    return sucursal;
}

exports.updateSucursal = async (sucursal) => {
    if (!soloTexto(sucursal.nombre) && sucursal.nombre !== "") {
        throw new Error('El nombre debe contener solo letras y tener una longitud máxima de 15 caracteres');
    }
    if (!soloTexto(sucursal.direccion) && sucursal.direccion !== "") {
        throw new Error('La dirección debe contener solo letras y tener una longitud máxima de 50 caracteres');
    }
    if (!numeros(sucursal.telefono) && sucursal.telefono !== "") {
        throw new Error('El teléfono debe ser un número válido de hasta 10 dígitos');
    }

    const buscar = await sucursalRepo.getSucursal();
    if (buscar.length === 0) {
        throw new Error('No hay sucursal registrada');
    }

    const id = buscar[0].idSucursal;
    for (const [clave, valor] of Object.entries(sucursal)) {
        if (valor !== '') {
            await sucursalRepo.updateSucursal(clave, valor, id);
        }
    }
}