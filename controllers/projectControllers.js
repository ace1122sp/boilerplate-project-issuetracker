const Project = require('../models/project');

const getProjects = function(req, res) {
  Project.find({})
    .select({ project_name: 1 })
    .then(function(recs) {
      console.log('projects returned'); // limit ???      
      res.json({ projects: recs });
    })
    .catch(function(err) {
      console.error(err.message);
      res.sendStatus(500);
    });
}
const getProject = function(req, res) {
  const projectId = req.params.project.toString();
  Project.findById(projectId)
    .populate('issues')
    .then(function(rec) {
      if (rec) {
        res.json(rec);
      } else {
        console.log(rec);
        res.sendStatus(404);
      }
    })
    .catch(function(err) {
      console.error(err.message);
      res.sendStatus(500);
    });
}
const addProject = function(req, res) {
  console.log(req.body)
  const project_name = req.body.project_name.toString();

  Project.findOne({ project_name })
    .then(rec => {
      if (rec) {
        let message = `project ${rec.project_name} already exists`;
        console.log(message);
        res.json({ message });
      } else {        
        let project = new Project({ project_name });
        project.save()
          .then(rec => {
            let message = `project ${rec.project_name} created`;
            console.log(message);
            res.json({ message, _id: rec._id });
          })
          .catch(err => {
            console.error(err.message);
            res.sendStatus(500);
          });
      }
    })
    .catch(err => {
      console.error(err.message);
      res.sendStatus(500);
    });
}
const removeProject = function(req, res) {
  const projectId = req.params.project.toString();
  Project.findByIdAndDelete(projectId)
    .then(rec => {
      let message;
      if (rec) {
        message = `project ${rec.project_name} deleted`;
      } else {
        message = `project ${projectId} not found`;        
      }
      console.log(message);
      res.json({ message });
    })
    .catch(err => {
      console.error(err.message);
      res.sendStatus(500);
    });
}

module.exports = { getProjects, addProject, removeProject, getProject };