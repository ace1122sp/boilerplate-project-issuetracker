const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  issue_title: {
    type: String,
    required: true,
    min: 1,
    max: 30
  },
  issue_text: {
    type: String,
    required: true,
    min: 1,
    max: 200
  },
  created_by: {
    type: String,
    required: true,
    min: 1,
    max: 30
  },
  assigned_to: {
    type: String,
    min: 1,
    max: 30
  },
  status_text: {
    type: String,
    min: 1,
    max: 30
  },
  created_on: {
    type: String,
    min: 30, // check ms length
    max: 30
  },
  updated_on: {
    type: String,
    min: 30, // check ms length
    max: 30
  },
  open: {
    type: Boolean,
    default: true
  }
});

const Issue = mongoose.model('Issue', IssueSchema);

module.exports = Issue;