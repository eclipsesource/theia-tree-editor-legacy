import { Disposable, Event, MaybePromise, Resource } from '@theia/core/lib/common';
import { Saveable } from "@theia/core/lib/browser";

export class ResourceSaveable implements Saveable {
  autoSave;
  dirty: boolean = false;
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

  constructor(private resource: Resource, private getData: any) {}

  save(): MaybePromise<void> {
    return this.onSave(this.getData()).then(this.doSave)
  }

  doSave = (content: string): MaybePromise<void> => {
    if ( this.resource.saveContents !== undefined ) {
      return this.resource.saveContents(content, { encoding: 'UTF-8' })
        .then(() => {
          this.dirty = false;
      });
    } else {
      console.warn('resource cannot save');
      return undefined;
    }
  }

  onSave(data: any): Promise<string> {
    const content = JSON.stringify(data, null, 2);
    return Promise.resolve(content);
  }
}
