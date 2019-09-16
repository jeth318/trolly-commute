import * as React from 'react';
import TripRow from './TripRow';
import TripRowMore from './TripRowMore';
import { LegRow } from '../../InterfaceCollection';

class TripAccordion extends React.Component<any, any> {
  constructor() {
    super({});
    this.state = {
      selectedRow: {}
    };
  }
  
  renderTripRow = (i: number, legs: LegRow) => <TripRow key={i} id={i} legs={legs} visible />;
  renderTripRowMore = (i: number, legs: LegRow) => <TripRowMore key={i + 1 * 100} visible={true} legs={legs} />;
  private get tableHeader() {
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
  
  handleSelect = (rowIndex) => {
    this.setState({ selectedRow: this.state.selectedRow === rowIndex ? null : rowIndex });
  }

  isRowOpen = index => this.state.selectedRow === index ? 'accordion__body--open' : 'accordion__body--hidden';
  renderAccordion = () => {
    return (
      <React.Fragment>
      {this.tableHeader}
      <div className="accordion">
        {this.props.legCollection.forEach((legs: LegRow, i: number) => {
        return ([
          <div className="accordion__item" key={i}>
            <div className="accordion__title" onClick={() => this.handleSelect(i)}>{this.renderTripRow(i, legs)}</div>
            <div className={`accordion__body ${this.isRowOpen(i)}`}>{this.renderTripRowMore(i, legs)}</div>
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
