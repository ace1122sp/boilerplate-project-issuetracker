const Issue = require('../models/issue').Issue;
const Project = require('../models/project');

// validation and sanitize middlewares will pass only valid req
// if required fields are missing --> { message: 'missing required fields' }
const getIssues = function(req, res) {
  const filters = req.query; // this needs to be sanitized

  Issue.find(filters)
    .then(function(recs) {
      console.log('returned all issues');
      res.json(recs);
    })
    .catch(function(err) {
      console.error(err.message);
      res.sendStatus(500);
    });
}
const postIssue = function(req, res) {
  const project = req.params.project;
  const issue = new Issue({
    issue_title: req.body.issue_title,
    issue_text: req.body.issue_text,
    created_by: req.body.created_by,
    assigned_to: req.body.assigned_to,
    status_text: req.body.status_text,
    created_on: new Date().toLocaleString(),
    updated_on: new Date().toLocaleString()    
  });

  issue.save()
    .then(function(doc) {
      console.log('issue created: ', doc);
      res.json(doc);
    })
    .catch(function(err) {
      console.log(err.message);
      res.json({ message: 'missing required fields' });
    });
  
}
const putIssue = function(req, res) {
  let update = {};

  const allowedFieldsToBeUpdated = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text'];
  for (let field in req.body) {
    allowedFieldsToBeUpdated.forEach(val => {
      if (val == field) update[field] = req.body[field];
    });
  }

  update.updated_on = new Date().toLocaleString();

  const updateExists = Object.keys(update).length > 1;
  
  if (updateExists) {
    Issue.findByIdAndUpdate(req.body._id, update, { new: true })
      .then(function(doc) {
        const message = `successfully updated ${doc._id}`;
        console.log(message);
        res.json({ message });
      })
      .catch(function(err) {
        const message = `could not update ${req.body._id}`;
        console.log(err.message);
        return res.json({ message });
      });
  } else {
    res.json({ message: 'no updated field sent' });
  }
}
const deleteIssue = function(req, res) {
  if (req.body._id) {
    Issue.findByIdAndDelete(req.body._id)
      .then(function (rec) {
        const message = `deleted ${req.body._id}`;
        console.log(message);
        res.json({ message });
      })
      .catch(function (err) {
        const message = `could not delete ${req.body._id}`;
        console.error(err.message);
        res.json({ message });
      });
  } else {
    console.log('issue delete failed: no _id');
    res.json({ message: '_id error' });
  }
}

module.exports = {
  getIssues, 
  postIssue,
  putIssue,
  deleteIssue
};