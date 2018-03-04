import * as React from 'react';
import { SearchButtonProps as Props } from '../../InterfaceCollection';

class SearchButton extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <div className="form-group">
        <input
          type="button"
          id="visaResorBtn"
          className="form-control btn btn-success"
          value="Sök resor"
          onClick={this.props.handleSubmit}
        />
      </div>
    );
  }
}
export default SearchButton;
