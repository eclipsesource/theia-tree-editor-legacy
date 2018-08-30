import { injectable, inject } from "inversify";
import {
  Command,
  CommandContribution,
  CommandRegistry,
  MenuContribution,
  MenuModelRegistry,
  MenuPath,
  MessageService,
  SelectionService
} from "@theia/core/lib/common";
import { UriCommandHandler, UriAwareCommandHandler } from '@theia/core/lib/common/uri-command-handler';
import URI from '@theia/core/lib/common/uri';
import { FileDownloadService } from '@theia/filesystem/lib/browser/download/file-download-service';
import {OpenerOptions, WidgetManager, WidgetOpenerOptions, WidgetOpenHandler} from '@theia/core/lib/browser';
import { EditorContextMenu } from '@theia/editor/lib/browser';
import { TreeEditorWidget } from './theia-tree-editor-widget';

export const UISchemaDownloadCommand = {
  id: 'UISchemaDownload.command',
  label: "Download UI Schema"
};

export namespace TreeEditorCommands {
  export const OPEN: Command = {
    id: 'TreeEditorOpen.command',
    label: 'Open With Tree Editor'
  };
}

export const NAVIGATOR_CONTEXT_MENU: MenuPath = ['navigator-context-menu'];

export namespace NavigatorContextMenu {
  export const DOWNLOAD = [...NAVIGATOR_CONTEXT_MENU, '5_download'];
}

@injectable()
export class TheiaTreeEditorContribution extends WidgetOpenHandler<TreeEditorWidget> implements CommandContribution, MenuContribution {
  readonly id = 'theia-tree-editor';
  readonly label = 'Open With Tree Editor';

  constructor(
    @inject(WidgetManager) protected readonly widgetManager: WidgetManager,
    @inject(MessageService) private readonly messageService: MessageService,
    @inject(SelectionService) private readonly selectionService: SelectionService,
    @inject(FileDownloadService) private readonly fileDownloadService: FileDownloadService
  ) {
    super();
  }

  canHandle(uri: URI): number {
    if (uri.path.ext === '.json') {
      return 1000;
    }
    return 0;
  }

  async open(uri: URI, options?: OpenerOptions): Promise<TreeEditorWidget> {
    return super.open(uri);
  }

  registerMenus(menus: MenuModelRegistry): void {
    menus.registerMenuAction(EditorContextMenu.NAVIGATION, {
      commandId: TreeEditorCommands.OPEN.id,
      label: TreeEditorCommands.OPEN.label,
    });
    menus.registerMenuAction(NavigatorContextMenu.DOWNLOAD, {
      commandId: UISchemaDownloadCommand.id,
      label: UISchemaDownloadCommand.label
    });
  }

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(TreeEditorCommands.OPEN, new UriAwareCommandHandler<URI>(this.selectionService,
    {
      execute: uri => this.openForEditor(uri),
      isEnabled: uri => uri.scheme === 'file' && uri.path.ext === '.json',
      isVisible: uri => uri.scheme === 'file' && uri.path.ext === '.json',
    }));

    registry.registerCommand(UISchemaDownloadCommand, this.newUriAwareCommandHandler({
      execute: uris => {
        this.executeDownload(uris);
        this.messageService.info('Download completed');
      },
      isEnabled: uris => uris.length > 0 && uris.every(u => u.scheme === 'file' && u.path.ext === '.json'),
      isVisible: uris => uris.every(u => u.scheme === 'file' && u.path.ext === '.json')
    }));
  }

  protected async executeDownload(uris: URI[]): Promise<void> {
    this.fileDownloadService.download(uris);
  }

  protected newUriAwareCommandHandler(handler: UriCommandHandler<URI[]>): UriAwareCommandHandler<URI[]> {
    return new UriAwareCommandHandler<URI[]>(this.selectionService, handler, { multi: true });
  }

  protected async openForEditor(uri): Promise<void> {
    if (!uri) {
      return;
    }
    await this.open(uri);
  }

  protected createWidgetOptions(uri: URI, options?: WidgetOpenerOptions): Object {
    return {};
  }
}
