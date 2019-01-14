(function() {
  const project = location.pathname.slice(1).toString();
  
  const model = {
    fetchIssues: function(filters = {}) {
      let url = `/api/projects/${project}?`;

      // append filters to url      
      for(let filter in filters) {
        url += `${filter}=${filters[filter]}&`;
      }
      
      // this method will only get issues from the server
      return fetch(url)
        .then(res => res.json())
        .then(res => {
          this.issues = [...res.issues];
          this.projectName = res.project_name;
        })
        .catch(function(err) {
          throw new Error('oops something went wrong...');
        });
    }, 
    getProjectName: function () {
      
      // returns locally stored project name, does not comunicate with the server
      return this.projectName;
    },
    getIssues: function() {

      // returns locally stored issues, does not comunicate with the server
      return this.issues;
    },    
    getIssue: function(id) {
      
      //filters local issue store
      return this.issues.filter(issue => issue._id === id)[0];
    },
    addIssue: function(issue) {
      
      // fetch new issue to the server
      const url = `/api/issues/${project}`;
      const options = {
        method: 'POST',
        body: JSON.stringify(issue),
        headers: { 'Content-Type': 'application/json' }
      };

      return fetch(url, options)
        .then(res => res.json())
        .then(res => {
          this.issues.push(res);          
          return res;
        })
        .catch(err => {
          throw new Error('failed to add issue...');
        });
    },
    editIssue: function(edits) {

      // fetch put request to update the issue with sent fields
      const url = `api/issues/${project}`;
      const options = {
        method: 'PUT',
        body: JSON.stringify(edits),
        headers: { 'Content-Type': 'application/json' }
      };

      return fetch(url, options)
        .then(() => {          
          let updated;
          this.issues = this.issues.map(issue => {
            if (issue._id === edits._id) { 
              for (let e in edits) {
                issue[e] = edits[e];
              }
            }
            updated = Object.assign({}, issue);
            return issue;
          });          
          return updated;
        })
        .catch(err => {
          throw new Error('failed to edit issue...');
        });
    },
    removeIssue: function(id) {
    
      // fetch delete request here
      const url = `/api/issues/${project}/${id}`;
      const options = {
        method: 'DELETE'
      };

      return fetch(url, options)
        .then(res => res.json())
        .then(res => {
          this.issues.filter(issue => issue !== id);
          return res;
        })
        .catch(err => {
          throw new Error('failed to remove issue...');
        });
    }
  };
  const view = {
    init: function() {
      // dom
      this.title = document.getElementsByTagName('title')[0];
      this.main = document.getElementsByTagName('main')[0];
      this.divLoading = document.getElementById('loading-div');
      this.issueList = document.getElementsByClassName('issue-list')[0];
      this.issueView = document.getElementsByClassName('issue-view')[0];
      this.project = document.getElementsByClassName('project')[0];
      this.filterBtn = document.getElementById('filter-issues');
      this.projectHeadline = document.querySelector('.issue-view h2');
      this.innerIssueWrapper = document.getElementsByClassName('inner-issue-wrapper')[0];
      this.addIssueBtn = document.getElementById('add-issue-btn');
      this.filterIssuesBtn = document.getElementById('filter-issues-btn');          

      // event listeners
      this.addIssueBtn.addEventListener('click', () => {
        this.removeSectionsByClass('form-section');
        this.renderIssueAddForm();
      });

      this.filterIssuesBtn.addEventListener('click', () => {
        this.removeSectionsByClass('form-section');
        this.renderFilterForm();
      });

    },
    _createListItem: function(title, _id, open) {
      const li = document.createElement('li');
      li.setAttribute('id', _id);
      li.innerText = title;

      return li;
    },
    _composeReqBody: function(form) {
      const data = {};
      const length = form.length - 1;
      for (let i = 0; i < length; i++) {
        if (form[i].value.length > 0) {
          data[form[i].name] = form[i].value;
        }
      }

      return data;
    },
    _generateForm: function(wrapperId, title, formId, formCb, formElements) {
      const wrapper = document.createElement('div');

      wrapper.setAttribute('id', wrapperId);
      wrapper.setAttribute('class', 'form-section adding-form');

      const childElements = [];

      const h3 = document.createElement('h3');
      h3.innerText = title;

      childElements.push(h3);

      const form = document.createElement('form'); 
      form.setAttribute('id', formId);

      form.addEventListener('submit', e => {
        formCb(e);
        wrapper.className += ' removing-form';
        const timer = setTimeout(() => {
          this.removeSectionsByClass('form-section');
          clearTimeout(timer);
        }, 1650);
      });

      // add input elements
      const _createFormSection = param => {
        const div = document.createElement('div');
        div.setAttribute('class', 'inner-form-div');

        const label = document.createElement('label');
        label.setAttribute('for', param.inputId);
        label.innerText = param.label;

        const input = document.createElement('input');
        const attributes = [['type', 'text'], ['name', param.inputName], ['id', param.inputId], ['required', param.required]];
        attributes.forEach(attr => {
          if (attr[0] === 'required' && (attr[1] === false || attr[1] === undefined)) return;
          input.setAttribute(attr[0], attr[1]);
        });

        [label, input].forEach(elm => {
          div.appendChild(elm);
        });

        return div;
      }

      formElements.forEach(elm => {
        let element = _createFormSection(elm);
        form.appendChild(element);
      });

      // add control buttons

      const _generateControlButtons = val => {
        const btn = document.createElement('button');
        btn.innerText = val;

        return btn;
      }

      const submitBtn = _generateControlButtons('submit');
      form.appendChild(submitBtn);

      const cancelBtn = _generateControlButtons('cancel');
      cancelBtn.setAttribute('class', 'button-not-emphasized button-neutral no-bottom');
      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.className += ' removing-form';
        const timer = setTimeout(() => {
          this.removeSectionsByClass('form-section');
          clearTimeout(timer);
        }, 1650);
      });

      form.appendChild(cancelBtn);
      childElements.push(form);

      // append child elements to wrapper
      childElements.forEach(elm => {
        wrapper.appendChild(elm);
      });

      // render filter form
      this.main.appendChild(wrapper);
    },
    _setDefaultInnerIssueWrapper: function() {

      // clear 
      this.innerIssueWrapper.innerHTML = '';
      
      // create content
      const defaultP = document.createElement('p');
      defaultP.setAttribute('class', 'text-placeholder');
      defaultP.innerText = 'no issue selected...';

      // render 
      this.innerIssueWrapper.appendChild(defaultP);
    },
    render: function() {
      this.divLoading.style.display = 'none';
      this.project.style.display = 'flex';
      this.title.innerText = octopus.getProjectName();

      this.renderIssueList();
      this.renderIssueView();      
    },
    renderIssueList: function() {
      const issues = octopus.getIssues();
      const ul = document.createElement('ul');

      // clear issueList
      const prevUl = document.querySelectorAll('.issue-list ul');
      for (let u = 0; u < prevUl.length; u++) {
        prevUl[u].parentElement.removeChild(prevUl[u]);
      }

      issues.forEach(issue => {
        const { issue_title: title, _id, open } = issue;
        let li = this._createListItem(title, _id, open);
        li.setAttribute('class', 'list-item');

        // eventListener
        li.addEventListener('click', function () {
          view.renderIssueCard(_id);
        });

        ul.appendChild(li);
      });

      this.issueList.appendChild(ul);
    },
    renderIssueView: function() {                
      this.projectHeadline.innerText = this.title.innerText;
      this._setDefaultInnerIssueWrapper();
    },
    renderIssueAddForm: function() {
      const wrapperId = 'add-issue-section';
      const title = 'Add Issue';
      const formId = 'add-issue-form';
      const formCb = e => {
        e.preventDefault();
        octopus.addIssue(this._composeReqBody(e.target))
          .then(issue => {
            this.renderAddedIssue(issue);
          })
          .catch(err => this.renderMessage(err.message));
      };
      const formElements = [
        {
          inputId: 'add-issue-form-title',
          inputName: 'issue_title',
          label: 'issue title: ',          
          required: true
        },
        {
          inputId: 'add-issue-form-text',
          inputName: 'issue_text',
          label: 'issue text: ',
          required: true          
        },
        {
          inputId: 'add-issue-form-created-by',
          inputName: 'created_by',
          label: 'created by: ',
          required: true          
        },
        {
          inputId: 'add-issue-form-assigned-to',
          inputName: 'assigned_to',
          label: 'assigned to: ',
          required: false 
        },
        {
          inputId: 'add-issue-form-status-text',
          inputName: 'status_text',
          label: 'status text: ',
          required: false
        }        
      ];

      this._generateForm(wrapperId, title, formId, formCb, formElements);
    },
    renderIssueEditForm: function(issueId) {
      const wrapperId = 'edit-issue-section';
      const title = 'Edit Issue';
      const formId = 'edit-issue-form';
      const formCb = e => {
        e.preventDefault();
        const edits = this._composeReqBody(e.target);
        edits._id = issueId;

        octopus.editIssue(edits)
          .then(() => {
            this.renderIssueCard(issueId);
            this.renderIssueList();
          })
          .catch(err => this.renderMessage(err.message));
      };
      const formElements = [
        {
          inputId: 'edit-issue-form-title',
          inputName: 'issue_title',
          label: 'issue title: '          
        },
        {
          inputId: 'edit-issue-form-text',
          inputName: 'issue_text',
          label: 'issue text: '          
        },
        {
          inputId: 'edit-issue-form-created-by',
          inputName: 'created_by',
          label: 'created by: '          
        },
        {
          inputId: 'edit-issue-form-assigned-to',
          inputName: 'assigned_to',
          label: 'assigned to: '          
        },
        {
          inputId: 'edit-issue-form-status-text',
          inputName: 'status_text',
          label: 'status text: '          
        }
      ];

      this._generateForm(wrapperId, title, formId, formCb, formElements);
    },
    removeSectionsByClass: function(className) {
      const sections = document.getElementsByClassName(className);
      const length = sections.length;

      for (let i = 0; i < length; i++)  {
        sections[i].parentNode.removeChild(sections[i]);
      }
    },
    renderFilterForm: function() {
      const wrapperId = 'filter-issues-section';
      const title = 'Filter Issues';
      const formId = 'filter-issues-form';
      const formCb = e => {
        e.preventDefault();
        octopus.fetchIssues(this._composeReqBody(e.target))
          .then(() => {
            this.renderIssueList();
            this._setDefaultInnerIssueWrapper();
            return;
          })
          .catch(() => this.renderErrorScreen());
      };
      const formElements = [
        {
          inputId: 'filter-title',
          inputName: 'issue_title',
          label: 'issue title: '
        },
        {
          inputId: 'filter-text',
          inputName: 'issue_text',
          label: 'issue text: '
        },
        {
          inputId: 'filter-created-by',
          inputName: 'created_by',
          label: 'created by: '
        },
        {
          inputId: 'filter-assigned-to',
          inputName: 'assigned_to',
          label: 'assigned to: '
        },
        {
          inputId: 'filter-status-text',
          inputName: 'status_text',
          label: 'status text: '
        },
        {
          inputId: 'filter-created-on',
          inputName: 'created_on',
          label: 'created on: '
        },
        {
          inputId: 'filter-updated-on',
          inputName: 'updated_on',
          label: 'updated on: '
        },
        {
          inputId: 'open',
          inputName: 'open',
          label: 'open: '
        }
      ];
      
      this._generateForm(wrapperId, title, formId, formCb, formElements);
    },
    renderIssueCard: function(issueId) {      
      const issue = octopus.getIssue(issueId);
      const elements = [];
      
      // clear the section before render
      this.innerIssueWrapper.innerHTML = '';

      // element generators
      const _createLabel = (category, value) => {
        const p = document.createElement('p');
        p.innerText = category + ': ';
        p.setAttribute('id', 'issue-card-' + category);
        const i = document.createElement('i');
        i.innerText = value;

        p.appendChild(i);

        return p;
      }
    
      const _createControlButton = (id, value) => {
        const btn = document.createElement('button');
        btn.setAttribute('id', id);
        btn.innerText = value;

        return btn;
      }

      // issue_title
      const issueTitle = document.createElement('h3');
      issueTitle.innerText = issue.issue_title;      
      
      elements.push(issueTitle);

      // issue_text
      const issueText = document.createElement('p');
      issueText.setAttribute('id', 'issue-text');
      issueText.innerText = issue.issue_text;      

      elements.push(issueText);
      
      // open 
      const openDiv = document.createElement('div');
      openDiv.setAttribute('id', 'open-div');
      const open = document.createElement('label');
      open.innerText = issue.open ? 'open' : 'closed';
      const openBtn = document.createElement('button');
      openBtn.setAttribute('id', 'openBtn');
      openBtn.addEventListener('click', () => {
        openBtn.setAttribute('disabled', 'true');
        octopus.editIssue({ _id: issueId, open: !issue.open })
          .then(() => {
            const clsName = issue.open ? 'open-true' : 'open-false';
            open.innerText = issue.open ? 'open' : 'closed';
            btnSwitch.setAttribute('class', clsName);
            openBtn.removeAttribute('disabled');
          })
          .catch(err => this.renderMessage(err.message));
      });

      const btnSwitch = document.createElement('div');
      btnSwitch.setAttribute('id', 'btnSwitch');
      btnSwitch.setAttribute('class', issue.open ? 'open-true' : 'open-false');

      openBtn.appendChild(btnSwitch);
      openDiv.appendChild(open);
      openDiv.appendChild(openBtn);

      elements.push(openDiv);
      
      // labels
      const labelParameters = [
        {
          category: 'status text',
          value: issue.status_text
        },
        {
          category: 'created by',
          value: issue.created_by
        },
        {
          category: 'assigned to',
          value: issue.assigned_to
        },
        {
          category: 'created on',
          value: issue.created_on
        },
        {
          category: 'updated on',
          value: issue.updated_on
        },
      ];

      labelParameters.forEach(label => {
        const elm = _createLabel(label.category, label.value);
        elements.push(elm);
      });

      // control buttons 
      const editBtn = _createControlButton('edit-issue-btn', 'edit');
      editBtn.setAttribute('class', 'button-not-emphasized button-neutral no-bottom');
      editBtn.addEventListener('click', () => {
        this.removeSectionsByClass('form-section');
        this.renderIssueEditForm(issueId);
      });
      
      const deleteBtn = _createControlButton('delete-issue-btn', 'delete');
      deleteBtn.setAttribute('class', 'button-warning');
      deleteBtn.addEventListener('click', () => {
        octopus.removeIssue(issue._id)
          .then(() => {
            this.removeDeletedIssue(issue._id);
            this._setDefaultInnerIssueWrapper();
          })
          .catch(err => this.renderMessage(err.message));
      });
      
      const controlButtons = [editBtn, deleteBtn];

      controlButtons.forEach(btn => {
        elements.push(btn);
      });

      // render 
      elements.forEach(elm => {
        this.innerIssueWrapper.appendChild(elm);
      });
    },
    renderAddedIssue: function(issue) {
      const ul = document.querySelectorAll('.issue-list ul')[0];
      const { issue_title: title, _id, open } = issue;
      const li = this._createListItem(title, _id, open);
      li.setAttribute('class', 'list-item');

      li.addEventListener('click', function() {
        view.renderIssueCard(_id);
      });

      ul.appendChild(li);
    },
    removeDeletedIssue: function(id) {
      const li = document.getElementById(id);
      li.parentElement.removeChild(li);
      
      // clear issue card section
      this.innerIssueWrapper.innerHTML = '';
      
    },
    renderErrorScreen: function(message) {
      // error screen 
      const divError = document.createElement('div');
      divError.setAttribute('class', 'div-error');

      const p = document.createElement('p');
      p.innerText = message;

      // clear main element
      while (this.main.hasChildNodes()) {
        this.main.removeChild(this.main.firstChild);
      }

      // render error message
      divError.appendChild(p);
      this.main.appendChild(divError);
    },
    renderMessage: function (message) {

      // message div
      const div = document.createElement('div');
      div.setAttribute('class', 'temp-info-div');

      const p = document.createElement('p');
      p.setAttribute('class', 'temp-info-inner');
      p.innerText = message;

      // render message & remove message after 2sec
      div.appendChild(p);
      this.main.appendChild(div);

      let timeout = setTimeout(() => {
        this.main.removeChild(div);
        clearTimeout(timeout);
      }, 2000);
    }
  };
  const octopus = {
    init: function() {
      view.init();
      this.fetchIssues()
      .then(() => {
        view.render();
      })
      .catch(err => {
        view.renderErrorScreen(err.message);
      });
    },
    fetchIssues: function(filters = {}) {
      return model.fetchIssues(filters)
        .catch(err => {
          view.renderErrorScreen(err.message);
        });
    },
    getProjectName: function() {      
      return model.getProjectName();
    },
    getIssues: function() {
      return model.getIssues();
    },
    getIssue: function(id) {
      return model.getIssue(id);
    },
    addIssue: function(issue) {
      return model.addIssue(issue);
    },
    editIssue: function(edits) {
      return model.editIssue(edits);
    },
    removeIssue: function(id) {
      return model.removeIssue(id);
    }
  };
  octopus.init();
})();