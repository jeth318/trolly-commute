import * as React from 'react';

class Loading extends React.Component {
  render() {
    return (
      <div 
        className="loading" 
        style={{ textAlign: 'center' }}
      >
        <img 
          className="loading-img" 
          src={'images/loading.gif'} 
        />
      </div>
    );
  }
}
export default Loading;