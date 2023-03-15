const mongoose = require('mongoose');

const WorkoutSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user_id:{
    type: String,
    required: true
  },
  reps:{
    type: Number,
    required: true
  },
  sets:{
    type: Number,
    required: true
  },
  weight:{
    type: Number,
    required: true
  }
},{timestamps:true})

module.exports = mongoose.model("Workout",WorkoutSchema);