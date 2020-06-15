//'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var projectRoutes = require('./routes/routes');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//rutas
app.use('/Api',projectRoutes);


module.exports = app;
