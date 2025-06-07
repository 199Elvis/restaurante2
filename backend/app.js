const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');


dotenv.config({
    path: path.resolve(__dirname, '/.env')
});

const db = require('./config/database');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usuarioRoute = require('./src/routes/UsuarioRoute');
const categoriaRoute = require('./src/routes/CategoriaRoute');
const productoRoute = require('./src/routes/ProductoRoute');
const sucursalRoute = require('./src/routes/SucursalRoute');

app.use('/api/usuario', usuarioRoute);
app.use('/api/categoria', categoriaRoute);
app.use('/api/producto', productoRoute);
app.use('/api/sucursal', sucursalRoute);


app.listen(process.env.PORT, () => {
    console.log(`htt://localhost:${process.env.PORT}`);
});