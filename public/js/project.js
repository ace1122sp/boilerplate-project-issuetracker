(function() {
  const project = location.pathname.slice(1).toString();
  
  const model = {
    init: function() {
      return fetch(`/api/issues/${project}`)
        .then(function(res) {
          return res.json();
        })
        .then(res => {
          this.issues = [...res];
        })
        .catch(function(err) {
          throw new Error('oops something went wrong');
        });
    }, 
    getIssues: function() {
      return this.issues;
    },
    getIssue: function(id) {
      return this.issues.filter(issue => issue._id === id)[0];
    },
    addIssue: function() {},
    editIssue: function() {},
    removeProject: function() {}
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
      
      this.title.innerText = location.pathname.slice(1).split('%20').join(' ');

      // event listeners
    },
    _createListItem: function(title, _id, open) {
      const li = document.createElement('li');
      const openCloseClass = open ? 'open' : 'closed';
      li.setAttribute('_id', _id);
      li.setAttribute('class', openCloseClass);
      li.innerText = title;

      return li;
    },
    render: function() {
      this.divLoading.style.display = 'none';
      this.project.style.display = 'flex';

      this.renderIssueList();
      this.renderIssueView();
    },
    renderIssueList: function() {
      const issues = octopus.getIssues();
      const ul = document.createElement('ul');

      issues.forEach(issue => {
        const { issue_title: title, _id, open } = issue;
        let li = this._createListItem(title, _id, open);

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
    },
    renderIssueCard: function(issueId) {      
      const issue = octopus.getIssue(issueId);
      
      // basic issue element factory
      const createIssueLabel = (category, value) => {
        const p = document.createElement('p');
        p.innerText = category + ': ';
        p.setAttribute('id', 'issue-card-' + category);
        const i = document.createElement('i');
        i.innerText = value;

        p.appendChild(i);

        this.innerIssueWrapper.appendChild(p);
      }

      // create elements 

      // issue_title
      const issueTitle = document.createElement('h3');
      issueTitle.innerText = issue.issue_title;

      this.innerIssueWrapper.appendChild(issueTitle);

      // issue_text
      const issueText = document.createElement('p');
      issueText.innerText = issue.issue_text;

      this.innerIssueWrapper.appendChild(issueText);

      // status_text
      const statusText = createIssueLabel('status text', issue.status_text);

      // open 
      const openDiv = document.createElement('div');
      openDiv.setAttribute('id', 'open-div');
      const open = document.createElement('label');
      open.innerText = issue.open ? 'open' : 'closed';
      const openBtn = document.createElement('button');
      openBtn.setAttribute('id', 'openBtn');
      const btnSwitch = document.createElement('i');
      btnSwitch.setAttribute('id', 'btnSwitch');

      openBtn.appendChild(btnSwitch);
      openDiv.appendChild(open);
      openDiv.appendChild(openBtn);

      this.innerIssueWrapper.appendChild(openDiv);

      // created_by
      const createdBy = createIssueLabel('created by', issue.created_by);

      // assigned_to
      const assignedTo = createIssueLabel('assigned to', issue.assigned_to);
      
      // created_on
      const createdOn = createIssueLabel('created on', issue.created_on);

      // updated_on
      const updatedOn = createIssueLabel('updated on', issue.updated_on);
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
    }
  };
  const octopus = {
    init: function() {
      view.init();
      model.init()
      .then(() => {
        view.render();
      })
      .catch(err => {
        view.renderErrorScreen(err.message);
      });
    },
    getIssues: function() {
      return model.getIssues();
    },
    getIssue: function(id) {
      return model.getIssue(id);
    }
  };

  octopus.init();
})();