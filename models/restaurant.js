var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Restaurant = new Schema({
   
    name: {
        type: String,
        required: true,
        maxlength: 255
      },
      category : {

            type: Schema.Types.ObjectId,
            ref: 'Category',
      },
      owner : {
          type: Schema.Types.ObjectId,
          ref:'User'
      },
      menues : [{
          type : Schema.Types.ObjectId,
          ref : 'Menu'
      }],
      location : {
          type : String,
          maxlength:255
      }
    },
    {
        timestamps: true
});
module.exports = mongoose.model('Restaurant', Restaurant);