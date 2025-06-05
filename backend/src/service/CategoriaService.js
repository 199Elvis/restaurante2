const categoriaRepo = require('../repositories/CategoriaRepo');
const { soloTexto } = require('../validation/validationUtils');

exports.createCategoria = async (categoria) => {
    if (!soloTexto(categoria.nombre)) {
        throw new Error('El nombre debe contener solo letras y tener una longitud máxima de 15 caracteres');
    }
    if (!soloTexto(categoria.descripcion)) {
        throw new Error('La descripción debe contener solo letras y tener una longitud máxima de 50 caracteres');
    }
    
    const buscar = await categoriaRepo.searchCategoria(categoria.nombre);
    if (buscar.length > 0) {
        throw new Error('La categoría ya existe');
    }
    const new_categoria = await categoriaRepo.createCategoria(categoria);
    return new_categoria;
}

exports.getCategorias = async () => {
    const categorias = await categoriaRepo.getCategorias();
    return categorias;
}

exports.updateCategoria = async (categoria) => {
    if (!soloTexto(categoria.nombre) && categoria.nombre !== "") {
        throw new Error('El nombre debe contener solo letras y tener una longitud máxima de 15 caracteres');
    }
    if (!soloTexto(categoria.descripcion && categoria.descripcion !== "")) {
        throw new Error('La descripción debe contener solo letras y tener una longitud máxima de 50 caracteres');
    }

    const buscar = await categoriaRepo.searchCategoria(categoria.nombre);
    if (buscar.length === 0) {
        throw new Error('La categoría no existe');
    }
    if (buscar[0].nombre === categoria.nombre){
        categoria.nombre = '';
    }
    if(buscar[0].descripcion === categoria.descripcion){
        categoria.descripcion = '';
    }
    const id = categoria.idCategoria;
    for (const [clave, valor] of Object.entries(categoria)) {
        if (valor !== '') {
            await categoriaRepo.updateCategoria(valor, id, clave);
        }
    }
}