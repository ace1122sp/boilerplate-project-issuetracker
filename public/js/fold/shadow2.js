function filterIssues() {
  const wrapper = document.createElement('div');
  const id = 'filter-issues-div';

  wrapper.setAttribute('id', id);
  wrapper.setAttribute('class', 'form-section');

  const childElements = [];

  const h3 = document.createElement('h3');
  h3.innerText = 'Filter Issues';

  childElements.push(h3);

  const form = document.createElement('form'); // refactor this      
  form.setAttribute('id', 'filter-issues-form');

  form.addEventListener('submit', e => {
    e.preventDefault();

    octopus.getIssues(this._composeReqBody(e.target)); /// RESUME FROM HERE

    // remove add form
    this.removeSectionsByClass('form-section');
  });


  // add input elements
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

  const submitBtn = _generateControlButtons({ attr: 'type', attrVal: 'submit', innerText: 'filter' });
  form.appendChild(submitBtn);

  childElements.push(form);

  const cancelBtn = _generateControlButtons('cancel');
  cancelBtn.addEventListener('click', () => {
    this.removeSectionsByClass('form-section');
  });

  childElements.push(cancelBtn);

  // append child elements to wrapper
  childElements.forEach(elm => {
    wrapper.appendChild(elm);
  });

  // render filter form
  this.main.appendChild(wrapper);
}