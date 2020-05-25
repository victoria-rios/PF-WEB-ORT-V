const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({   
    filename: String,  
    id_upload :  { type: mongoose.Schema.Types.ObjectId },
    id_shared :  { type: mongoose.Schema.Types.ObjectId },
    id_consulta : { type: mongoose.Schema.Types.ObjectId, ref: 'Comunicacion' }
    //Se puede hacer array para compartir con varios
});

module.exports = mongoose.model('Documento', DocumentSchema);
