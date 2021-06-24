var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var Menu = new Schema({
   name:{
       type : String,
       required:true,
   },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    foodCategory : {
        type: Schema.Types.ObjectId,
        ref: 'FoodCategory',
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    },
    },
    {
        timestamps: true
});
module.exports = mongoose.model('Menu', Menu);