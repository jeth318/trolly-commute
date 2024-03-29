import * as React from 'react';
import Clock from 'react-live-clock';

class Header extends React.Component {
  render() {
    return (
      <div className="heading">
        <br />
        <h1 className="heading-title">När går vagnen?</h1>
        <div id="updatetime">
        <Clock
              format={'HH:mm:ss'}
              ticking={true}
              timezone={'Europe/Stockholm'}
          />
        </div>
      </div>
    );
  }
}
export default Header;
