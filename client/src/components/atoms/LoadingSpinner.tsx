import * as React from 'react';

interface Props {
    message?: String
};

class LoadingSpinner extends React.Component<Props, {}> {

  render() {
    return (
      <div className={`loading-spinner-wrapper`}>
        <div className="loader"></div>
        <span className="loading-text">{this.props.message}</span>
      </div>
    );
  }
}
export default LoadingSpinner;