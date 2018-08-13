# Theia Tree Editor

The Theia Tree Editor showcases the integration of [JSON Forms](https://github.com/eclipsesource/jsonforms) with [Theia](https://github.com/theia-ide/theia).

## Getting started

> Open your terminal and switch to a new directory

    git clone git@github.com:eclipsesource/theia-tree-editor.git
    cd theia-tree-editor
    yarn install
    yarn prepare

> Use the generated module in your Theia application

# How To Create A Sample Editor Application with Theia Tree Editor Extension

> TreeEditorOpenHandler shouldn't be used as stand-alone extension.
In this example, we are going to create a custom editor extension for task editing with the tree editor extension


## Prerequisites

> You’ll need node in version 8:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
    nvm install 8

> and yarn

    npm install -g yarn

> Also make sure your python --version points to a Python 2.x installation. Run the following command in your terminal.

    python --version

## Project Layout

> Open a new terminal, switch to a new directory and install generator-theia-extension. Use the theia extension generator for project scaffolding

    npm install -g yo generator-theia-extension
    mkdir task-editor
    cd task-editor
    yo theia-extension task-editor
    cd task-editor-extension

> Install dependencies.

**Add the following dependencies in the package.json of the task-editor-extension**

```js

  "dependencies": {
    "@jsonforms/core": "^2.0.6",
    "@jsonforms/editor": "^2.0.6",
    "@jsonforms/material-renderers": "^2.0.6",
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
    "theia-tree-editor": "https://github.com/eclipsesource/theia-tree-editor.git#v0.0.1"
  }

```
**Add the following dependencies in the package.json of the browser-app**

```js

    "theia-tree-editor": "https://github.com/eclipsesource/theia-tree-editor.git#v0.0.1"

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
**Now install all the dependencies**

    yarn install

## Create Your Custom Editor

    cd task-editor-extension

> Create `config.ts`,`schema.ts` and `uischemata.ts` files

**config.ts:**
```js
import { taskView, taskGroupView } from './uischemata';

export const labelProvider = {
  '#taskGroup': 'label',
  '#task': 'name',
};

export const imageProvider = {
  '#task': 'task',
  '#taskGroup': 'taskGroup'
};

export const modelMapping = {
  'attribute': '_type',
  'mapping': {
    'task': '#task',
    'taskGroup': '#taskGroup'
  }
};

export const detailSchemata = {
  '#task': taskView,
  '#taskGroup': taskGroupView,
};
```
**schema.ts:**
```js
export const taskSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema',
  'type': 'object',
  'id': '#taskGroup',
  'properties': {
    '_type': {
      'type': 'string',
      'default': 'taskGroup'
    },
    'label': {
      'type': 'string'
    },
    'tasks': {
      'type': 'array',
      'items': {
        '$ref': '#/definitions/task'
      }
    }
  },
  'additionalProperties': false,
  'definitions': {
    'task': {
      'type': 'object',
      'id': '#task',
      'properties': {
        '_type': {
          'type': 'string',
          'default': 'task'
        },
        'name': {
          'type': 'string'
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
    }
  }
};
```
**uischemata.ts:**
```js
export const taskGroupView = {
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

export const initStore = async() => {
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

  return await JsonRefs.resolveRefs(taskSchema)
    .then(
      resolvedSchema => {
        store.dispatch(Actions.init({}, resolvedSchema.resolved, uischema));

        store.dispatch(setContainerProperties(
          findAllContainerProperties(resolvedSchema.resolved, resolvedSchema.resolved)));

        return store;
      },
      err => {
        console.log(err.stack);
        return {};
      });
};

export const TaskApp = defaultProps(
  {
    'filterPredicate': filterPredicate,
    'labelProvider': calculateLabel,
    'imageProvider': imageGetter
  }
)(App);

```

> We initialize our store with helper functions (filterPredicate, labelProvider, imageProvider) that are required by TreeRenderer Component

> To use stylesheets in your application, create a folder and name it `style` for our example. Create the following files.

> For `ImageProvier` you need to provide icons (optional). Create `icons` folder in `style` folder and add your files there

**example.css:**

```js
.icon {
    background-repeat: no-repeat;
}
.icon.taskGroup {
    background-image: url('./icons/TaskGroup.png');
}
.icon.task {
    background-image: url('./icons/Task.png');
}
```

**index.css:**

```js
@import './example.css';

```

> Open `task-editor-frontend-module.ts`

**task-editor-frontend-module.ts:**

```js
import { ContainerModule } from "inversify";
import {
  CommandContribution,
  MenuContribution,
  ResourceProvider
} from "@theia/core/lib/common";
import { TreeEditorWidget, TreeEditorWidgetOptions } from 'theia-tree-editor/lib/browser';
import { WidgetFactory } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { TaskApp, initStore } from './uischema-editor';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
  // pass constructor arguments to the constructor and resolve these arguments
  bind<WidgetFactory>(WidgetFactory).toDynamicValue(ctx => ({
    id: 'theia-tree-editor',
    async createWidget(uri: string): Promise<TreeEditorWidget> {
      const { container } = ctx;
      const resource = await container.get<ResourceProvider>(ResourceProvider)(new URI(uri));
      const store = await initStore();
      const child = container.createChild();
      child.bind<TreeEditorWidgetOptions>(TreeEditorWidgetOptions)
        .toConstantValue({ resource, store, EditorComponent: TaskApp, fileName: new URI(uri).path.base});
      return child.get(TreeEditorWidget);
    }
  }));
});

```
> In Theia, everything is wired up via dependency injection. Read this [documentation](http://www.theia-ide.org/doc/authoring_extensions)  for more info.

> We create a new widget by setting TreeWidgetOptions which are resource (for file's content manipulation), store of the React App, React App and file name.
We register this widget into the WidgetFactory so that we can access to the created widget whenever we need it.


## Running the Task Editor

    cd root_path_to_project_directory
    yarn prepare
    cd browser-app
    yarn start


> Open http://localhost:3000 in the browser.
On the `File Menu`, open an empty JSON file or create one
Right click JSON file and select `Open With -> Open With Tree Editor`
