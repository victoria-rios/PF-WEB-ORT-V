
const mongoose = require('mongoose');

const ConsultaGrupoSchema = new mongoose.Schema({    
    motivo: String,  
    textoConsulta : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consulta' }]
    /*,
    id_shared : { type: mongoose.Schema.Types.ObjectId, ref: '' },*/
});

module.exports = mongoose.model('ConsultaGrupo', ConsultaGrupoSchema);