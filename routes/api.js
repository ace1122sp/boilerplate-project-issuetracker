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

module.exports = function (app) {

  app.route('/api/issues/:project')  
    .get(getIssues)    
    .post(postIssue)    
    .put(putIssue)    
    .delete(deleteIssue);
};
