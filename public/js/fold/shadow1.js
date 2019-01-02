function addForm() {
  const wrapper = document.createElement('div');
  const id = 'add-issue-section';

  wrapper.setAttribute('id', id);
  wrapper.setAttribute('class', 'form-section');

  const childElements = [];

  const h3 = document.createElement('h3');
  h3.innerText = 'Add Issue';

  childElements.push(h3);

  const form = document.createElement('form'); // refactor this      
  form.setAttribute('id', 'add-issue-form');

  form.addEventListener('submit', e => {
    e.preventDefault();

    octopus.addIssue(this._composeReqBody(e.target)); /// RESUME FROM HERE

    // remove add form
    this.removeSectionsByClass('form-section');
  });

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

  const _generateControlButtons = val => {
    const btn = document.createElement('button');
    btn.innerText = val;

    return btn;
  }
  // add submit button to form
  const submitBtn = _generateControlButtons({ attr: 'type', attrVal: 'submit', innerText: 'add' });
  form.appendChild(submitBtn);

  childElements.push(form);

  // cancel and close form
  const cancelBtn = _generateControlButtons('cancel');
  cancelBtn.addEventListener('click', () => {
    this.removeSectionsByClass('form-section');
  });

  childElements.push(cancelBtn);

  // append child elements to wrapper
  childElements.forEach(elm => {
    wrapper.appendChild(elm);
  });

  // render 
  this.main.appendChild(wrapper);
}