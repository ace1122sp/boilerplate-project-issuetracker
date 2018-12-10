const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  project_name: {
    type: String, 
    required: true,
    min: 1,
    max: 30
  },
  issues: [{
      type: [Schema.Types.ObjectId],
      ref: 'Issue',
    }
  ]
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;