import { JsonSchema7 } from '@jsonforms/core';
import { getData, getSchema, getUiSchema } from '@jsonforms/core';
import { Property } from '@jsonforms/material-tree-renderer';

export interface TreeEditorProps {
  uischema: any;
  schema: any;
  rootData: any;
  filterPredicate: any;
  labelProvider: any;
  imageProvider: any;
  saveable: any;
}

export interface LabelDefinition {
  /** A constant label value displayed for every object for which this label definition applies. */
  constant?: string;
  /** The property name that is used to get a variable part of an object's label. */
  property?: string;
}

export const calculateLabel = (labels) =>
  (schema: JsonSchema7) => (element: Object): string => {

    if (labels !== undefined && labels[schema.$id] !== undefined) {

      if (typeof labels[schema.$id] === 'string') {
        // To be backwards compatible: a simple string is assumed to be a property name
        console.log('element', element);
        return element[labels[schema.$id]];
      }
      if (typeof labels[schema.$id] === 'object') {
        const info = labels[schema.$id] as LabelDefinition;
        let label;
        if (info.constant !== undefined) {
          label = info.constant;
        }
        if (info.property !== undefined && element[info.property] !== undefined) {
          label = label === undefined ?
            element[info.property] :
            `${label} ${element[info.property]}`;
        }
        if (label !== undefined) {
          return label;
        }
      }
    }

    const namingKeys = Object
      .keys(schema.properties)
      .filter(key => key === '$id' || key === 'name');
    if (namingKeys.length !== 0) {
      return element[namingKeys[0]];
    }

    return JSON.stringify(element);
  };

export const filterPredicate = (modelMapping) => (data: Object) => {
  return (property: Property): boolean => {
    if (modelMapping !== undefined && modelMapping.mapping !== undefined) {
      if (data[modelMapping.attribute]) {
        if (property.schema.hasOwnProperty('$id')) {
          return property.schema['$id'] === modelMapping.mapping[data[modelMapping.attribute]];
        } else if (property.schema.hasOwnProperty('id')) {
          return property.schema['id'] === modelMapping.mapping[data[modelMapping.attribute]];
        }
      }
      return true;
    }

    return false;
  };
};

export const mapStateToTreeEditorProps = (state, ownProps) => {
  return {
    uischema: getUiSchema(state),
    schema: getSchema(state),
    filterPredicate: ownProps.filterPredicate,
    labelProvider: ownProps.labelProvider,
    imageProvider: ownProps.imageProvider,
    rootData: getData(state)
  };
};
