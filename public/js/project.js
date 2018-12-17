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
    }
  };
  const view = {
    init: function() {
      // dom
      this.title = document.getElementsByTagName('title')[0];
      
      this.title.innerText = location.pathname.slice(1);
    },
    render: function() {}
  };
  const octopus = {
    init: function() {
      view.init();
      model.init()
      .then(() => console.log(model.issues));
    }
  };

  octopus.init();
})();