# Theia Tree Editor

The Theia Tree Editor integrates [JSON Forms](https://github.com/eclipsesource/jsonforms) with the [Theia IDE](https://github.com/theia-ide/theia).

This component is not meant to be used standalone but instead enables the usage of the `TreeWithDetail` component
of JSONForms within Theia.

**NOTE**: This project is currently WIP and it's very likely that we'll be able to cut down the boilerplate,
so bear with us :)

## Prerequisites

You’ll need node in version 8:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
    nvm install 8

and yarn

    npm install -g yarn

Also make sure your python --version points to a Python 2.x installation. Run the following command in your terminal.

    python --version

Additionally, also install yeoman and the theia extension generator for project scaffolding:

    npm install -g yo generator-theia-extension

## Running the example application

    1. Run `yarn install` within project root directory
    2. Run `yarn start` within `browser-app` directory


## Getting started

In this section we will walk you through the process of creating a very minimalistic extension based
on the theia tree editor extension and an example schema from the JSON schema homepage, which can be found
under the [Miscellaneous Examples](http://json-schema.org/learn/miscellaneous-examples.html) section. We'll
call our editor `veggie-editor`.

First, let's scaffold a basic extension with the theia generator extension:


    mkdir veggie-editor && cd veggie-editor
    yo theia-extension veggie-editor
    cd veggie-editor-extension

Let's add a couple of dependencies with yarn (**TODO**: we shouldn't need that many deps, e.g. `recompose`, `lodash` etc.):

    yarn add https://github.com/eclipsesource/theia-tree-editor.git#v0.0.5
    yarn add @jsonforms/material-tree-renderer
    yarn add @jsonforms/material-renderers
    yarn add react-redux
    yarn add lodash
    yarn add recompose
    yarn add lodash

## JSON Schema

