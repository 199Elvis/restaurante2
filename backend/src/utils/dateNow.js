function fechaActual (){
    const fecha = new Date();
    // No necesitas options ni toLocaleDateString si vas a construir la cadena manualmente
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses son 0-11
    const day = String(fecha.getDate()).padStart(2, '0');

    // Devuelve el formato 'YYYY-MM-DD'
    return `${year}-${month}-${day}`; 
}

module.exports = fechaActual;