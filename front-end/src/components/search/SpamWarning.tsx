import * as React from 'react';

class SpamWarning extends React.Component<any, any> {
  render() {
    return (
      <div>
        <div id="alertDanger" className="alert alert-info">
          <strong>Luuugn i vagnen</strong>
          <p> Nu ska vi inte spamma sönder här.</p>
          <p>Vänta till den här rutan försvinner innan</p>
          nästa sökning.
            </div>
      </div>
    );
  }
}
export default SpamWarning;
