//mettre les roles et leurs actions possible
//id
//role
//actions {createTask,DeleteTask...}
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");


var RolesSchema = new Schema({
  // user:{
  //       type: Schema.Types.ObjectId,
  //       ref:'User', 
  //       childPath:'tasks',
  //       required: true
  //   },
  // ressource_id: {
  //       type: Schema.Types.ObjectId,
  //       ref:'User', 
  //       childPath:'tasks',
  //       required: true
  // },
  name: {
        type: String,
        required: true
  }
});
TaskSchema.plugin(relationship, { relationshipPathName:'user'});
module.exports = mongoose.model('Roles', TaskSchema);
