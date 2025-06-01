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
function soloTexto(texto){
    const nameRegex = /^[a-zA-Z\s]/;
    return nameRegex.test(texto.replace(/[áäàÁÄÀ]/g, "a")
                        .replace(/[éëèÉËÈ]/g, "e")
                        .replace(/[íïìÍÏÌ]/g, "i")
                        .replace(/[óöòÓÖÒ]/g, "o")
                        .replace(/[úüùÚÜÙ]/g, "u")
                    );
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