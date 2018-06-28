import { Widget } from "@phosphor/widgets";
import { Message } from '@theia/core/lib/browser';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

let num = 0;
export class TreeEditorWidget extends Widget {

  constructor(store, EditorComponent) {
    super();
    num++;
    this.id = `react-app-${num}`;
    this.addClass('tree-class');

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
}
