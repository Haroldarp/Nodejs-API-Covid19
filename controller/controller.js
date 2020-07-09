var firebase = require('../firebase');

var controller = {

    addCase: function(req, res){

        var data = {
            Nombre : req.body.Nombre,
            Sexo: req.body.Sexo,
            Provincia: req.body.Provincia,
            Sector: req.body.Sector,
            Edad: req.body.Edad,
            Cedula: req.body.Cedula,
            Telefono: req.body.Telefono,
            CantidadVivencia: req.body.CantidadVivencia,
            FechaReporte: new Date(),
            FechaInicioSintoma: req.body.FechaInicioSintoma,
            Problemas: {
                Cardiovascular: req.body.Problemas.Cardiovascular,
                Diabetes: req.body.Problemas.Diabetes,
                Respiratorios: req.body.Problemas.Respiratorios
            },
            Sintomas: {
                Tos: req.body.Sintomas.Tos,
                Fiebre: req.body.Sintomas.Fiebre,
                Cansancio: req.body.Sintomas.Cansancio,
                DolorCabeza: req.body.Sintomas.DolorCabeza
            }
        };

        firebase.db.collection('Persona').doc().set(
            data
        ).then(()=>{
            return res.status(200).send({
                ok: true
            });
        }).catch((err)=>{
            return res.status(200).send({
                ok:false, 
                mesage: err
            });
        });
    },

    getStadistics: function(req, res){

        var docs = [];

        firebase.db.collection('Persona').get()
        .then((allDocs)=>{

            allDocs.forEach((doc) =>{
                docs.push(doc.data()['Sector']);
            });

            return res.status(200).json(docs);

        }).catch((err)=>{
            return res.status(200).send({
                mesage: err
            });
        });
    },

    addAdmin: function(req, res){

    },

    getInfo: function(req, res){
        firebase.db.collection('Info').doc(req.query.Info).get()
            .then( doc =>{
                return res.status(200).json({
                    ok: true,
                    Descripcion: doc.data().Descripcion
                });
            }

            ).catch(erro =>{
                return res.status(200).send({
                    ok:false, 
                    mesage: err
                });
            });
    },

    changeInfo: function(req, res){
       
        firebase.db.collection('Info').doc(req.body.Info).update({Descripcion: req.body.Descripcion})
            .then( doc =>{
                return res.status(200).json({
                    ok: true
                });
            }

            ).catch(erro =>{
                return res.status(200).send({
                    ok:false, 
                    mesage: err
                });
            });
    }

};

module.exports = controller;

