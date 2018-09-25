import * as React from 'react';
import { ErrorProps as Props } from '../../InterfaceCollection';
import { errorMessages } from '../../utils/error-util';

class Error extends React.Component<Props, {}> {

  private get message() {
    return errorMessages.filter(message => this.props.type === message.type)[0].message;
  };

  render() {
    return (
      <div className={`alert alert-danger `}>
        {this.message}
      </div>
    );
  };
}
export default Error;