var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password:  {
    //     type: String,
    //     required: true
    // },
    firstname: {
        type: String,
          default: ''
      },
      lastname: {
        type: String,
          default: ''
      },
    admin:   {
        type: Boolean,
        default: false
    },
  status: {
    type : Boolean,
    default : true
  }
}, {
  timestamps: true
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);