var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var Order = new Schema({
   
    status: {
        type: String, 
        enum : ['pending','cancelled','complete'], 
        default: 'pending' 
       },
      user : {
          type: Schema.Types.ObjectId,
          ref:'User'
      },
      product : {
          type : Schema.Types.ObjectId,
          ref : 'Menu'
      },
      quantity : {
          type : Number
      },
      totalAmount : {
        type: Currency,
      }
    },
    {
        timestamps: true
});
module.exports = mongoose.model('Order', Order);