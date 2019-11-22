const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealEventSchema = Schema({
  eventName: {type: String, required: true} ,
  cuisine: {type: String, required: true} ,
  dish: {type: String, required: true} ,
  date: {type: Date, required: true} ,
  eventImg: {type: String} ,
  host: {  type: mongoose.Schema.Types.ObjectId, ref: "User"},
  guest: [{  type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  eventDescription:{type: String, required: true} ,
  numberAttend: {type: Number, required: true} ,
  costScore: {type: Number} 
});

const MealEvent = mongoose.model('mealEvent', MealEventSchema);

module.exports = MealEvent;