Next, we'll add a basic JSON schema which describes the instances we want to work with.
For this example we'll use the [Array of things example schema](http://json-schema.org/learn/miscellaneous-examples.html)
from the [JSON Schema examples section](http://json-schema.org/learn/).

**TODO (this might change soon)**: Unfortunately, we have to modify the schema a bit in order to allow JSON Forms mapping
subschemas. Therefore, we have to set `$id` properties for each definition we want to reference from within JSON Forms.

In this case, we'll replace the `id` property with `$id` and give it a value of `#fruitsOrVeggies`
and we'll also add an additional `$id` to the `veggie` definition with the value of `#veggie`.
We save the modified schema in a file called `schema.ts`, within the `veggie-editor-extension/src` folder:

### schema.ts

```js
export default {
  $id: "#fruitsOrVeggies",
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "A representation of a person, company, organization, or place",
  type: "object",
  properties: {
    fruits: {
      type: "array",
      items: { type: "string" }
    },
    vegetables: {
      type: "array",
      items: { $ref: "#/definitions/veggie" }
    }
  },
  definitions: {
    veggie: {
      $id: "#veggie",
      type: "object",
      required: [ "veggieName", "veggieLike" ],
      properties: {
        veggieName: {
          type: "string",
          description: "The name of the vegetable."
        },
        veggieLike: {
          type: "boolean",
          description: "Do I like this vegetable?"
        }
      }
    }
  }
}
```



## Configuration

Next up, we need to set-up a configuration object which describes a few additional properties of the schema.
All of the following will be goes into a file name `config.ts` with in `veggie-editor-extension/src` folder.

For determining the labels that are to be displayed within the master view of the tree renderer,
we set up a `labels` object . The format follows the convention of key-value pairs, where the key is
the `$id` value of sub schema and the value is the label to be shown. The label value is either a plain string
or an object with a `property` field. In the latter case the given property will be used to determine the
label of the object to be displayed, which allows for dynamic labels. Specifying a `constant` property is the same
as specifying a plain string.

### Labels

```js
export const labels = {
	"#fruitsOrVeggies": {
		constant: "Fruits/Vegetables"
	},
	"#veggie": {
		property: "veggieName"
	}
}
```

In this example, we display a static string for the top node and a dynamic one for the objects that
conform to the `veggie` schema.

### Images

TODO

### Model mapping

The `modelMapping` describes how instances can be mapped to their corresponding schema.
The first property, `attribute`, determines which property should be used for identification purposes
while the `mapping` property maps possible value of the `attribute` property to the
respective `$id`s of the sub schemas.

```js
// TODO: rename?
export const modelMapping = {
	attribute: 'type',
 	mapping: {
		fruitsOrVeggies: '#fruitsOrVeggies',
		veggies: '#veggies'
 	}
};
```

### Detail UI schemas

The `uischemas` object holds a mapping of schema ID to its respective UI schema, which should
be used while rendering the detail view of the `TreeWithDetail` renderer.

```js

export const uischemas = {
  '#fruitsOrVeggies': {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/fruits'
      },
      {
        type: 'Control',
        scope: '#/properties/vegetables'
      }
    ]
  },
  '#veggie': {
    type: 'HorizontalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/veggieName'
      },
      {
        type: 'Control',
        scope: '#/properties/veggieLike'
      }
    ]
  }
};
```

You can save and close `config.ts` now. We'll use it when we set up the Editor component.

# Update tsconfig.json

We need to update the generated `tsconfig.json` in order to support writing React extensions.
Add the following properties to `tsconfig.json`:

```js
"compilerOptions": {
   // ...
   "strict": false,
   "jsx": "react"
},
"exclude": [
	"node_modules",
	"lib"
]
```
**NOTE**: turning of strict mode should be necessary of course, we need to fix the current issues

## Editor

With the configuration in place we can set up the App component, which will only act as a wrapper
around JSON Form's `TreeWithDetail` renderer. The code for the entire component looks as follows
and should be saved within `veggie-editor-extension/src/VeggieEditor.tsx`.

```js
import * as React from 'react';
import _ as _ from 'lodash';
import { TreeWithDetailRenderer } from '@jsonforms/material-tree-renderer';
import { connect } from 'react-redux';
import {
  DIRTY_CLASS,
  TreeEditorProps,
  mapStateToTreeEditorProps
} from 'theia-tree-editor/tree-editor-extension/lib/browser';

class VeggieEditor extends React.Component<TreeEditorProps, {}> {

  componentDidUpdate(prevProps) {
    const dirtyClass = ` ${DIRTY_CLASS}`;
    if (!_.isEqual(this.props.rootData, prevProps.rootData)) {
      this.props.widget.saveable.dirty = true;
      if (!this.props.widget.title.className.includes(dirtyClass)) {
        this.props.widget.title.className += dirtyClass;
      }
    }
  }

  render() {
    return (
      <TreeWithDetailRenderer {...this.props} />
    );
  }
}

export default connect(mapStateToTreeEditorProps)(VeggieEditor);
```

## App

Now let's put our editor component to use. To do so, we import our Editor component
and wire it up with the configuration with defined previously. We also need to take
care of setting up the store.

The relevant code to do so is given below and should be placed into `veggie-editor-extension/src/App.tsx`:

```js
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
import { calculateLabel, filterPredicate } from 'theia-tree-editor';

import schema from './schema';

import {labels, modelMapping, uischemas} from './config';
import VeggieEditor from './VeggieEditor';


const imageGetter = (schemaId: string) => 'icon-test';
// !_.isEmpty(imageProvider) ? `icon ${imageProvider[schemaId]}` : '';

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
        jsonforms: jsonformsReducer(
          {
            treeWithDetail: treeWithDetailReducer
          }
        )
      }
    ),
    { ...jsonforms }
  );

  store.dispatch(Actions.init({}, schema, uischema));
  store.dispatch(setContainerProperties(findAllContainerProperties(schema, schema)));

  return store;
};

export default defaultProps(
  {
    'filterPredicate': filterPredicate,
    'labelProvider': calculateLabel(labels),
    'imageProvider': imageGetter
  }
)(VeggieEditor);

```

## Frontend module

Finally, open the frontend module in `veggie-editor-extension/src/browser/veggie-editor-frontend-module.ts` which
already has been generated by the extension generator and add the following binding:

**NOTE**: explain what's going on here

Add the following imports:

```js
  // necessary imports
import {ContainerModule} from "inversify";
import { WidgetFactory, WidgetManager } from '@theia/core/lib/browser';
import {
  CommandContribution,
  MenuContribution,
  MessageService,
  ResourceProvider
} from "@theia/core/lib/common";
import {
  DirtyResourceSavable,
  TreeEditorWidget,
  TreeEditorWidgetOptions,
  TheiaTreeEditorContribution,
} from 'theia-tree-editor/tree-editor-extension/lib/browser';
import URI from "@theia/core/lib/common/uri";
import App, {initStore} from "../App";
import { OpenHandler } from '@theia/core/lib/browser';
import { getData } from '@jsonforms/core';
```

Then add the bindings (**TODO**: is the ID correct?). If you want to use another implementation
of the `TheiaTreeEditorContribution` replace the imports with your version of it:

```js
  bind<WidgetFactory>(WidgetFactory).toDynamicValue(ctx => ({
    id: 'theia-tree-editor',
    async createWidget(uri: string): Promise<TreeEditorWidget> {
      const { container } = ctx;
      const resource = await container.get<ResourceProvider>(ResourceProvider)(new URI(uri));
      const widgetManager = await container.get<WidgetManager>(WidgetManager);
      const messageService = await container.get<MessageService>(MessageService);
      const store = await initStore();
      const onResourceLoad = (content: string): Promise<any> => {
        let parsedContent;
        try {
          parsedContent = JSON.parse(content);
        } catch (err) {
          console.warn('Invalid content', err);
          parsedContent = {};
        }
        return Promise.resolve(parsedContent);
      };
      const saveable = new DirtyResourceSavable(resource,
                                                () => getData(store.getState()),
                                                widgetManager,
                                                messageService);
      const child = container.createChild();
      child.bind<TreeEditorWidgetOptions>(TreeEditorWidgetOptions)
        .toConstantValue({
          resource,
          store,
          EditorComponent: App,
          fileName: new URI(uri).path.base,
          saveable,
          onResourceLoad
        });
      return child.get(TreeEditorWidget);
    }
  }));
  bind(TreeEditorWidget).toSelf();

  bind(TheiaTreeEditorContribution).toSelf().inSingletonScope();
  [CommandContribution, MenuContribution, OpenHandler].forEach(serviceIdentifier =>
    bind(serviceIdentifier).toService(TheiaTreeEditorContribution)
  );
```

That's it, we are finally good to go!

## Running the extension

1. Run `yarn start` within `browser-app` directory
2. Run `yarn watch --mode development` within `browser-app` directory
3. Run `yarn watch` within the directory of your extension

This will cause your extension and the browser-app to be rebuilt upon each
change you do in the extension and also start a webserver on `http://localhost:3000`.
Note however, that a refresh is not triggered automatically.

Within the browser, navigate to the `File Menu`, open an empty JSON file or, alternatively, create one.
Right click JSON file and select `Open With` and your extension should be listed.
