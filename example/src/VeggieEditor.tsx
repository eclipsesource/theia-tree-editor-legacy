import * as React from 'react';
import TreeWithDetailRenderer from '@jsonforms/material-tree-renderer/lib/tree/TreeWithDetailRenderer';
import { connect } from 'react-redux';
import {
  DIRTY_CLASS,
  TreeEditorProps,
  mapStateToTreeEditorProps
} from 'tree-editor-extension';
import * as _ from 'lodash';

class VeggieEditor extends React.Component<TreeEditorProps, {}> {
  componentDidUpdate(prevProps) {
    const dirtyClass = ` ${DIRTY_CLASS}`;
    if (!_.isEqual(this.props.rootData, prevProps.rootData)) {
      this.props.widget.saveable.dirty = true;
      if (!this.props.widget.title.className.includes(dirtyClass)) {
        this.props.widget.title.className += dirtyClass;
      }
    }
  }

  render() {
    const { filterPredicate, labelProvider, imageProvider, uischema, schema } = this.props;

    return (
      <TreeWithDetailRenderer
        uischema={uischema}
        schema={schema}
        filterPredicate={filterPredicate}
        labelProvider={labelProvider}
        imageProvider={imageProvider}
      />
    );
  }
}

export default connect(mapStateToTreeEditorProps)(VeggieEditor);
