import { Saveable } from '@theia/core/lib/browser';
import { Disposable, Event, MaybePromise } from '@theia/core/lib/common';
import { getData } from '@jsonforms/core';

export class TreeEditorSaveable implements Saveable {
  autoSave;
  dirty: boolean = true;
  onDirtyChanged: Event<void> = Object.assign((listener: (e) => any) => {
      let result: Disposable;
      result = {
        dispose: () => {}
      };

      return result;
    }, {
      maxListeners: 30
    }
  );
  private saveData: (data: object) => void;
  private store: any;

  constructor(saveData: (data: object) => void, store: any) {
    this.saveData = saveData;
    this.store = store;
  }

  save(): MaybePromise<void> {
    this.saveData(getData(this.store.getState()));
    this.dirty = false;
  }
};
