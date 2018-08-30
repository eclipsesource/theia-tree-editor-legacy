import { ResourceSaveable } from './ResourceSaveable';
import { unmanaged } from 'inversify';
import { WidgetManager} from "@theia/core/lib/browser";
import { MessageService, Resource } from '@theia/core/lib/common';
import { DIRTY_CLASS, TreeEditorWidget } from './theia-tree-editor-widget';
import * as _ from 'lodash';

export class DirtyResourceSavable extends ResourceSaveable {
  private _widgetManager: WidgetManager;
  private _messageService: MessageService;

  constructor(
    resource: Resource,
    getData: () => any,
    @unmanaged() widgetManager: WidgetManager,
    @unmanaged() messageService: MessageService
  ) {
    super(resource, getData);

    this._widgetManager = widgetManager;
    this._messageService = messageService;
  }

  onSaveSuccess = () => {
    const widget = _.head(this._widgetManager.getWidgets('theia-tree-editor')) as TreeEditorWidget;
    const dirtyClass = ` ${DIRTY_CLASS}`;
    widget.title.className = widget.title.className.replace(dirtyClass, '');
  }

  onSaveFailure = () => {
    this._messageService.error('Cannot Save: Undefined Resource');
  }
}
