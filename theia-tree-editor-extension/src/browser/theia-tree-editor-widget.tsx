import { Widget } from "@phosphor/widgets";
import { Message, Saveable, SaveableSource } from '@theia/core/lib/browser';
import { Resource } from '@theia/core/lib/common';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { TreeEditorSaveable } from './TreeEditorSaveable';

let num = 0;
export class TreeEditorWidget extends Widget implements SaveableSource {
  saveable: Saveable;
  constructor(private store, EditorComponent, private resource: Resource) {
    super();
    num++;
    this.id = `react-app-${num}`;
    this.addClass('tree-class');
    this.saveable = new TreeEditorSaveable(this.resource, this.store);

    ReactDOM.render(
      <Provider store={store}>
        <EditorComponent saveable={this.saveable}/>
      </Provider>,
      this.node);
  }

  onActivateRequest(msg: Message): void {
    super.onActivateRequest(msg);
    this.node.focus();
    this.update();
  }

  onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);
  }

  close() {
    super.close();
  }
}
