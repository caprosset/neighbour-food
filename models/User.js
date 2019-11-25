const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {type: String, required: true} ,
  email: {type: String, required: true} ,
  password: {type: String, required: true} ,
  address: {
    street: {type: String, required: true} ,
    zipcode: {type: String, required: true} ,
    houseNumber: {type: String, required: true} ,
    city: {type: String, required: true} 
},
  description: {type: String, required: true} ,
  profileImg: {type: String, required: true} ,
  score: {type: Number} ,
  hostedEvents: [{  type: mongoose.Schema.Types.ObjectId, ref: "MealEvent"}],
  attendedEvents: [{  type: mongoose.Schema.Types.ObjectId, ref: "MealEvent"}],
  reviews: {type: Array} ,
  requests: { type: String, enum: ['pending','confirmed','rejected' ],
}
});

const User = mongoose.model('User', userSchema);

module.exports = User;