var firebase = require('../firebase');

var controller = {

    addCase: async function(req, res){

        var persona = {
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

        var day = `${persona.FechaReporte.getDate()}-${(persona.FechaReporte.getMonth() +1)}-${persona.FechaReporte.getFullYear()}`;
        var month = `${(persona.FechaReporte.getMonth() +1)}-${persona.FechaReporte.getFullYear()}`;
        var year = `${persona.FechaReporte.getFullYear()}`;

        try {
            const batch = firebase.db.batch();
            const increment = firebase.firestore.FieldValue.increment(1);

            var personaRef = await firebase.db.collection('Persona').doc();
            var provinciaRef = await firebase.db.collection('Estadisticas').doc('Provincias');
            var municipioRef = await firebase.db.collection('Estadisticas').doc('Municipios');
            var sexoRef = await firebase.db.collection('Estadisticas').doc('Sexo');
            var edadRef = await firebase.db.collection('Estadisticas').doc('Edad');
            var totalRef = await firebase.db.collection('Estadisticas').doc('Total');
            var dayRef = await firebase.db.collection('Estadisticas').doc(day);
            var monthRef = await firebase.db.collection('Estadisticas').doc(month);
            var yearRef = await firebase.db.collection('Estadisticas').doc(year);

            var doc = await dayRef.get();
            if(!doc.exists){
                batch.set(dayRef , {Femenino: 0, Masculino: 0}, {merge: true});
            }

            doc = await monthRef.get();
            if(!doc.exists){
                batch.set(monthRef , {Femenino: 0, Masculino: 0}, {merge: true});
            }

            doc= await yearRef.get();
            if(!doc.exists){
                batch.set(yearRef , {Femenino: 0, Masculino: 0}, {merge: true});
            }

            var edad ="";

            if(persona.Edad <= 12 ){
                edad ="0-12";

            }else if(persona.Edad <= 17){
                edad ="13-17";

            }else if(persona.Edad <= 30){
                edad ="18-30";

            }else if(persona.Edad <= 45){
                edad ="31-45";

            }else if(persona.Edad <= 60){
                edad ="46-60";

            }else{
                edad ="+60";
            }


            batch.set(personaRef , persona);
            batch.set(provinciaRef , {[persona.Provincia]: increment}, {merge: true});
            batch.set(municipioRef , {[persona.Municipio]: increment}, {merge: true});
            batch.set(sexoRef , {[persona.Sexo]: increment}, {merge: true});
            batch.set(edadRef , {[edad]: increment}, {merge: true});
            batch.set(totalRef , {Counter: increment}, {merge: true});
            batch.set(dayRef , {[persona.Sexo]: increment}, {merge: true});
            batch.set(monthRef , {[persona.Sexo]: increment}, {merge: true});
            batch.set(yearRef , {[persona.Sexo]: increment}, {merge: true});

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

    getStadistics: async function(req, res){

        var provinciasTop = [{provincia: "", count:-1},{provincia: "", count:-1},
        {provincia: "", count:-1},{provincia: "", count:-1},{provincia: "", count:-1}];

        var municipiosTop = [{municipio: "", count:-1},{municipio: "", count:-1},
        {municipio: "", count:-1},{municipio: "", count:-1},{municipio: "", count:-1}];

        var sexoVsTiempo = [];

        
        try {
            
            var provincias = await firebase.db.collection('Estadisticas').doc('Provincias').get();
            var municipios = await firebase.db.collection('Estadisticas').doc('Municipios').get()
            var edades = await firebase.db.collection('Estadisticas').doc('Edad').get();
            var sexo2 = await firebase.db.collection('Estadisticas').doc('Sexo').get();
            var sexo;

            //sexo vs timpo
            var date = new Date();
            date.setDate(date.getDate() - 1);
            var day = `${date.getDate()}-${(date.getMonth() +1)}-${date.getFullYear()}`;
            counter = 0;
            
            sexo = await firebase.db.collection('Estadisticas').doc(day).get();

            while(counter < 12 && sexo.exists){
                sexoVsTiempo.push({date: day, Femenino: sexo.data().Femenino, Masculino: sexo.data().Masculino});
                
                date.setDate(date.getDate() - 1);
                var day = `${date.getDate()}-${(date.getMonth() +1)}-${date.getFullYear()}`;
                counter++;

                sexo = await firebase.db.collection('Estadisticas').doc(day).get();

            }
    
            //top provincias
            for(const prop in provincias.data()){
    
                if(provincias.data()[prop] > provinciasTop[0]["count"]){
                    provinciasTop[4] = provinciasTop[3];
                    provinciasTop[3] = provinciasTop[2];
                    provinciasTop[2] = provinciasTop[1];
                    provinciasTop[1] = provinciasTop[0];
                    provinciasTop[0] = {provincia: prop, count: provincias.data()[prop]};
    
                }else if(provincias.data()[prop] > provinciasTop[1]["count"]){
                    provinciasTop[4] = provinciasTop[3];
                    provinciasTop[3] = provinciasTop[2];
                    provinciasTop[2] = provinciasTop[1];
                    provinciasTop[1] = {provincia: prop, count: provincias.data()[prop]};
    
                }else if(provincias.data()[prop] > provinciasTop[2]["count"]){
                    provinciasTop[4] = provinciasTop[3];
                    provinciasTop[3] = provinciasTop[2];
                    provinciasTop[2] = {provincia: prop, count: provincias.data()[prop]};
    
                }else if(provincias.data()[prop] > provinciasTop[3]["count"]){
                    provinciasTop[4] = provinciasTop[3];
                    provinciasTop[3] = {provincia: prop, count: provincias.data()[prop]};
    
                }else if(provincias.data()[prop] > provinciasTop[4]["count"]){
                    provinciasTop[4] = {provincia: prop, count: provincias.data()[prop]};
                }
            }
    
            //top municipios
            for(const prop in municipios.data()){
    
                if(municipios.data()[prop] > municipiosTop[0]["count"]){
                    municipiosTop[4] = municipiosTop[3];
                    municipiosTop[3] = municipiosTop[2];
                    municipiosTop[2] = municipiosTop[1];
                    municipiosTop[1] = municipiosTop[0];
                    municipiosTop[0] = {municipio: prop, count: municipios.data()[prop]};
    
                }else if(municipios.data()[prop] > municipiosTop[1]["count"]){
                    municipiosTop[4] = municipiosTop[3];
                    municipiosTop[3] = municipiosTop[2];
                    municipiosTop[2] = municipiosTop[1];
                    municipiosTop[1] = {municipio: prop, count: municipios.data()[prop]};
    
                }else if(municipios.data()[prop] > municipiosTop[2]["count"]){
                    municipiosTop[4] = municipiosTop[3];
                    municipiosTop[3] = municipiosTop[2];
                    municipiosTop[2] = {municipio: prop, count: municipios.data()[prop]};
    
                }else if(municipios.data()[prop] > municipiosTop[3]["count"]){
                    municipiosTop[4] = municipiosTop[3];
                    municipiosTop[3] = {municipio: prop, count: municipios.data()[prop]};
    
                }else if(municipios.data()[prop] > municipiosTop[4]["count"]){
                    municipiosTop[4] = {municipio: prop, count: municipios.data()[prop]};
                }
            }
    
            return res.status(200).send({
                ok: true,
                provinciasTop: provinciasTop,
                municipiosTop: municipiosTop,
                edades: edades.data(),
                sexoVsTiempo: sexoVsTiempo,
                sexo: sexo2.data()
            });

        } catch (error) {
             return res.status(200).send({
                        ok: false,
                        mesage: error
                    });
        }


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

    getTableInfo: async function(req, res){
        
        var info = [];

        try {
            var snapshot = await firebase.db.collection('Persona').orderBy('FechaReporte', 'desc').limit(500).get();

            snapshot.forEach(doc =>{
                info.push({
                    Cedula: doc.data().Cedula,
                    Nombre:doc.data().Nombre,
                    Edad: doc.data().Edad,
                    FechaInicioSintoma: doc.data().FechaInicioSintoma.toDate(),
                    FechaReporte: doc.data().FechaReporte.toDate()
                });
            })

            return res.status(200).json({
                ok: true,
                info: info
            });

        } catch (error) {
            return res.status(200).send({
                ok:false, 
                mesage: error
            });
        }
        
    },

    filterTable:async function(req, res){
        var info = [];

        try {
            var snapshot = await firebase.db.collection('Persona').orderBy("Cedula").limit(500)
            .startAt(req.query.Cedula).endAt(req.query.Cedula+'\uf8ff').get();
                
            snapshot.forEach(doc =>{
                info.push({
                    Cedula: doc.data().Cedula,
                    Nombre:doc.data().Nombre,
                    Edad: doc.data().Edad,
                    FechaInicioSintoma: doc.data().FechaInicioSintoma.toDate(),
                    FechaReporte: doc.data().FechaReporte.toDate()
                });
            })
    
            return res.status(200).json({
                ok: true,
                info: info
            })
            
        } catch (error) {
             return res.status(200).send({
                ok:false, 
                mesage: error
            });
        }
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

