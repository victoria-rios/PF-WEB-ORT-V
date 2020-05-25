
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConsultaSchema = new Schema({

    texto: String
    /*msg: String,
    created: { type: Date, default: Date.now }*/

});

module.exports = mongoose.model('Consulta', ConsultaSchema);


  