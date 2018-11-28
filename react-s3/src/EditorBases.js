import { Component } from 'react';

class EditorBase extends Component {
  cancel() {
    this.props.stopEdit();
  }
}

class EditorSubBase extends EditorBase {
  submit() {
    if (this.props.isAdding)
      this.submitAdding();
    else if (this.props.isEditing)
      this.submitUpdating();
    else
      this.submitDeleting();
  }
  updateValues(key, value) {
    this.props.updateValues(key, value);
  }
}

export { EditorBase, EditorSubBase };
