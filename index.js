//'use strict'

var app = require('./app');
var PORT = process.env.PORT || 3700;

app.listen(PORT, ()=>{
    console.log("Servidor en localhost:3700");
});

