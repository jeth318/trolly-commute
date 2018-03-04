import * as React from 'react';
import { ErrorProps as Props } from '../../InterfaceCollection';

class Error extends React.Component<Props, {}> {
  render() {
    let errorMessage = '';
    switch (this.props.type) {
      case 'from':
        errorMessage = 'Starthållplatsen är inte korrekt angiven';
        break;
      case 'to':
        errorMessage = 'Sluthållplatsen är inte korrekt angiven';
        break;
      case 'both':
        errorMessage = 'Hållplatserna är felaktiga';
        break;
      case 'same':
        errorMessage = 'Start- och sluthållplats behöver vara olika';
        break;
      case 'other':
        errorMessage = 'Något gick fel. Prova igen om en stund';
        break;
      default:
        errorMessage = '';
        break;
    }
    return (
      <div className={`alert alert-danger `}>
        {errorMessage}
      </div>
      
    );
  }
}
export default Error;