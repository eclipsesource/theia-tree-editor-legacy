# Theia Tree Editor

The Theia Tree Editor showcases the integration of [JSON Forms](https://github.com/eclipsesource/jsonforms) with [Theia](https://github.com/theia-ide/theia).

## Getting started

    yarn install
    yarn prepare
    cd theia-tree-editor-extension
    npm pack

> Use the generated module in your Theia application

# How To Create A Sample Editor Application with Theia Tree Editor Extension

> TreeEditorOpenHandler shouldn't be used as stand-alone extension.


## Prerequisites

> You’ll need node in version 8:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
    nvm install 8

> and yarn

    npm install -g yarn

> Also make sure your python --version points to a Python 2.x installation.

## Project Layout

> Use the theia extension generator for project scaffolding

    npm install -g yo generator-theia-extension
    mkdir task-editor
    cd task-editor
    yo theia-extension task-editor

> Open a new terminal and clone the github repo. Create a tarball from theia-tree-editor-extension

    git clone git@github.com:eclipsesource/coffee-editor.git
    cd theia-tree-editor
    yarn install
    yarn prepare
    cd theia-tree-editor-extension
    npm pack

> Go back to your task-editor directory

    cd task-editor-extension

> Move the generated tarball to the task-editor-extension working directory and install dependencies.

**Add the following dependencies in the package.json of the task-editor-extension**

```js

  "dependencies": {
    "@jsonforms/core": "^2.0.2",
    "@jsonforms/editor": "^2.0.2",
    "@jsonforms/material-renderers": "^2.0.2",
    "@material-ui/core": "^1.2.1",
    "@material-ui/icons": "^1.0.0",
    "@theia/core": "latest",
    "json-refs": "^3.0.4",
    "material-ui-pickers": "1.0.0-rc.9",
    "react": "^16.4.0",
    "react-dom": "^16.4.0",
    "react-redux": "^4.4.9",
    "recompose": "^0.27.1",
    "redux": "^3.7.2",
    "theia-tree-editor-extension": "./theia-tree-editor-extension-1.0.0.tgz"
  }

```

**You can use the following `tsconfig.ts`**

```js
{
    "compilerOptions": {
        "declaration": true,
        "noImplicitAny": false,
        "noEmitOnError": false,
        "noImplicitThis": true,
        "noImplicitReturns": true,
        "noUnusedLocals": true,
        "strictNullChecks": false,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "downlevelIteration": true,
        "module": "esnext",
        "moduleResolution": "node",
        "target": "es5",
        "jsx": "react",
        "lib": [
            "es6",
            "dom"
        ],
        "sourceMap": true,
        "suppressImplicitAnyIndexErrors": true,
        "rootDir": "src",
        "outDir": "lib",
        "keyofStringsOnly": true
    },
    "exclude": [
        "node_modules",
        "lib"
    ]
}
```
> Now install all the dependencies

    yarn workspace task-editor-extension add ./theia-tree-editor-extension-1.0.0.tgz
    cd ..
    yarn install

## Create Your Custom Editor

    cd task-editor-extension

> Create `config.ts`,`schema.ts` and `uischemata.ts` files

**config.ts:**
```js
import { taskView, userGroupView, userView } from './uischemata';

export const labelProvider = {
  '#user': 'name',
  '#userGroup': 'label',
  '#task': 'name',
};

export const imageProvider = {
  '#task': 'task',
  '#user': 'user',
  '#userGroup': 'userGroup'
};

export const modelMapping = {
  'attribute': '_type',
  'mapping': {
    'task': '#task',
    'user': '#user',
    'userGroup': '#userGroup'
  }
};

export const detailSchemata = {
  '#task': taskView,
  '#user': userView,
  '#userGroup': userGroupView,
};
```
**schema.ts:**
```js
export const taskSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema',
  'type': 'object',
  '$id': '#userGroup',
  'properties': {
    '_type': {
      'type': 'string',
      'default': 'userGroup'
    },
    'label': {
      'type': 'string'
    },
    'users': {
      'type': 'array',
      'items': {
        '$ref': '#/definitions/user'
      }
    }
  },
  'additionalProperties': false,
  'definitions': {
    'task': {
      'type': 'object',
      '$id': '#task',
      'properties': {
        '_type': {
          'type': 'string',
          'default': 'task'
        },
        'name': {
          'type': 'string'
        },
        'dueDate': {
          'type': 'string',
          'format': 'date'
        },
        'done': {
          'type': 'boolean'
        },
        'priority': {
          'type': 'string',
          'enum': ['High', 'Medium', 'Low'],
          'default': 'Medium'
        },
        'subTasks': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/task'
          }
        }
      },
      'required': [ 'name', 'priority' ],
      'additionalProperties': false
    },
    'user': {
      'type': 'object',
      '$id': '#user',
      'properties': {
        '_type': {
          'type': 'string',
          'default': 'user'
        },
        'name': {
          'type': 'string'
        },
        'birthday': {
          'type': 'string',
          'format': 'date'
        },
        'nationality': {
          'type': 'string',
          'enum': ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        },
        'tasks': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/task'
          }
        }
      },
      'required': [ 'name' ],
      'additionalProperties': false
    }
  }
};
```
**uischemata.ts:**
```js
export const userView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/name'
    },
    {
      'type': 'Control',
      'scope': '#/properties/birthday'
    },
    {
      'type': 'Control',
      'scope': '#/properties/nationality'
    }
  ]
};

export const userGroupView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/label'
    }
  ]
};

export const taskView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/name'
    },
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'scope': '#/properties/done'
        },
        {
          'type': 'Control',
          'scope': '#/properties/dueDate'
        }
      ]
    },
    {
      'type': 'Control',
      'scope': '#/properties/priority'
    }
  ]
};
```
> You have the required schema and mapping files that are needed for JSONForms Tree Renderer. Now create your React Component that uses JSONForms Tree Renderer. Name the file as `App.tsx`

```js
import * as React from 'react';
import { connect } from 'react-redux';
import { TreeRenderer } from '@jsonforms/editor';
import { getSchema, getUiSchema } from '@jsonforms/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#FFFFFF'
    },
    background: {
      'default': '#1e1e1e'
    }
  },
  typography: {
    fontSize: 10
  }
});

interface AppProps {
  uischema: any;
  schema: any;
  rootData: any;
  filterPredicate: any;
  labelProvider: any;
  imageProvider: any;
}

class App extends React.Component<AppProps, {}> {

  render() {
    const { filterPredicate, labelProvider, imageProvider, uischema, schema } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <TreeRenderer
            uischema={uischema}
            schema={schema}
            filterPredicate={filterPredicate}
            labelProvider={labelProvider}
            imageProvider={imageProvider}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    uischema: getUiSchema(state),
    schema: getSchema(state),
    filterPredicate: ownProps.filterPredicate,
    labelProvider: ownProps.labelProvider,
    imageProvider: ownProps.imageProvider
  };
};

export default connect(mapStateToProps)(App);
```

> After creating your React application, now you need to implement your custom open handler for your editor.
Delete `task-editor-contribution.ts`. You are not going to need it for this sample app.
Create a new file called `task-editor.ts`

**task-editor.ts:**

```js
import { injectable } from "inversify";
import { FrontendApplication } from '@theia/core/lib/browser';
import { SelectionService, ResourceProvider } from '@theia/core/lib/common';
import { combineReducers, createStore, Store } from 'redux';
import { detailSchemata, imageProvider, labelProvider, modelMapping } from './config';
import { taskSchema } from './schema';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';
import {
  Actions,
  jsonformsReducer,
  JsonSchema4,
  RankedTester
} from '@jsonforms/core';
import {
  editorReducer,
  findAllContainerProperties,
  Property,
  setContainerProperties
} from '@jsonforms/editor';
import {
  TreeEditorOpenHandler
} from 'theia-tree-editor-extension/lib/browser/theia-tree-editor-open-handler';
import * as JsonRefs from 'json-refs';
import App from './App';
import { defaultProps } from "recompose";
import * as _ from 'lodash';

interface LabelDefinition {
  /** A constant label value displayed for every object for which this label definition applies. */
  constant?: string;
  /** The property name that is used to get a variable part of an object's label. */
  property?: string;
}

const filterPredicate = (data: Object) => {
  return (property: Property): boolean => {
    if (!_.isEmpty(modelMapping) &&
      !_.isEmpty(modelMapping.mapping)) {
      if (data[modelMapping.attribute]) {
        return property.schema.id === modelMapping.mapping[data[modelMapping.attribute]];
      }
      return true;
    }

    return false;
  };
};
const calculateLabel =
  (schema: JsonSchema4) => (element: Object): string => {

    if (!_.isEmpty(labelProvider) && labelProvider[schema.id] !== undefined) {

      if (typeof labelProvider[schema.id] === 'string') {
        // To be backwards compatible: a simple string is assumed to be a property name
        return element[labelProvider[schema.id]];
      }
      if (typeof labelProvider[schema.id] === 'object') {
        const info = labelProvider[schema.id] as LabelDefinition;
        let label;
        if (info.constant !== undefined) {
          label = info.constant;
        }
        if (!_.isEmpty(info.property) && !_.isEmpty(element[info.property])) {
          label = _.isEmpty(label) ?
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
      .filter(key => key === 'id' || key === 'name');
    if (namingKeys.length !== 0) {
      return element[namingKeys[0]];
    }

    return JSON.stringify(element);
  };

const imageGetter = (schemaId: string) =>
  !_.isEmpty(imageProvider) ? `icon ${imageProvider[schemaId]}` : '';

const initStore = async() => {
  const uischema = {
    'type': 'MasterDetailLayout',
    'scope': '#'
  };
  const renderers: { tester: RankedTester, renderer: any}[] = materialRenderers;
  const fields: { tester: RankedTester, field: any}[] = materialFields;
  const jsonforms: any = {
    jsonforms: {
      renderers,
      fields,
      editor: {
        imageMapping: imageProvider,
        labelMapping: labelProvider,
        modelMapping,
        uiSchemata: detailSchemata
      }
    }
  };

  const store: Store<any> = createStore(
    combineReducers({
        jsonforms: jsonformsReducer(
          {
            editor: editorReducer
          }
        )
      }
    ),
    {
      ...jsonforms
    }
  );

  const schema = await JsonRefs.resolveRefs(taskSchema)
    .then(
      resolvedSchema => resolvedSchema.resolved,
      err => {
        console.log(err.stack);
        return {};
      });

  store.dispatch(Actions.init({}, schema, uischema));

  store.dispatch(setContainerProperties(
    findAllContainerProperties(schema, schema)));

  return store;
};

const TaskApp = defaultProps(
  {
    'filterPredicate': filterPredicate,
    'labelProvider': calculateLabel,
    'imageProvider': imageGetter
  }
)(App);

@injectable()
export class TaskEditor extends TreeEditorOpenHandler {
  constructor(app: FrontendApplication,
              selectionService: SelectionService,
              resourceProvider: ResourceProvider) {
    super(app, selectionService, resourceProvider, initStore(), TaskApp);
  }
}
```

> We initialize our store with helper functions (filterPredicate, labelProvider, imageProvider) that are required by TreeRenderer Component

> TaskEditor extends its parent class by injecting store (created with `initStore()`) and our EditorComponent (TaskApp is a HOC which takes TreeRenderer as its input) into TreeEditorOpenHandler

> Both arguments will be used to create a Widget to open JSON files by using our React application with its initialized store

> To use stylesheets in your application, create a folder and name it `style` for our example. Create the following files.

**jsoneditor.css:**

```js
:root {
    --jsf-modest-bg-color: #217daf;
    --jsf-border-color: lightgray;
    --jsf-validation-color: #F44336;
}

.tree-class {
    overflow-y: scroll;
}

.array-button {
    margin-right: 0.5em
}

.group.label {
    color: lightgray;
}

.validation_error  {
    color: var(--jsf-validation-color);
}

fieldset {
    margin-bottom: 0.5em;
}

fieldset legend label {
    font-size: 1em;
}

jsf-treeMasterDetail {
    display: flex;
    flex-direction: column;
}
.jsf-treeMasterDetail > .jsf-treeMasterDetail-content {
    display: flex;
    flex-direction: row;
}
.jsf-treeMasterDetail > .jsf-treeMasterDetail-content > * {
    padding: 0.5em;
    border-style: solid;
    border-width: thin;
    border-color: var(--jsf-border-color);
    border-radius: 0.2em;
}
.jsf-treeMasterDetail > .jsf-treeMasterDetail-content > *:first-child {
    margin-right: 0.25em;
}
.jsf-treeMasterDetail-master {
    flex:1;
}
.jsf-treeMasterDetail-detail {
    flex:3;
}
.jsf-treeMasterDetail-master ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    position: relative;
    overflow:hidden;
}
.jsf-treeMasterDetail-master li {
    min-height: 1em;
    position: relative;
    padding-left: 1.5em;
}
.jsf-treeMasterDetail-master li > div {
    display: flex;
    flex-direction: row;
}
.jsf-treeMasterDetail-master li > div > .icon {
    flex-basis: 1em;
    min-height: 1em;
    margin-right: 0.25em;
    background-repeat: no-repeat;
    background-position: center;
}

.jsf-treeMasterDetail-master li.selected > div > .label {
    font-weight: bold;
}
.jsf-treeMasterDetail-master li > div > .label {
    display: flex;
    flex: 1;
    margin-right: 1em;
    min-height: 1.5em;
    color: white;
    align-items: center;
}

.jsf-treeMasterDetail-master li > div > .label > span:first-child:empty {
    background: #ffff00;
    max-height: 1.5em;
}
.jsf-treeMasterDetail-master li > div > .label:hover {
    font-weight: bold;
    cursor: pointer;
    color: white;
    opacity: 0.9;
    background-color: var(--jsf-modest-bg-color);
}
.jsf-treeMasterDetail-master li > div > .label > .add,
.jsf-treeMasterDetail-master li > div > .label > .remove {
    display: none;
    cursor: pointer;
    margin-left: 0.25em;
    font-weight: normal;
    width: inherit;
    height: inherit;
    min-width: unset;
}
.jsf-treeMasterDetail-master li > div > .label:hover > .add,
.jsf-treeMasterDetail-master li > div > .label:hover > .remove {
    display: flex;
    justify-content: center;
}
.jsf-treeMasterDetail-master li > div > .label:hover > .add:hover,
.jsf-treeMasterDetail-master li > div > .label:hover > .remove:hover {
    color: white;
    border-radius: 50%;
}
.jsf-treeMasterDetail-master li::before,
.jsf-treeMasterDetail-master li::after,
.jsf-treeMasterDetail-master ul::after {
    content: '';
    position: absolute;
    left:0.2em;
}
.jsf-treeMasterDetail-master li::before {
    border-top: 1px solid var(--jsf-border-color);
    top:0.5em;
    width: 1em;
}
.jsf-treeMasterDetail-master li::after {
    border-left: 1px solid var(--jsf-border-color);
    height:100%;
    top:-0.6em;
}
.jsf-treeMasterDetail-master ul::after {
    border-left: 1px solid var(--jsf-border-color);
    height: 0.6em;
    bottom: 0;
}
.jsf-treeMasterDetail-master ul:last-child::after {
    display: none;
}
.jsf-treeMasterDetail-master > ul > li::after {
    top:0.5em;
}
.jsf-treeMasterDetail-master > ul > li:last-child::after {
    display: none;
}
.jsf-treeMasterDetail-master > ul > li:only-child::before {
    display: none;
}
.jsf-treeMasterDetail-master > ul > li:only-child {
    padding-left: 0.25em;
}

/* tree master detail create dialog */
.jsf-treeMasterDetail-dialog {
    border-width: medium;
    border-radius: 8px;
    border-color: lightgrey
}
.jsf-treeMasterDetail-dialog-title {
    font-size: large;
}
.jsf-treeMasterDetail-dialog-content {
    display: flex;
    flex-direction: column;
}
.jsf-treeMasterDetail-dialog-button,
.jsf-treeMasterDetail-dialog-createbutton {
    margin-bottom: 5px
}
.jsf-treeMasterDetail-dialog-button {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 0;
}

.jsf-treeMasterDetail-dialog-close {
    width: 100%;
    margin-top: 20px;
}

/* Drag and Drop */
/* Create border for possible drag and drop drop-zones */

.jsf-editor-dnd-target-valid,
.jsf-editor-dnd-target-invalid {
    border-style: dashed;
    border-width: thin;
}

.jsf-editor-dnd-target-valid {
    border-color: rgb(88, 199, 23);
    min-height: 1em;
}

.jsf-editor-dnd-target-invalid {
    border-color: rgb(189, 0, 0);
}

.jsf-editor-dnd-current-target {
    border-width:  medium;
}
```

> You can set the png files that you want to use. Create `icons` folder in `style` folder and add your files there

**example.css:**

```js
.icon {
    background-repeat: no-repeat;
}
.icon.user {
    background-image: url('./icons/User.png');
}
.icon.userGroup {
    background-image: url('./icons/UserGroup.png');
}
.icon.task {
    background-image: url('./icons/Task.png');
}
```

**index.css:**

```js
@import './jsoneditor.css';
@import './example.css';

```

> Open `task-editor-frontend-module.ts`

**task-editor-frontend-module.ts:**

```js
import { ContainerModule } from "inversify";
import {
  TreeEditorOpenHandler
} from 'theia-tree-editor-extension/lib/browser/theia-tree-editor-open-handler';
import { OpenHandler } from "@theia/core/lib/browser";
import { TaskEditor } from './task-editor';

// Use the path of your css file
import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {

  bind(TreeEditorOpenHandler).to(TaskEditor);
  bind(OpenHandler).to(TaskEditor);
});
```
> In Theia, everything is wired up via dependency injection. Read this [documentation](http://www.theia-ide.org/doc/authoring_extensions)  for more info.

> We first inject our flagged arguments store and EditorComponent into TreeEditorOpenHandler. Then we bind our open handler implementation to the respective open handler interface


## Running the Task Editor

    cd root_path_to_project_directory
    yarn prepare
    cd browser-app
    yarn start


> Open http://localhost:3000 in the browser.
On the `File Menu`, open an empty JSON file or create one
Right click JSON file and select `Open With -> Open With Tree Editor`
