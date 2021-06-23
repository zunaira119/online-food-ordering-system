var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
   
    name: {
        type: String,
        required: true,
        maxlength: 255
      },
    },
    {
        timestamps: true
});
module.exports = mongoose.model('Category', Category);