/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;

const { getIssues, postIssue, putIssue, deleteIssue } = require('../controllers/issueControllers');
const { getProjects, addProject, removeProject } = require('../controllers/projectControllers');

module.exports = function (app) {

  app.route('/api/issues/:project')  
    .get(getIssues)    
    .post(postIssue)    
    .put(putIssue)    
    .delete(deleteIssue);

  app.route('/api/projects/')
    .get(getProjects) 
    .post(addProject) 
    
  app.route('/api/projects/:project')
    .delete(removeProject);
};
