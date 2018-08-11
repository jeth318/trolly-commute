import * as React from 'react';
import Clock from 'react-live-clock';

class Header extends React.Component {
  render() {
    return (
      <div className="heading">
        <br />
        <h1 className="heading-title">Trolly Commute</h1>
        <div id="updatetime"> 
          <Clock 
              format={'HH:mm:ss'} 
              ticking={true} 
              timezone={'SE'} 
          />
        </div>
        <h2 id="subheader">Västtrafik Trip Planning</h2>
      </div>
    );
  }
}
export default Header;