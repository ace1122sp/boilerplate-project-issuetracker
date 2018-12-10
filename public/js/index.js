(function() {
  const model = {    
    init: function() {
      fetch('/api/projects');
    }
  }
  const view = {
    init: function() {},
    render: function() {}
  }
  const octopus = {
    init: function() {}
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