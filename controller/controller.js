var firebase = require('../firebase');

var controller = {

    addCase: async function(req, res){

        var data = {
            Nombre : req.body.Nombre,
            Sexo: req.body.Sexo,
            Provincia: req.body.Provincia,
            Municipio: req.body.Municipio,
            Edad: req.body.Edad,
            Cedula: req.body.Cedula,
            Telefono: req.body.Telefono,
            CantidadVivencia: req.body.CantidadVivencia,
            FechaReporte: new Date(),
            FechaInicioSintoma: new Date(req.body.FechaInicioSintoma),
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

        try {
            const batch = firebase.db.batch();
            const increment = firebase.firestore.FieldValue.increment(1);

            var personaRef = await firebase.db.collection('Persona').doc();
            var provinciaRef = await firebase.db.collection('Estadisticas').doc('Provincias');
            var municipioRef = await firebase.db.collection('Estadisticas').doc('Municipios');
            var sexoRef = await firebase.db.collection('Estadisticas').doc('Sexo');
            var totalRef = await firebase.db.collection('Estadisticas').doc('Total');

            batch.set(personaRef , data);
            batch.set(provinciaRef , {[data.Provincia]: increment}, {merge: true});
            batch.set(municipioRef , {[data.Municipio]: increment}, {merge: true});
            batch.set(sexoRef , {[data.Sexo]: increment}, {merge: true});
            batch.set(totalRef , {Counter: increment}, {merge: true});
            await batch.commit();

            return res.status(200).send({
                ok: true
            });
            
        } catch (error) {
            return res.status(200).send({
                ok:false, 
                mesage: error
            });
            
        }


    },

    getStadistics: function(req, res){

       
    },

    addAdmin: async function(req, res){
        var admin = {
            Nombre: req.body.Nombre,
            Apellido: req.body.Apellido,
            Telefono: req.body.Telefono,
            Cedula: req.body.Cedula,
            FechaNacimiento: new Date(req.body.FechaNacimiento),
            TipoAdmin: req.body.TipoAdmin,
        };

        try {
            var result = await firebase.auth.createUserWithEmailAndPassword(req.body.Usuario, req.body.Password);
            firebase.db.collection('Admin').doc(result.user.uid).set({admin});
            return res.status(200).send({
                ok: true
            });
            
        } catch (error) {
            return res.status(200).send({
                        ok: false,
                        mesage: error
                    });
        }

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

