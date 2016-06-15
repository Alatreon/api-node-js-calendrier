var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");


var TaskSchema = new Schema({
  user:{
        type: Schema.Types.ObjectId,
        ref:'User', 
        childPath:'tasks'
    },
  startdate: {
        type: String,
        required: true
    },
  enddate: {
        type: String,
        required: true
    },
  task: {
        type: Number,
        required: true
    },
  type: {
        type: Number,
        required: true
    }
});
TaskSchema.plugin(relationship, { relationshipPathName:'user' });
module.exports = mongoose.model('Task', TaskSchema);