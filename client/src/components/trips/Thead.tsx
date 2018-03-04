import * as React from 'react';

class Thead extends React.Component {
  render() {
    return (
      <thead>
        <tr>
          <th>Avgång</th>
          <th>Linje</th>
          <th>Restid</th>
          <th colSpan={2}>Ankomst</th>
        </tr>
      </thead>
    );
  }
}
export default Thead;