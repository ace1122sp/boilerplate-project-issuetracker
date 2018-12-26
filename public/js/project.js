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
      const elements = [];
      
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
      issueText.innerText = issue.issue_text;      

      elements.push(issueText);
      
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
      const controlButtonsParams = [
        { id: 'edit-issue-btn', value: 'edit' },
        { id: 'delete-issue-btn', value: 'delete' }
      ];

      controlButtonsParams.forEach(btn => {
        const elm = _createControlButton(btn.id, btn.value);
        elements.push(elm);
      });

      // render 
      elements.forEach(elm => {
        this.innerIssueWrapper.append(elm);
      });
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