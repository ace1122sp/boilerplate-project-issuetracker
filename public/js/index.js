(function () {
  const model = {
    projects: [],
    init: function () {
      return fetch('/api/projects')
        .then(function(res) {
          return res.json();
        })
        .then(res => {
          this.projects = res.projects.map(project => [project.project_name, project._id]);
          return;
        })
        .catch(function(err) {
          throw new Error('oops something went wrong');
        });
    },
    getProjects: function () {   
      return this.projects;
    },
    addProject: function (project_name) {
      // headers?      
      const options = { 
        method: 'POST', 
        body: JSON.stringify({ project_name }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return fetch('/api/projects', options)
        .then(res => res.json())
        .then(res => {          
          this.projects.push([project_name, res._id]);
          return res;
        })
        .catch(err => {
          throw new Error('failed to add project...');
        });
    },
    removeProject: function (id) {
      // headers ???
      return fetch(`/api/projects/${id}`, { method: 'DELETE' })
        .then(() => {
          this.projects = this.projects.filter(project => project[1] !== id);
          return id;
        })
        .catch(error => {
          throw new Error('failed to remove project');
        });
    }
  }
  const view = {
    init: function () {

      // dom
      this.main = document.getElementsByTagName('main')[0];
      this.divLoading = document.getElementById('loading-div');
      this.projects = document.getElementsByClassName('projects')[0];
      this.newProject = document.getElementById('new-project');
      this.submitProjectBtn = document.getElementById('submit-project-btn');

      // event listeners
      this.submitProjectBtn.addEventListener('click', e => {
        e.preventDefault();
        octopus.addProject(this.newProject.value);
        this.newProject.value = '';
      });

    },
    _createProjectElm: function(project) {
      const container = document.createElement('div');
      container.setAttribute('class', 'project-click-box adding-element');
      container.setAttribute('id', project[1]);

      const a = document.createElement('a');
      a.setAttribute('href', `/${project[1]}`);
      a.innerText = project[0];

      const btn = document.createElement('button');
      btn.innerText = 'X';
      btn.addEventListener('click', function() {
        octopus.removeProject(project[1]);
      });

      container.appendChild(a);
      container.appendChild(btn);

      return container;
    },
    render: function () {
      this.divLoading.style.display = 'none';
      this.projects.style.display = '';

      const projects = octopus.getProjects();
      
      // append project to dom
        projects.forEach(project => {
          let projectElement = view._createProjectElm(project);
          this.projects.appendChild(projectElement);
        });
    },
    renderAdd: function(projectName) {
      const projectElm = this._createProjectElm(projectName);
      this.projects.appendChild(projectElm);
    },
    renderRemove: function(id) { 
      const project = document.getElementById(id);
      project.className += ' removing-element';
      
      document.removeEventListener('click', octopus.removeProject);
      const timer = setTimeout(() => {
        this.projects.removeChild(project);
        clearTimeout(timer);
      }, 1650);
    },
    renderErrorScreen: function(message) {
      // error screen 
      const divError = document.createElement('div');
      divError.setAttribute('class', 'div-error');
      
      const p = document.createElement('p');
      p.innerText = message;

      // clear main element
      while(this.main.hasChildNodes()) {
        this.main.removeChild(this.main.firstChild);
      }

      // render error message
      divError.appendChild(p);
      this.main.appendChild(divError);
    },
    renderMessage: function(message) {

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
  }
  const octopus = {
    init: function () {
      view.init();
      model.init()
        .then(() => {
          view.render();
        })
        .catch(function (err) {
          view.renderErrorScreen(err.message);
        });
    },
    getProjects: function () {
      return model.getProjects();
    },
    addProject: function(projectName) {
      if (projectName.length < 1) {
        view.renderMessage('Project name required!');
        return;
      }
      model.addProject(projectName)
        .then(res => {
          const startIndex = res.message.length - 7;
          const status = res.message.slice(startIndex);

          view.renderMessage(res.message);
          if (status === 'created') view.renderAdd([projectName, res._id]);          
        })
        .catch(function(err) {
          view.renderMessage(err.message);
        });
    },
    removeProject: function(id) {
      model.removeProject(id)
        .then(id => {
          view.renderRemove(id);
        }) 
        .catch(function(err) {
          view.renderMessage(err.message);
        });
    }
  }

  octopus.init();
})();