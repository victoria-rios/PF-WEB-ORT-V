
/*----------------------Declaracion Variables/Archivos-------------------------*/


const User = require('../../models/User');
const Dni = require('../../models/Dni');
const Especialidad = require('../../models/Especialidad');
const ConsultaGrupo = require('../../models/ConsultaGrupo');
const Documento = require('../../models/Document');
const Consulta = require('../../models/Consulta');
const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const secret = require('../../config/secret');
const verifyToken = require('./verifyToken');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const mongoURI = require('../../config/keys').MongoURI;
const mongoose =  require('mongoose');
const Grid = require('gridfs-stream');
var fs = require('fs');

/*----------------------GFS Config-------------------------*/


// connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

//Objeto Storage Manipulacion De Subida Del File
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
    });
  }
});
//Middleware Multipart/Upload
const upload = multer({ storage });

/*----------------------API GET Methods-------------------------*/

/*Download Archivo*/
app.get("/api/file/:filename", (req, res) => {

    gfs.find({
        filename: req.params.filename
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist"
          });
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(fs.createWriteStream('./'+req.params.filename)).
        on('error', function(error) {
          assert.ifError(error);
        }).
        on('finish', function() {
          console.log('done!');
          process.exit(0);
        });
      });
});

/*List Especialidades*/ 
app.get("/api/list/especialidades", (req,res) => {
    
    Especialidad.find({}, function(err, especialidades) {
        res.json(especialidades); 
        console.log(res); 
      });
   
});

/* Traer un User a partir de un ID */
app.get("/api/user/:id", function (req,res) {

    //const { body } = req;
    //const { id } = body;
  
    User.findById(req.params.id)
      //  .select("documents")
        .exec(function(err,file){
            if(!file){
                return res.status(404).end();
            }else{
                return res.status(200).json(file);
            }
        })
});

//SIN exponerlo en la URL :
/* const { body } = req;

    const { id, tomo, folio, colegio, especialidad, firmaDigital, cv} = body;

    await User.find({_id: id}, (err, user) => {
        if(err){
                return res.json({
                success:false,
                message: 'Error al encontrar ID'
         });
        }   */



/* Traer los documents a partir de un ID */
app.get("/api/listFiles/:id", function (req,res) {
    
    User.findById(req.params.id)
    .populate('documents')
    .exec(function(err,file){
        if(!file){
            return res.status(404).end();
        }else{
            return res.status(200).json(file);
        }
    })


});
    

/*----------------------API POST Methods-------------------------*/


/*Registrar Cliente JWT*/
app.post('/api/signup', async (req,res,next) => {
    
    /*Recibo parametros del body html*/ 
    const { body } = req;

    const {nombre,apellido,password,tipo,dni_,partido,zona} = body;

    /*no es const ya que lo modifico con toLowerCase*/
    let { email } = body;

    /*siempre hacerle lower*/
    /*email = email.toLowerCase();*/

    /*Validar entradas*/
    if(!nombre){
        return res.send({
            success:false,
            message: 'Nombre Sin Datos/Error'
     });
    }
    if(!apellido){
        return res.send({
            success:false,
            message: 'Apellido Sin Datos/Error'
     });
    }
    if(!email){
        return res.send({
            success:false,
            message: 'Email Sin Datos/Error'
     });
    }
    if(!password){
        return res.send({
            success:false,
            message: 'Password Sin Datos/Error'
     });
    }
    if(!tipo){
        return res.send({
            success:false,
            message: 'Sin Tipo'
     });
    }
    /*if(!dni_){
        return res.send({
            success:false,
            message: 'Sin D.N.I'
     });
    }*/

    /*OJO VALIDAR ENTRADA DE OTROS DATOS*/ 
    /*Busco que el user no este repetido*/    
    await User.find({email: email.toLowerCase()}, (err, searchrepeat) => {
        if(err){
                res.send({
                success:false,
                message: 'Error Finding User'
         });
        } else if (searchrepeat.length > 0){
                res.send({
                success:false,
                message: 'Cuenta Existente'
         });
        } 
    });

    const _dni = new Dni();
    _dni.nrodni = dni_;
    _dni.save((err) => {
        if(err){
                res.send({
                success:false,
                message: 'Objeto DNI Error'
            });
        }
    });
     
    /*Creo un usuario de entrada*/

    const user = new User({   
        nombre : nombre,
        apellido : apellido,
        password : password,
        email : email,
        tipo : tipo,
        dni : _dni._id,
        partido : partido ,
        zona: zona
    });

    /*setDefaultsOnInsert Upsert Reemplazar esta logica
    no debe estar atado al endpoint*/
    
    /*if(tipo === 'A'){}          Crear EndPoint*/ 
  
    user.password = user.generateHash(password);
    //No esta funcionando el metodo desde el schema.
    user.email = user.emailCase(email);
    user.save((err) => {
        if(err){
                res.send({
                success:false,
                message: 'Error Saving'
            });
        }

    });

     res.json({message: 'Registro Exitoso'});

    /*const token = jwt.sign({id : user._id},secret.secret, {
        expiresIn: 60 * 60 * 24 
    });
    res.json({auth: true, token});*/


});

