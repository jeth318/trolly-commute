import * as React from 'react';
import TripRow from './TripRow';
import TripRowMore from './TripRowMore';
import { LegRow } from '../../InterfaceCollection';

class TripAccordion extends React.Component<any, any>{
  constructor() {
    super({});
    this.state = {
      selectedRow: null
    }
  }
  
  renderTripRow = (i, legs) => <TripRow key={i} id={i} legs={legs} visible={true} onClick={() => { 'click' }} />
  renderTripRowMore = (i, legs) => <TripRowMore key={i + 1 * 100} visible={true} legs={legs} />
  renderTableHeader = () => {
    return (
      <div className="ui grid accordion-header">
      <div className="three wide column accordion-header-child" style={{alignSelf: 'center'}} >Avgång</div>
      <div className="four wide column accordion-header-child" style={{alignSelf: 'center'}}>Linje</div>
      <div className="two wide column accordion-header-child" style={{alignSelf: 'center'}}>Restid</div>
      <div className="two wide column accordion-header-child" style={{alignSelf: 'center'}}>Ankomst</div>
      <div className="one wide column accordion-header-child" style={{alignSelf: 'center'}}></div>
    </div>
    )
  }
  
  handleSelect = index => this.setState({ selectedRow: this.state.selectedRow !== index ? index : null});

  getStatus = index => this.state.selectedRow === index ? 'accordion__body--open' : 'accordion__body--hidden';

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
          ]) 
        })}
      </div>
      </React.Fragment>
    )
  };

  render() {
    return this.renderAccordion();
  }
}
export default TripAccordion;


/*
<Accordion accordion={true}>
  {this.props.legCollection.map((legs: LegRow, i: number) => {
    return ([
      <AccordionItem key={i}>
        <AccordionItemTitle>
          {this.renderTripRow(i, legs)}
        </AccordionItemTitle>
        <AccordionItemBody>
          {this.renderTripRowMore(i, legs)}
        </AccordionItemBody>
      </AccordionItem>
    ]);
  })}
</Accordion>
*/