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
      this.innerIssueWrapper = document.getElementsByClassName('inner-issue-wrapper');
      
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
      
      // create elements 
      const issueTitle = document.createElement('h3');
      issueTitle.innerText = issue.issue_title;

      const issueText = document.createElement('p');
      issueText.innerText = issue.issue_text;

      const status = document.createElement('div');
      status.setAttribute('class', 'issue-status');    
      const statusLabel = document.createElement('i');
      statusLabel.innerText = 'status';
      const statusText = document.createElement('p');
      statusText.innerText = issue.status;

      status.appendChild(statusLabel);
      status.appendChild(statusText);

      const open = document.createElement('p');
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