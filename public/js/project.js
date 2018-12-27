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
      this.renderIssueAddForm();
      this.renderFilterForm();
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
    renderIssueAddForm: function() {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('id', 'add-issue-div');

      const childElements = [];

      const h3 = document.createElement('h3');
      h3.innerText = 'Add Issue';

      childElements.push(h3);

      const form = document.createElement('form'); // refactor this
      form.setAttribute('action', '????');
      form.setAttribute('method', 'POST');
      form.setAttribute('id', 'add-issue-form');

      // create inner form sections
      const _createFormSection = param => {
        const div = document.createElement('div');
        div.setAttribute('class', 'inner-form-div');

        const label = document.createElement('label');
        label.setAttribute('for', param.inputId);
        label.innerText = param.label;

        const input = document.createElement('input');
        const attributes = [['type', 'text'], ['name', param.inputName], ['id', param.inputId], ['required', param.required]];
        attributes.forEach(attr => {
          if (attr[0] === 'required' && attr[1] === false) return;
          input.setAttribute(attr[0], attr[1]);
        });      

        [label, input].forEach(elm => {
          div.appendChild(elm);
        });

        return div;
      }

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
        },
      ];

      formElements.forEach(elm => {
        let element = _createFormSection(elm);
        form.appendChild(element);
      });

      const _generateControlButtons = btn => {
        const { attr, attrVal, innerText } = btn;
        const button = document.createElement('button');
        button.setAttribute(attr, attrVal);
        button.innerText = innerText;

        return button;
      }
      // add submit button to form
      const submitBtn = _generateControlButtons({ attr: 'type', attrVal: 'submit', innerText: 'add' });
      form.appendChild(submitBtn);

      childElements.push(form);

      // cancel and close form
      const cancelBtn = _generateControlButtons({ attr: 'id', attrVal: 'cancel-adding-issue-btn', innerText: 'cancel' });    
      childElements.push(cancelBtn);

      // append child elements to wrapper
      childElements.forEach(elm => {
        wrapper.appendChild(elm);
      });

      // render 
      this.main.appendChild(wrapper);
    },
    renderFilterForm: function() {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('id', 'filter-issues-div');

      const childElements = [];

      const h3 = document.createElement('h3');
      h3.innerText = 'Filter Issues';
      
      childElements.push(h3);

      // add input elements
      const labels = [
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
      
      const _generateInputDivs = input => {
        const { inputId, inputName, label } = input;
        
        const div = document.createElement('div');
        
        const labelElm = document.createElement('label');
        labelElm.setAttribute('for', inputId);
        labelElm.innerText = label;

        div.appendChild(labelElm);

        const inputElm = document.createElement('input');
        const inputAttrs = [['type', 'text'], ['id', inputId], ['name', inputName]];
        inputAttrs.forEach(attr => {
          inputElm.setAttribute(attr[0], attr[1]);
        });

        div.appendChild(inputElm);

        return div
      }

      labels.forEach(l => {
        const inputDiv = _generateInputDivs(l);
        childElements.push(inputDiv);
      });

      // add control buttons
      const buttons = ['ok', 'cancel'];

      const _generateControlButtons = val => {
        const btn = document.createElement('button');
        btn.innerText = val;

        return btn;
      }

      buttons.forEach(b => {
        let btn = _generateControlButtons(b);
        childElements.push(btn);
      });

      // append child elements to wrapper
      childElements.forEach(elm => {
        wrapper.appendChild(elm);
      });

      // render filter form
      this.main.appendChild(wrapper);
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