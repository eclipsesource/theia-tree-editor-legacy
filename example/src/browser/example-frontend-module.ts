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
} from 'tree-editor-extension/lib/browser';
import URI from "@theia/core/lib/common/uri";
import App, {initStore} from "../App";
import { OpenHandler } from '@theia/core/lib/browser';
import { getData } from '@jsonforms/core';

export default new ContainerModule(bind => {
  bind(TreeEditorWidget).toSelf();
  // value is cached
  bind(TheiaTreeEditorContribution).toSelf().inSingletonScope();
  [CommandContribution, MenuContribution, OpenHandler].forEach(serviceIdentifier =>
    bind(serviceIdentifier).toService(TheiaTreeEditorContribution)
  );
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
});
