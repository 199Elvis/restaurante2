const userRepo = require('../repositories/CategoriaRepo');
const { soloTexto } = require('../validation/validationUtils');

exports.createCategoria = async (categoria) => {
    if (!soloTexto(categoria.nombre)) {
        throw new Error('El nombre debe contener solo letras y tener una longitud máxima de 15 caracteres');
    }
    if (!soloTexto(categoria.descripcion)) {
        throw new Error('La descripción debe contener solo letras y tener una longitud máxima de 50 caracteres');
    }
    
    const buscar = await userRepo.searchCategoria(categoria.nombre);
    if (buscar.length > 0) {
        throw new Error('La categoría ya existe');
    }
    const new_categoria = await userRepo.createCategoria(categoria);
    return new_categoria;
}