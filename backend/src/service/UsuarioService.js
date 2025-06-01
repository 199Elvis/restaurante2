//2
//validaciones
//hashear contrasenia

const userRepo = require('../repositories/UsuarioRepo');
const { hashPassword } = require('../utils/passwordHash');
const { cadenas, correo, numeros, contrasenia, fechas } = require('../validation/validationUtils');


exports.createUsuario = async (usuario) => {
    if(!cadenas(usuario.nombre)) {
        throw new Error('El nombre debe contener solo letras y tener una longitud máxima de 15 caracteres');
    }
    if(!numeros(usuario.ci)) {
        throw new Error('El CI debe contener solo números y tener una longitud máxima de 10 caracteres');
    }
    if(!cadenas(usuario.cargo)) {
        throw new Error('El cargo debe contener solo letras y tener una longitud máxima de 15 caracteres');
    }
    if(!correo(usuario.email)) {
        throw new Error('El email no es válido');
    }
    if(!contrasenia(usuario.password)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres y contener letras, números, guiones bajos o guiones');
    }
    const buscar = await userRepo.buscarUsuario(usuario.ci, usuario.email);
    if (buscar.length > 0) {
        throw new Error('El usuario ya existe');
    }
    const passwordHashed = await hashPassword(usuario.password);
    usuario.password = passwordHashed;
    const new_user = await userRepo.createUsuario(usuario);
    return new_user;
}


exports.getUsuarios = async () => {
    const usuarios = await userRepo.getUsuarios();
    return usuarios;
}

exports.updateUser = async (ci, dato) => {
    if(!cadenas(dato.nombre)) {
        throw new Error('El nombre debe contener solo letras y tener una longitud máxima de 15 caracteres');
    }
    if(!cadenas(dato.cargo)) {
        throw new Error('El cargo debe contener solo letras y tener una longitud máxima de 15 caracteres');
    }
    if(!correo(dato.email)) {
        throw new Error('El email no es válido');
    }
    const usuario = await userRepo.getUsuarioCi(ci);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    const nombre = usuario.nombre == dato.nombre ? '' : dato.nombre;
    const cargo = usuario.cargo == dato.cargo ? '' : dato.cargo;
    const email = usuario.email == dato.email ? '' : dato.email;
    const data = {
        nombre: nombre,
        cargo: cargo,
        email: email
    }
    for (const [clave, valor] of Object.entries(data)) {
        if (valor !== '') {
            await userRepo.updateUsuario(ci, clave, valor);
        }
    }
}
exports.deleteUsuario = async (ciAdmin, ciEliminar) => {
    if(ciAdmin === ciEliminar){
        throw new Error('No se puede eliminar el usuario que está realizando la acción');
    }

    const user_admin = await userRepo.getUsuarioCi(ciAdmin);
    const admin = user_admin[0];
    if(admin.cargo != 'administrador'){
        throw new Error('El usuario que realiza la acción no es un administrador');
    }
    const user_eliminar = await userRepo.getUsuarioCi(ciEliminar);
    if(admin.cargo === user_eliminar[0].cargo){
        throw new Error('No se puede eliminar un usuario con el mismo cargo que el administrador');
    }
    await userRepo.deleteUser(user_eliminar[0].ci);
}