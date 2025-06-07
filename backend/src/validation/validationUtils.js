const e = require("express");

function cadenas(texto){
    const nameRegex = /^[a-z]{1,15}$/;
    texto = texto.trim().toLowerCase();
    return nameRegex.test(texto.replace(/[áäàÁÄÀ]/g, "a")
                        .replace(/[éëèÉËÈ]/g, "e")
                        .replace(/[íïìÍÏÌ]/g, "i")
                        .replace(/[óöòÓÖÒ]/g, "o")
                        .replace(/[úüùÚÜÙ]/g, "u")
                    );
}
function soloTexto(texto) {
    // 1. Verificar si 'texto' es una cadena válida
    if (typeof texto !== 'string' || texto.trim() === '') {
        return false; // Si no es una cadena o está vacía, no es "solo texto"
    }

    // 2. Normalizar el texto (quitar tildes y ñ si el regex no las soporta)
    //    Tu regex actual /^[a-zA-Z\s]/ solo permite la primera letra ser alfanumérica o espacio.
    //    Si quieres que todo el texto sea alfanumérico y espacios, el regex es diferente.

    // Si tu intención es permitir tildes y 'ñ' en el texto final, NO DEBES hacer los .replace().
    // La expresión regular debería manejarlas.

    // Opción A: Si quieres que el texto NO tenga tildes ni 'ñ' (y las quitas):
    let textoNormalizado = texto
        .replace(/[áäàÁÄÀ]/g, "a")
        .replace(/[éëèÉËÈ]/g, "e")
        .replace(/[íïìÍÏÌ]/g, "i")
        .replace(/[óöòÓÖÒ]/g, "o")
        .replace(/[úüùÚÜÙ]/g, "u")
        .replace(/[ñÑ]/g, "n"); // Añadir manejo de ñ si también lo quieres reemplazar

    // 3. Validar el texto normalizado con la expresión regular
    //    El regex /^[a-zA-Z\s]/ solo valida el PRIMER carácter.
    //    Si quieres validar que TODA la cadena solo contenga letras y espacios, necesitas /^[a-zA-Z\s]+$/
    //    Si además quieres permitir tildes y ñ (sin reemplazarlas), el regex sería: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/

    // Versión mejorada de regex para que toda la cadena sea letras, tildes, ñ y espacios:
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // Si tu intención es que el regex /^[a-zA-Z\s]+$/ valide después de quitar tildes/ñ
    return nameRegex.test(textoNormalizado);

    // Si tu intención original con el regex /^[a-zA-Z\s]/ era solo validar el primer caracter,
    // es un regex muy débil para "soloTexto". Lo más común es validar toda la cadena.
    // Si realmente solo quieres validar el primer carácter y luego quitar tildes/ñ:
    // return /^[a-zA-Z\s]/.test(textoNormalizado); // Pero esto es un caso de uso muy específico.
}
function correo(direccion){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(direccion);
}
function numeros(num){
    const numRegex = /^[0-9]{1,10}$/;
    return numRegex.test(num);
}
function contrasenia(texto){
    const contraRegex = /^[a-zA-Z0-9_-]/;
    return contraRegex.test(texto) && texto.length > 7;
}
function fechas(fecha){
    const regexDDMMYYYY = /^\d{2}-\d{2}-\d{4}$/;
    return regexDDMMYYYY.test(fecha);
}

module.exports = {
    cadenas,
    correo,
    numeros,
    contrasenia,
    fechas,
    soloTexto
}