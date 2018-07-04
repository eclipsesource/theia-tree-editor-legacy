import { Widget } from "@phosphor/widgets";
import { Message } from '@theia/core/lib/browser';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { getData } from '@jsonforms/core';

let num = 0;
export class TreeEditorWidget extends Widget {
  private store;
  constructor(store, EditorComponent, private saveData: (data: object) => void) {
    super();
    num++;
    this.id = `react-app-${num}`;
    this.addClass('tree-class');
    this.store = store;

    ReactDOM.render(
      <Provider store={store}>
        <EditorComponent />
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
    this.saveData(getData(this.store.getState()));
    super.close();
  }
}
