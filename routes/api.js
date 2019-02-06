/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;

const { getIssues, postIssue, putIssue, deleteIssue, addProjectName } = require('../controllers/issueControllers');
const { getProjects, addProject, removeProject, getProject } = require('../controllers/projectControllers');

module.exports = function (app) {

  app.route('/api/issues/:project')  
    .get(getIssues, addProjectName)    
    .post(postIssue)    
    .put(putIssue)    
    
  app.route('/api/issues/:project/:issue')
    .delete(deleteIssue);

  app.route('/api/projects/')
    .get(getProjects) 
    .post(addProject) 
    
  app.route('/api/projects/:project')
    .get(getProject)
    .delete(removeProject);
};
