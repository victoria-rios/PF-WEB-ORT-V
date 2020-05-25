const mongoose = require('mongoose');

const MensajeSchema = new mongoose.Schema({    
    textoConsulta : [{String},{name}]
});

module.exports = mongoose.model('Mensaje', MensajeSchema);
