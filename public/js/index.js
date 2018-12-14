(function() {
  const model = {    
    init: function() {
      return fetch('/api/projects')
        .then(function(res) {
          return res.json();
        })
        .then(function(res) {
          this.projects = [...res];
        })
        .catch(function(err) {
          throw new Error('oops something went wrong');
        });
    },
    getProjects: function() {
      return this.projects;
    },
    addProject: function(projectName) {
      // da posalje na api novi projekat
      // ako Ok --> doda projekat u this.projects
      // ako fail --> ???
      return fetch('/api/projects', { method: 'POST' })
        .then(res => res.json())
        .then(res => {
          this.projects.push(res);
          return res;
        })
        .catch(err => {
          throw new Error('failed to add project');
        });
    },
    removeProject: function(projectName) {
      // da posalje delete req na api
      // ako delete uspesan da izbrise projekat iz this.projects
      // ako delete fail ---> ??? 
      return fetch(`/api/projects/${projectName}`, { method: 'DELETE' })
        .then(() => {
          this.projects = this.projects.filter(project => project !== projectName);
          return projectName;
        })
        .catch(error => {
          throw new Error('failed to remove project');
        });
    }
  }
  const view = {
    init: function() {
      
      // dom
      this.main = document.getElementsByTagName('main')[0];
      this.divLoading = document.getElementById('loading-div');
      this.indexContent = document.getElementsByClassName('index-content')[0];
      this.projects = document.getElementsByClassName('projects')[0];

    },
    _createProjectElm: function(project) {
      const container = document.createElement('div');
      container.setAttribute('class', 'project');
      container.setAttribute('id', project.name + '-p');

      const a = document.createElement('a');
      a.setAttribute('href', `/${project.name}`);
      a.innerText = project.name;

      const btn = document.createElement('button');
      btn.addEventListener('click', octopus.removeProject(project.name));

      container.appendChild(a);
      container.appendChild(btn);
    },      
    render: function() {
      this.divLoading.style.display = 'none';
      this.indexContent.style.display = '';

      const offset = document.getElementsByClassName('project').length;
      const projects = octopus.getProjects(offset);    

      // append project to dom
      projects.forEach(function(project) {
        let projectElement = _createProjectElm(project);
        this.projects.appendChild(projectElement);
      });
    },
    renderAdd: function(projectName) {},
    renderRemove: function(projectName) {
      const project = document.getElementById(projectName + '-p');
      
      octopus.removeProject(projectName)
        .then(function() {          
          document.removeEventListener('click', octopus.removeProject);
          this.projects.removeChild(project);
        })
        .catch(function(error) {
          console.error(error.message);
        });
    },
    renderErrorScreen: function(message) {
      // da kreira div element sa paragraph ---> message
    }
  }
  const octopus = {
    init: function() {
      view.init();      
      model.init()
        .then(view.render())
        .catch(function(err) {
          view.renderErrorScreen(err.message);
        });
    },
    getProjects: function() {
      model.getProjects();
    },
    addProject: function(projectName) {
      model.addProject(projectName)
        .then(view.renderAdd(addedProject))
        .catch(function(err) {
          console.error(err.message);
        });
    },
    removeProject: function(projectName) {
      model.removeProject(projectName)
        .then(view.renderRemove(removedProject))
        .catch(function(err) {
          console.error(err.message);
        })
    }
  }

  octopus.init();
})();

// temp code

const deleteProject = () => {
  const deleteInput = document.getElementById('delete_project').value;

  fetch(`api/projects/${deleteInput}`, {
    method: 'DELETE'
  }).then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err.message));
}