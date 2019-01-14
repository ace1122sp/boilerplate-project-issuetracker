const Project = require('../models/project');
const Issue = require('../models/issue');

// validation and sanitize middlewares will pass only valid req
const getIssues = function(req, res) {
  const filters = req.query; // this needs to be sanitized
  filters.project = req.params.project;

  Issue.find(filters)
    .then(function(recs) {
      console.log('all issues returned');
      res.json(recs);
    })
    .catch(function(err) {
      console.error(err.message);
      res.sendStatus(500);
    });
}
const postIssue = function(req, res) {
  const projectId = req.params.project.toString();
  const issue = new Issue({
    issue_title: req.body.issue_title,
    issue_text: req.body.issue_text,
    created_by: req.body.created_by,
    assigned_to: req.body.assigned_to,
    status_text: req.body.status_text,
    created_on: new Date(),
    updated_on: new Date(),
    project: projectId
  });

  issue.save()
    .then(function(doc) {
      Project.findByIdAndUpdate(projectId, { $push: { issues: doc._id } })
      .then(function(proj) {
        console.log('issue created: ', doc);              
        res.json(doc);              
      }); // catch ??
    })
    .catch(function(err) {
      console.log(err.message);
      res.json({ message: 'missing required fields' });
    });
  
}
const putIssue = function(req, res) {
  let update = {};

  const allowedFieldsToBeUpdated = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
  for (let field in req.body) {
    allowedFieldsToBeUpdated.forEach(val => {
      if (val == field) update[field] = req.body[field];
    });
  }

  update.updated_on = new Date();

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
  const _id = req.params.issue.toString()
  if (_id) {
    Issue.findByIdAndDelete(_id)
      .then(function(rec) {
        const message = `deleted ${_id}`;
        console.log(message);
        res.json({ message });
      })
      .catch(function (err) {
        const message = `could not delete ${_id}`;
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
