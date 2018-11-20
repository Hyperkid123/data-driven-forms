import { components, validators } from '../../constants';
import { neededAttributes, componentMap } from './constants';

const miqParser = (inputSchema, neededFieldAttributes = neededAttributes, componentsMap = componentMap) => {
  const title = inputSchema.label;
  const key = inputSchema.id;
  const tabs = inputSchema.content[0].dialog_tabs;
  const formTabs = [];
  const defaultValues = {};
  const { description } = inputSchema;

  tabs.forEach((tab) => {
    const groups = [];
    tab.dialog_groups.forEach((group) => {
      const fieldsArray = [];
      group.dialog_fields.forEach((field) => {
        const newField = {};

        neededFieldAttributes.forEach((info) => {
          const attribute = Array.isArray(info) ? info[0] : info;
          const convertedAttribute = Array.isArray(info) ? info[1] : info;
          newField[convertedAttribute] = field[attribute];
        });

        newField.autofocus = false;

        if (field.validator_type) {
          newField.validate = [{
            type: validators.PATTERN_VALIDATOR,
            pattern: field.validator_rule,
          }];
        }

        newField.component = componentsMap[field.type];

        if (field.default_value) {
          if (newField.component === components.CHECKBOX) {
            defaultValues[field.name] = 'true';
          } else {
            defaultValues[field.name] = field.default_value;
          }
        }

        newField.options = [];
        if (Array.isArray(field.values)) {
          field.values.forEach((option) => {
            const optionObject = { label: option[1], value: option[0] };
            if (option[0] === null && field.required) {
              optionObject.disabled = true;
            }

            newField.options.push(optionObject);
          });
        }

        fieldsArray.push(newField);
      });
      groups.push({
        title: group.label,
        key: group.id,
        fields: fieldsArray,
        component: components.SUB_FORM,
      });
    });
    formTabs.push({
      title: tab.label,
      description: tab.description,
      key: tab.id,
      fields: groups,
      component: components.TAB_ITEM,
    });
  });

  const schema = {
    title,
    description,
    fields: {
      fields: formTabs,
      component: components.TABS,
      key },
  };
  return {
    schema,
    defaultValues,
  };
};

export default miqParser;
