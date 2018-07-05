import { Widget } from "@phosphor/widgets";
import { Message, Saveable, SaveableSource } from '@theia/core/lib/browser';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { TreeEditorSaveable } from './TreeEditorSaveable';

let num = 0;
export class TreeEditorWidget extends Widget implements SaveableSource {
  private store;
  saveable: Saveable;
  constructor(store, EditorComponent, private saveData: (data: object) => void) {
    super();
    num++;
    this.id = `react-app-${num}`;
    this.addClass('tree-class');
    this.store = store;
    this.saveable = new TreeEditorSaveable(this.saveData, this.store);

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
    super.close();
  }
}
