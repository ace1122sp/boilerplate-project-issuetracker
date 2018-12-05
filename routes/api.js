/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;

const { getAllIssues, postIssue, putIssue, deleteIssue } = require('../controllers/issueControllers');

module.exports = function (app) {

  app.route('/api/issues/:project')  
    .get(getAllIssues)    
    .post(postIssue)    
    .put(putIssue)    
    .delete(deleteIssue);
};
