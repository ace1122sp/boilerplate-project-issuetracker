/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');

const Issue = require('../models/issue');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body, ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'created_on', 'updated_on', 'open', '_id']);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.equal(res.body.open, false);
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Required fields filled in'
          })
          .end(function(err, res) {
            assert.hasAllKeys(res.body, ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'created_on', 'updated_on', 'open', '_id']);
            assert.equal(res.body.issue_title, 'Title');
            assert.equal(res.body.issue_text, 'text');
            assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            assert.equal(res.body.open, false);
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            created_by: 'Functional Test - Missing required fields'
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.property(res.body, error_message);
            assert.propertyVal(res.body, 'error_message', 'missing required fields');
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      let issueId = null;
      before(function () {
        const issue = new Issue({
          issue_title: 'put-test',
          issue_text: 'put-test',
          created_by: 'put-test-before-hook'
        });
        issue.save()
          .then(rec => {
            issueId = rec._id;
          })
          .catch(err => console.error(err.stack));
      });

      test('No body', function(done) {        
        chai.request(server)        
          .put('/api/issues/test')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'message');
            assert.propertyValue(res.body, 'message', 'no updated field sent');
            done();
          });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: issueId,
            issue_title: 'new-title'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'message');
            assert.propertyValue(res.body, 'message', `successfully updated ${issueId}`);
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: issueId,
            issue_title: 'new title',
            issue_text: 'new text'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'message');
            assert.propertyValue(res.body, 'message', `successfully updated ${issueId}`);
            done();
          });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      before(function () {        
        const issue = new Issue({
          issue_title: 'get-test',
          issue_text: 'get-test',
          created_by: 'get-test-before-hook'
        });

        issue.save()
          .then(rec => {
            console.log('created test issue');
          })
          .catch(err => console.error(err.stack));
      });

      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ created_by: 'get-test-before-hook' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ issue_title: 'get-test', issue_text: 'get-text' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      let issueId = null;
      before(function () {
        const issue = new Issue({
          issue_title: 'get-test',
          issue_text: 'get-test',
          created_by: 'get-test-before-hook'
        });

        issue.save()
          .then(rec => {
            issueId = rec._id;
            console.log('created test issue');
          })
          .catch(err => console.error(err.stack));
      });

      test('No _id', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ _id: 'fake-id' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'message');
            assert.propertyVal(res.body, 'message', 'could not delete fake-id');
            done();
          });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ _id: issueId })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'message');
            assert.propertyValue(res.body, 'message', `deleted ${issueId}`);
            done();
          });
      });
      
    });

});
