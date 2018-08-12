import * as React from 'react';
import { ClearCirkleProps as Props } from '../../InterfaceCollection';
class ClearCirkle extends React.Component<Props, {}> {
  
  render() {
    return (
      <span
        className="glyphicon glyphicon-remove-circle searchClear"
        onClick={this.onClick}
      />
    );
  }
  
  private onClick = (e: any) => {
    let id = e.currentTarget.previousSibling.firstChild.id;
    this.props.onClick(id);
  }
}
export default ClearCirkle;
