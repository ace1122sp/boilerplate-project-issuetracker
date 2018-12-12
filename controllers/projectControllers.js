const Project = require('../models/project');

const getProjects = function(req, res) {
  Project.find({})
    .then(function(recs) {
      console.log('projects returned'); // limit ???      
      res.json({ projects: recs });
    })
    .catch(function(err) {
      console.error(err.message);
      res.sendStatus(500);
    });
}
const addProject = function(req, res) {
  const project_name = req.body.project_name.toString();

  Project.find({ project_name })
    .then(rec => {
      if (rec.length) {
        let message = `project ${rec[0].project_name} already exists`;
        console.log(message);
        res.json({ message });
      } else {        
        let project = new Project({ project_name });
        project.save()
          .then(rec => {
            let message = `project ${rec.project_name} created`;
            console.log(message);
            res.json({ message });
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
  const project_name = req.params.project.toString();
  Project.findOneAndDelete({ project_name })
    .then(rec => {
      let message;
      if (rec) {
        message = `project ${rec.project_name} deleted`;
      } else {
        message = `project ${project_name} not found`;        
      }
      console.log(message);
      res.json({ message });
    })
    .catch(err => {
      console.error(err.message);
      res.sendStatus(500);
    });
}

module.exports = { getProjects, addProject, removeProject };