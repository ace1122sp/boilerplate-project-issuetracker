(function() {
  const model = {    
    init: function() {
      fetch('/api/projects');
    },
    getProjects: function() {}
  }
  const view = {
    init: function() {
      
      // dom
      this.main = document.getElementsByTagName('main')[0];
      this.divLoading = document.getElementById('loading-div');
      this.indexContent = document.getElementsByClassName('index-content')[0];
      this.projects = document.getElementsByClassName('projects')[0];

    },
    render: function() {
      this.divLoading.style.display = 'none';
      this.indexContent.style.display = '';

      const offset = document.getElementsByClassName('project').length;
      const projects = octopus.getProjects(offset);

      // create project elements
      const createProjectElm = function(project) {}      

      // append project to dom
      projects.forEach(function(project) {
        let projectElement = createProjectElm(project);
        this.projects.appendChild(projectElement);
      });
    }
  }
  const octopus = {
    init: function() {
      view.init();      
    },
    getProjects: function(offset) {
      model.getProjects(offset);
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