const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const IssueSchema = require('./issue').IssueSchema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 30
  }, 
  issues: {
    type: [IssueSchema],  
    default: []
  }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;