/**
 * Generated using theia-extension-generator
 */

import { ContainerModule } from "inversify";
import {
  CommandContribution,
  MenuContribution
} from "@theia/core/lib/common";
import {
  TheiaTreeEditorContribution
} from './theia-tree-editor-contribution';
import { TreeEditorWidget } from './theia-tree-editor-widget';
import { OpenHandler } from '@theia/core/lib/browser';

export default new ContainerModule(bind => {

  bind(TreeEditorWidget).toSelf();

  // value is cached
  bind(TheiaTreeEditorContribution).toSelf().inSingletonScope();
  [CommandContribution, MenuContribution, OpenHandler].forEach(serviceIdentifier =>
    bind(serviceIdentifier).toService(TheiaTreeEditorContribution)
  );
});
