export default {
  fields: [{
    title: 'A list of strings',
    key: 'listOfStrings',
    component: 'field-array',
    itemDefault: 'bazinga',
    validate: [],
    fields: [{
      component: 'text-field',
      dataType: 'string',
      type: 'text',
      validate: [],
      initialKey: 'items',
      name: 'listOfStrings.items',
      default: [ 'bazinga' ],
      autoFocus: false
    }]
  }, {
    key: 'multipleChoicesList',
    title: 'A multiple choices list',
    name: 'multipleChoicesList',
    label: 'A multiple choices list',
    component: 'checkbox-field',
    dataType: 'string',
    validate: [],
    options: [{
      label: 'foo',
      value: 'foo'
    }, {
      value: 'bar',
      label: 'bar'
    }, {
      value: 'fuzz',
      label: 'fuzz'
    }, {
      value: 'qux',
      label: 'qux'
    }
    ],
    type: 'checkbox'
  }, {
    key: 'fixedItemsList',
    title: 'A list of fixed items',
    component: 'fixed-list',
    fields: [{
      name: 'fixedItemsList.items.0',
      dataType: 'string',
      label: 'A string value',
      component: 'textarea-field',
      default: 'lorem ipsum',
      validate: []
    }, {
      name: 'fixedItemsList.items.1',
      dataType: 'boolean',
      label: 'a boolean value',
      validate: [],
      component: 'select-field',
      options: [{
        disabled: true,
        label: 'Please Choose'
      }, {
        label: 'Yes',
        value: true
      }, {
        label: 'No',
        value: false
      }]
    }],
    additionalItems: {
      key: 'fixedItemsList.additionalItems',
      validate: [],
      component: 'field-array',
      fields: [{
        initialKey: 'items',
        dataType: 'number',
        label: 'Additional item',
        component: 'text-field',
        type: 'number',
        validate: [],
        autoFocus: false,
        name: 'fixedItemsList.additionalItems.items',
        title: 'Additional item'
      }]
    }
  }, {
    key: 'minItemsList',
    component: 'field-array',
    title: 'A list with a minimal number of items',
    validate: [{
      type: 'required-validator'
    }, {
      type: 'min-items-validator',
      treshold: 3
    }],
    fields: [{
      label: 'name',
      initialKey: 'name',
      name: 'minItemsList.name',
      dataType: 'string',
      default: 'Default name',
      component: 'text-field',
      type: 'text',
      validate: [],
      autoFocus: false
    }],
    itemDefault: {
      name: 'Default name'
    }
  }, {
    key: 'defaultsAndMinItems',
    component: 'field-array',
    title: 'List and item level defaults',
    itemDefault: 'unidentified',
    validate: [{
      type: 'min-items-validator',
      treshold: 5
    }],
    fields: [{
      dataType: 'string',
      component: 'text-field',
      type: 'text',
      validate: [],
      initialKey: 'items',
      name: 'defaultsAndMinItems.items',
      default: [ 'unidentified' ],
      autoFocus: false
    }]
  }, {
    key: 'nestedList',
    name: 'nestedList',
    title: 'Nested list',
    component: 'field-array',
    fields: [{
      title: 'Inner list',
      component: 'field-array',
      validate: [],
      key: 'nestedList',
      fields: [{
        dataType: 'string',
        component: 'text-field',
        validate: [],
        type: 'text',
        initialKey: 'items',
        name: 'nestedList.items',
        default: 'lorem ipsum',
        autoFocus: false
      }]
    }]
  }, {
    component: 'field-array',
    key: 'unorderable',
    title: 'Unorderable items',
    validate: [],
    fields: [{
      dataType: 'string',
      component: 'text-field',
      type: 'text',
      validate: [],
      initialKey: 'items',
      name: 'unorderable.items',
      default: [ 'lorem ipsum' ],
      autoFocus: false
    }],
    itemDefault: 'lorem ipsum'
  }, {
    key: 'unremovable',
    title: 'Unremovable items',
    component: 'field-array',
    validate: [],
    fields: [{
      dataType: 'string',
      component: 'text-field',
      type: 'text',
      validate: [],
      name: 'unremovable.items',
      initialKey: 'items',
      default: [ 'lorem ipsum' ],
      autoFocus: false
    }],
    itemDefault: 'lorem ipsum'
  }, {
    key: 'noToolbar',
    title: 'No add, remove and order buttons',
    component: 'field-array',
    validate: [],
    fields: [{
      dataType: 'string',
      component: 'text-field',
      type: 'text',
      validate: [],
      name: 'noToolbar.items',
      initialKey: 'items',
      default: [ 'lorem ipsum' ],
      autoFocus: false
    }],
    itemDefault: 'lorem ipsum'
  }, {
    key: 'fixedNoToolbar',
    title: 'Fixed array without buttons',
    component: 'fixed-list',
    fields: [{
      dataType: 'number',
      name: 'fixedNoToolbar.items.0',
      label: 'A number',
      default: 42,
      component: 'text-field',
      type: 'number',
      validate: []
    }, {
      name: 'fixedNoToolbar.items.1',
      dataType: 'boolean',
      label: 'A boolean',
      component: 'checkbox-field',
      type: 'checkbox',
      validate: [],
      default: false
    }],
    additionalItems: {
      component: 'field-array',
      key: 'fixedNoToolbar.additionalItems',
      validate: [],
      fields: [{
        dataType: 'string',
        component: 'text-field',
        label: 'A string',
        title: 'A string',
        initialKey: 'items',
        name: 'fixedNoToolbar.additionalItems.items',
        autoFocus: false,
        default: 'lorem ipsum',
        type: 'text',
        validate: []
      }]
    }
  }]
};
