import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {mapStateToTreeEditorProps, TreeEditorProps} from "./tree-editor-utils";
import {DIRTY_CLASS} from "./theia-tree-editor-widget";

class TreeEditorApp extends React.Component<TreeEditorProps, {}> {

  componentDidUpdate(prevProps) {
    const dirtyClass = ` ${DIRTY_CLASS}`;
    if (!_.isEqual(this.props.rootData, prevProps.rootData)) {
      if (!_.isEqual(this.props.rootData, prevProps.rootData)) {
        this.props.saveable.dirty = true;
        this.props.widget.saveable.dirty = true;
        if (!this.props.widget.title.className.includes(dirtyClass)) {
          this.props.widget.title.className += dirtyClass;
        }
      }
    }
  }
}
export default connect(mapStateToTreeEditorProps)(TreeEditorApp);