/*Verificar JWT Front-End, se envia token*/
app.get('/api/verify', verifyToken, async (req,res,next) => {

    /*Verifico que exista el token , que no esté caducado*/
    /*Le pasamos el token del User y el SECRET de la app*/

    const user = await User.findById(req.usuarioId,{ password: 0 });
    if(!user){
        return res.status(401).send('Usuario No Encontrado')
    }

    res.json(user);

});

/*Logiar Cliente JWT*/
app.post('/api/signin', async (req,res,next) => {
    
    /*Consumo Body HTML*/ 
    const{ body } = req;
        
    const { password } = body;
    
    /*No es una const*/
    let{ email } = body;

    /*Validaciones*/
    if(!email){
        return res.send({
            success:false,
            message: 'Email Vacio'
     });
    }
    if(!password){
        return res.send({
            success:false,
            message: 'Password Vacio'
     });
    }

    /*LowerCase Mail*/
    email = email.toLowerCase();

    /*Si existe error de Headers quitar returns*/

    await User.find({email: email},(err,user) =>{
        if(err){
            return res.send({
                success:false,
                message: 'Error Servidor'
            });
        }
        if(user.length != 1){
            return res.send({
                success:false,
                message: 'Datos Erroneos Mail Inexistente'
            });
        }
        
        const user_ = user[0];
        if(!user_.validPassword(password)){
            return res.send({
                auth:false,
                token: null,
                message: 'Contraseña/Mail Incorrectos'
            });
        }

        const token = jwt.sign({id: user._id}, secret.secret,{
            expiresIn: 60 * 60* 24
        });
        
        res.json({auth:true,token});

    });
});

/*Upload Archivos a la BD MongoDB*/
app.post('/api/upload',upload.single('file'), async (req,res) => {

    const { body } = req;

    const { id } = body;

    /*const documento = new Documento();
    documento.id_upload = req.file.id;
    console.log(documento);
    documento.save((err) => {
        if(err){
                res.send({ 
                success:false,
                message: 'Error'
            });
        }
    });*/

    User.findOneAndUpdate({_id: id},
        { $push: { documents: req.file.id  } }
        , function (err, user) {
        if(err){
            res.send({
            success:false,
            message: 'Error' 
            }); 
        }
    });

    res.json("Archivo Subido");

    /*
    El error de headers es porque hay dos res y se cumplen las dos
    entonces la respuesta tiene doble encabezado y no sabe que hacer y rompe
    https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
    
    */

});
    
/*Trae todos los abogados*/
app.post('/api/crearconsulta', async (req,res,next) => { 
    
    const { body } = req;

    const { iduser, idabogado, cons } = body;

    const consulta = new Consulta();

    consulta.texto = cons;   

    consulta.save();

    const consultaGrupo = new ConsultaGrupo();

    consultaGrupo.motivo = id;

    consultaGrupo.textoConsulta = consulta._id;
    
    consultaGrupo.save();

    res.json('Agregado');

});


app.post('/api/consulta', async (req,res,next) => { 
    
    const { body } = req;

    const { id, consulta } = body;

    /*const consulta = new Consulta();
    consulta.texto = cons;   
    consulta.save();*/

});

app.post('/api/terminaregistro' ,async (req,res,next) => {

    const { body } = req;

    const { id, tomo, folio, colegio, especialidad, firmaDigital, cv} = body;

    await User.find({_id: id}, (err, user) => {
        if(err){
                return res.json({
                success:false,
                message: 'Error al encontrar ID'
         });
        } 

    
    if(user.tipo == 'A'){
        if(user.tomo == '' || user.folio == '' || user.colegio == '' || user.especialidad == ''){
            return res.json('Datos Incompletos');
        }
    }


    User.findOneAndUpdate({_id: id},
        { $set: { 
            matricula: {
            
            tomo : tomo,
            folio : folio,
            colegio : colegio
            
        },

        especialidad : especialidad,
        firmaDigital : firmaDigital,
        cv: cv
        
        } }
        , function (err, user) {
        if(err){
            return res.json({
            success:false,
            message: 'Error' 
            }); 
        }else{
            return res.json("Completado Exitosamente");
        }
    }); //OJO esto devuelve Completado Exitosamente aunque el registro no exista!!!!!!

   
    

});

    
});

/*Export obligatorio del file Methods.Js*/
module.exports = app;