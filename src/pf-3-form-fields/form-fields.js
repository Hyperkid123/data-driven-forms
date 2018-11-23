import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormControl, HelpBlock, Checkbox, Radio } from 'patternfly-react';
import ReactSelect from 'react-select';
import { components } from '../constants';
import NestedForm from '../shared-components/sub-form';
import FormGroupWrapper from '../shared-components/form-group-wrapper';
import { validationError } from '../helpers';
import { __ } from '../global-functions';
import MultipleChoiceList from './multiple-choice-list';
import ComponentType from '../renderer-context';
import Condition from '../shared-components/condition';
import customStyles from './select-styles';

const selectValue = option => option.sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' })).map(item => item.value);

const selectComponent = ({
  componentType,
  input,
  options,
  isReadOnly,
  isDisabled,
  invalid,
  placeholder,
  isRequired,
  label,
  isSearchable,
  ...rest
}) => ({
  [components.TEXT_FIELD]: () => <FormControl { ...input } disabled={ isDisabled } readOnly={ isReadOnly } { ...rest } />,
  [components.TEXTAREA_FIELD]: () =>
    <FormControl { ...input } disabled={ isDisabled } readOnly={ isReadOnly } { ...rest } componentClass="textarea" />,
  [components.CHECKBOX]: () => <Checkbox { ...input }>{ label }</Checkbox>,
  [components.RADIO]: () => options.map(option => (
    <Field
      key={ `${input.name}-${option.value}` }
      name={ input.name }
      value={ option.value }
      type="radio"
      render={ ({ input }) => (
        <Radio { ...input } onChange={ () => { input.onChange(option.value); } }>{ option.label }</Radio>) }
    />
  )),
  [components.SELECT_COMPONENT]: () => (
    <ReactSelect
      className={ `final-form-select ${invalid ? 'has-error' : ''}` }
      styles={ customStyles }
      { ...input }
      options={options.filter(option => option.hasOwnProperty('value') && option.value !== null)} // eslint-disable-line
      placeholder={ placeholder || __('Please choose') }
      value={ options.filter(({ value }) => rest.multi ? input.value.includes(value) : value === input.value) }
      isMulti={ rest.multi }
      isSearchable={ !!isSearchable }
      isClearable={ false }
      hideSelectedOptions={ false }
      closeMenuOnSelect={ !rest.multi }
      noOptionsMessage={ () => __('No option found') }
      onChange={ option =>
        input.onChange(rest.multi ? selectValue(option) : option ? option.value : undefined) } // eslint-disable-line no-nested-ternary
      { ...rest }
    />),
})[componentType];

const renderHelperText = (error, helperText) => (error // eslint-disable-line no-nested-ternary
  ? <HelpBlock>{ __(error) }</HelpBlock>
  : helperText ? <HelpBlock>{ __(helperText) }</HelpBlock> : null);

const FinalFormField = ({
  meta,
  validateOnMount,
  label,
  helperText,
  description,
  hideLabel,
  isVisible,
  ...rest
}) => {
  const invalid = validationError(meta, validateOnMount);
  return (
    <ComponentType.Consumer>
      { ({ commonComponents: { Col, FormGroup }}) => (
        <FormGroup validationState={ invalid ? 'error' : null }>
          { label &&
          <Col md={ 2 } componentClass="label" className="control-label">
            { !hideLabel && __(label) }
          </Col> }
          <Col md={ 10 }>
            { selectComponent({ ...rest, invalid, label })() }
            { description && <HelpBlock style={{ color: '#767676' }}>{ description }</HelpBlock> }
            { renderHelperText(invalid && meta.error, helperText) }
          </Col>
        </FormGroup>
      ) }
    </ComponentType.Consumer>
  );
};

FinalFormField.propTypes = {
  meta: PropTypes.object,
  validateOnMount: PropTypes.bool,
  label: PropTypes.string,
  helperText: PropTypes.string,
  description: PropTypes.string,
  hideLabel: PropTypes.bool,
  isVisible: PropTypes.bool,
};

const CheckboxGroupField = ({ options, ...rest }) =>
  (options ? <MultipleChoiceList options={ options } { ...rest } />
    : (
      <FormGroupWrapper { ...rest } type="checkbox" formField={ FinalFormField } componentType={ components.CHECKBOX } />
    ));

const fieldMapper = type => ({
  [components.RADIO]: props => <FormGroupWrapper { ...props } formField={ FinalFormField } />,
  [components.CHECKBOX]: props => <CheckboxGroupField { ...props } />,
  [components.SELECT_COMPONENT]: props => <FormGroupWrapper { ...props } formField={ FinalFormField } />,
  [components.TEXTAREA_FIELD]: props => <FormGroupWrapper { ...props } formField={ FinalFormField } />,
  [components.TEXT_FIELD]: props => <FormGroupWrapper { ...props } formField={ FinalFormField } />,
  [components.SUB_FORM]: props => <NestedForm { ...props } />,
})[type];

const FormConditionWrapper = ({ condition, children }) => (condition ? (
  <Condition { ...condition }>
    { children }
  </Condition>
) : children);

const FieldInterface = ({
  meta,
  dataType,
  condition,
  validate,
  componentType,
  initialKey,
  ...props
}) => (
  <FormConditionWrapper condition={ condition }>
    { fieldMapper(componentType)({
      ...props,
      validate: Array.isArray(validate) ? validate : [ validate ],
      componentType,
      id: props.id || props.name,
    }) }
  </FormConditionWrapper>
);

FieldInterface.propTypes = {
  meta: PropTypes.object,
  condition: PropTypes.shape({
    when: PropTypes.string.isRequired,
    is: PropTypes.oneOfType([ PropTypes.array, PropTypes.string ]).isRequired,
  }),
  validate: PropTypes.oneOfType([ PropTypes.array, PropTypes.func ]),
  componentType: PropTypes.oneOf([
    components.RADIO,
    components.CHECKBOX,
    components.SELECT_COMPONENT,
    components.TEXTAREA_FIELD,
    components.TEXT_FIELD,
    components.SUB_FORM,
  ]).isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  dataType: PropTypes.any,
  initialKey: PropTypes.any,
};

export const TextField = props => <FieldInterface { ...props } componentType={ components.TEXT_FIELD } />;
export const TextareaField = props => <FieldInterface { ...props } componentType={ components.TEXTAREA_FIELD } />;
export const SelectField = props => <FieldInterface { ...props } componentType={ components.SELECT_COMPONENT } />;
export const RadioGroup = props => <FieldInterface { ...props } componentType={ components.RADIO } />;
export const CheckboxGroup = props => <FieldInterface { ...props } componentType={ components.CHECKBOX } />;
export const SubForm = props => <FieldInterface { ...props } componentType={ components.SUB_FORM } />;
