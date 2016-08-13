var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");


var TaskSchema = new Schema({
  user:{
        type: Schema.Types.ObjectId,
        ref:'User', 
        childPath:'tasks',
        required: true
    },
  ressource_id: {
        type: Schema.Types.ObjectId,
        ref:'User', 
        childPath:'tasks',
        required: true
  },
  name: {
        type: String,
        required: true
  },
  start: {
        type: Number,
        required: true
  },
  end: {
        type: Number,
        required: true
  },
  day: {
        type: Number,
        required: true
  },
  week: {
        type: Number,
        required: true
  },
  month: {
        type: Number,
        required: true
  },  
  year: {
        type: Number,
        required: true
  },
  state: {
        type:Number,
        required: true
  },
  text: {
        type: String,
        required: true    
  }
});
TaskSchema.plugin(relationship, { relationshipPathName:'user' });
module.exports = mongoose.model('Task', TaskSchema);
