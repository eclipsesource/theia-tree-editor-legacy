import { defaultProps } from 'recompose';
import { combineReducers, createStore, Store } from 'redux';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';
import {
  Actions,
  jsonformsReducer,
  RankedTester
} from '@jsonforms/core';
import {
  treeWithDetailReducer,
  findAllContainerProperties,
  setContainerProperties
} from '@jsonforms/material-tree-renderer';
import { calculateLabel, filterPredicate } from 'tree-editor-extension/lib/browser';

import schema from './schema';

import {labels, modelMapping, uischemas} from './config';
import VeggieEditor from './VeggieEditor';
import {calculateLabel} from "../../tree-editor-extension/src/browser";
import {filterPredicate} from 'tree-editor-extension';

const imageGetter = (schemaId: string) => 'icon-test';

export const initStore = async() => {
  const uischema = {
    'type': 'TreeWithDetail',
    'scope': '#'
  };
  const renderers: { tester: RankedTester, renderer: any}[] = materialRenderers;
  const fields: { tester: RankedTester, field: any}[] = materialFields;
  const jsonforms: any = {
    jsonforms: {
      renderers,
      fields,
      treeWithDetail: {
        // imageMapping: imageProvider,
        labelMapping: labels,
        modelMapping,
        uiSchemata: uischemas
      }
    }
  };

  const store: Store<any> = createStore(
    combineReducers({
        jsonforms: jsonformsReducer()
      }
    ),
    { ...jsonforms }
  );

  store.dispatch(Actions.init({}, schema, uischema));

  return store;
};

export default defaultProps(
  {
    'filterPredicate': filterPredicate,
    'labelProvider': calculateLabel(labels),
    'imageProvider': imageGetter
  }
)(VeggieEditor);
