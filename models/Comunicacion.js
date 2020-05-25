const mongoose = require('mongoose');

const ComunicacionSchema = new mongoose.Schema({    
    motivo: String,  
    textoConsulta : { type: mongoose.Schema.Types.ObjectId, ref: 'Mensaje' },
    id_shared : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Comunicacion', ComunicacionSchema);
