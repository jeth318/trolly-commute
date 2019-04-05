import * as React from 'react';
import TripRow from './TripRow';
import TripRowMore from './TripRowMore';
import { LegRow } from '../../InterfaceCollection';

class TripAccordion extends React.Component<any, any> {
  constructor() {
    super({});
    this.state = {
      selectedRows: []
    };
  }
  
  renderTripRow = (i, legs) => <TripRow key={i} id={i} legs={legs} visible={true} onClick={() => { 'click'; }} />;
  renderTripRowMore = (i, legs) => <TripRowMore key={i + 1 * 100} visible={true} legs={legs} />;
  renderTableHeader = () => {
    return (
      <div className="ui grid accordion-header">
      <div className="three wide column accordion-header-child" style={{alignSelf: 'center'}} >Avgång</div>
      <div className="four wide column accordion-header-child" style={{alignSelf: 'center'}}>Linje</div>
      <div className="two wide column accordion-header-child" style={{alignSelf: 'center'}}>Restid</div>
      <div className="two wide column accordion-header-child" style={{alignSelf: 'center'}}>Ankomst</div>
      <div className="one wide column accordion-header-child" style={{alignSelf: 'center'}} />
    </div>
    );
  }
  
  handleSelect = rowIndex => {

    const index = this.state.selectedRows.indexOf(rowIndex);
    let selectedRows = []; 
    if (index > -1) {
      console.log('removing', index);
      
      selectedRows = this.state.selectedRows.filter((row => row !== rowIndex));
    } else {
      selectedRows = this.state.selectedRows.concat([rowIndex]);
    }
    this.setState({ selectedRows });
  }

  getStatus = index => this.state.selectedRows.includes(index) ? 'accordion__body--open' : 'accordion__body--hidden';

  renderAccordion = () => {
    return (
      <React.Fragment>
      {this.renderTableHeader()}
      <div className="accordion">
        {this.props.legCollection.map((legs: LegRow, i: number) => {
        return ([
          <div className="accordion__item" key={i} onClick={() => this.handleSelect(i)}>
            <div className="accordion__title">{this.renderTripRow(i, legs)}</div>
            <div className={`accordion__body ${this.getStatus(i)}`}>{this.renderTripRowMore(i, legs)}</div>
          </div>
          ]); 
        })}
      </div>
      </React.Fragment>
    );
  }

  render() {
    return this.renderAccordion();
  }
}
export default TripAccordion;
