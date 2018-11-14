import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Col, ButtonGroup, Button, Icon, FormGroup } from 'patternfly-react';
import { composeValidators } from '../helpers';

import './array-field-style.scss';

const ArrayItem = ({
  renderForm,
  fields,
  fieldKey,
  fieldIndex,
  name,
  remove,
}) => (
  <div className="final-form-array-group">
    <Col xs={11} className="final-form-array-item">
      { renderForm(fields.map((field) => {
                  const itemName = field.name
                      ? field.name.substring(field.name.lastIndexOf('.') + 1)
                      : `${fieldKey}[${fieldIndex}]`;
                  const fieldName = `${name}${itemName && itemName !== 'items' ? itemName : ''}`;
                  return { ...field, name: fieldName, key: name };
              })) }
    </Col>
    <Col xs={1} className="final-form-group-controls">
      <ButtonGroup className="pull-right">
        <Button type="button" bsStyle="danger" onClick={() => remove(fieldIndex)}><Icon name="close" /></Button>
      </ButtonGroup>
    </Col>
  </div>
);

ArrayItem.propTypes = {
  renderForm: PropTypes.func.isRequired,
  fieldKey: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  fieldIndex: PropTypes.number.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object),
  remove: PropTypes.func.isRequired,
};

const DynamicArray = ({
  fieldKey,
  validate,
  title,
  description,
  renderForm,
  fields,
  itemDefault,
}) => (
  <FieldArray key={fieldKey} validate={validate} name={fieldKey}>
    { ({ fields: { map, remove, push }, meta: { error, dirty } }) => (
      <Fragment>
        { title && <Col xs={12}><h3>{ title }</h3></Col> }
        { description && <Col xs={12}><p>{ description }</p></Col> }
        { map((name, index) => (
          <ArrayItem
            key={`${name}-${index}`}
            fields={fields}
            name={name}
            fieldKey={fieldKey}
            fieldIndex={index}
            renderForm={renderForm}
            remove={remove}
          />)) }
        { dirty && error && typeof error === 'string' && <p>{ error }</p> }
        <Col xs={12} className="final-form-array-add-container">
          <FormGroup>
            <ButtonGroup className="pull-right">
              <Button type="button" variant="link" onClick={() => push(itemDefault)}>
                <Icon type="fa" name="plus" />
              </Button>
            </ButtonGroup>
          </FormGroup>
        </Col>
      </Fragment>
      ) }
  </FieldArray>
);

DynamicArray.propTypes = {
  fieldKey: PropTypes.string,
  validate: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  renderForm: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object),
  itemDefault: PropTypes.any
};

const FixedArrayField = ({ title, description, fields, renderForm, additionalItems }) => {
  return (
      <Fragment>
          { title && <Col xs={12}><h3>{ title }</h3></Col> }
          { description && <Col xs={12}><p>{ description }</p></Col> }
          { renderForm(fields) }
          { renderForm([ additionalItems ]) }
      </Fragment>
  );
};

FixedArrayField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  renderForm: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  additionalItems: PropTypes.object.isRequired
};

export const renderArrayField = (props, { hasFixedItems, renderForm }) => {
  const { key, validate, ...rest } = props;
  return (
      <Field name={ key } key={ key } subscription={ { pristine: true, error: true } }>
          { () => hasFixedItems ? <FixedArrayField { ...props } renderForm={ renderForm } /> : (
              <DynamicArray
                  renderForm={ renderForm }
                  validate={ composeValidators(...validate || []) }
                  fieldKey={ key }
                  { ...rest }
              />
          ) }
      </Field>
  );
};
renderArrayField.propTypes = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  fields: PropTypes.array.isRequired,
  validate: PropTypes.array,
  itemDefault: PropTypes.any
};
renderArrayField.defaultProps = {
  validate: []
};