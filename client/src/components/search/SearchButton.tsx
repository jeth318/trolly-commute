import * as React from 'react';
import { SearchButtonProps as Props } from '../../InterfaceCollection';
import { Button } from 'semantic-ui-react';

class SearchButton extends React.Component<Props, {}> {
  render() {
    return (
      <div className="search-button-wrapper">
        <Button 
        className="search-button"
        size="large"
        color="green"
        onClick={this.props.handleSubmit}
        >
          Sök resor
        </Button>
      </div>
    );
  }
}
export default SearchButton;
