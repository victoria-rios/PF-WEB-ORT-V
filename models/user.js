const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var GFS = mongoose.model("GFS", new mongoose.Schema({}, {strict: false}), "uploads.files" );

const UserSchema = new mongoose.Schema({
    
    //Tipo Usuario A-C
    tipo:{
        type: String,
        required: true
    },
    //Nombre String
    nombre:{
        type: String,
        required: true
    },
    //Apellido String
    apellido:{
        type: String,
        required: true
    },
    //Lower Mail Desde Metodo En La BD.
    email:{
        type: String,
        required: true
    },
    //Automaticamente Hasheado por BCrypt
    password:{
        type: String,
        required: true
    },
    //Dato Necesario Para Filtros A/C
    zona:{
       type: String,
       require: true
    },
    //Dato Necesario Para Filtros A/C
    partido:{
       type: String,
       require: false //True
    },
    //Despues Del Register A/C
    /*codpos:{
       type: String,
       require: false
    },
    //Despues Del Register
    direccion:{
       type: String,
       require: false
    },
    //Despues Del Register
    tel:{
        type: String,
       require: false
    },
    //Despues Del Register
    nacionalidad:{
       type: String,
       require: false
    },*/
    //Validar DNI
    dni:{
        type: mongoose.Schema.Types.ObjectId, ref: 'DNI'
    },
    //Verificamos uso
    /*avatar:{
        type: String, 
        require: false  
    },*/
    //Documentos Encriptados
    documents:
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'GFS' }],
        /*[{
            type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' 
        }],*/
        require: false
        /*[{ type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' }],*/
    ,
    //Array de consultas
    comunicacion:
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comunicacion' }],
        require: false
    ,
    //Dato Adicional (Modificable)
    arancel:{
       type: String,
       require: false
    },
    //JSON dentro de matricula
    matricula: { 
       tomo : String,
       folio : String,
       colegio: String
    }, 
    //Array de Especialidades
    especialidad:{
        type:String
    },
    //Notas CV
    cv:{
       type: String,
       require: false
    },

    //Posee Firma Digital
    firmaDigital:{
        type: Boolean,
        require: false
     },

    //Dia de Creacion Usuario
    dateCreate:{
        timestamp: { type: Date, default: Date.now},
        require: false
    },  
    //Inactivo o Activo
    isDeleted:{ 
        type: Boolean,
        require: false
    },
    //Valida Si Confirma Mail
    validadoMail:{
       type: Boolean,
       require: false
    },
    //Tipo de Estado Del Usuario
    estado:{
       type: String,
       require: false
    }
    
});

UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

UserSchema.methods.emailCase = function(email){
    return email.toLowerCase(email);
}

module.exports = mongoose.model('user',UserSchema);