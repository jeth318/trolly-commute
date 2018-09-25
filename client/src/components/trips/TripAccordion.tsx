import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';

import TripRow from './TripRow';
import TripRowMore from './TripRowMore';
import { LegRow } from '../../InterfaceCollection';

class TripAccordion extends React.Component<any, any>{
  
  renderTripRow = (i, legs) => <TripRow key={i} id={i} legs={legs} visible={true} onClick={() => { 'click' }} />
  renderTripRowMore = (i, legs) => <TripRowMore key={i + 1 * 100} visible={true} legs={legs} />
    
  render() {
    return (
      <React.Fragment>
        <div className="ui grid accordion-header">
          <div className="three wide column accordion-header-child" style={{alignSelf: 'center'}} >Avgång</div>
          <div className="four wide column accordion-header-child" style={{alignSelf: 'center'}}>Linje</div>
          <div className="two wide column accordion-header-child" style={{alignSelf: 'center'}}>Restid</div>
          <div className="two wide column accordion-header-child" style={{alignSelf: 'center'}}>Ankomst</div>
          <div className="one wide column accordion-header-child" style={{alignSelf: 'center'}}></div>
        </div>
          <Accordion accordion={true}>
            {this.props.legCollection.map((legs: LegRow, i: number) => {
              return ([
                <AccordionItem key={i}>
                  <AccordionItemTitle>
                    {this.renderTripRow(i, legs)}
                  </AccordionItemTitle>
                  <AccordionItemBody >
                    {this.renderTripRowMore(i, legs)}
                  </AccordionItemBody>
                </AccordionItem>
              ]);
            })}
          </Accordion>
      </React.Fragment>
    );
  }
}
export default TripAccordion;