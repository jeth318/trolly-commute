import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';


import Collapsible from 'react-collapsible';
import TripRow from './TripRow';
import TripRowMore from './TripRowMore';
import { TripTableProps as Props, LegRow } from '../../InterfaceCollection';

class TripAccordion extends React.Component<any, any>{
  
  onOpening = (i) => {
    console.log(`Opened number ${i}`);
  }

  renderTripRow = (i, legs) => {
    return (<TripRow key={i}
      id={i}
      legs={legs}
      visible={true}
      onClick={() => { 'click' }} />
    )
  }

  renderTripRowMore = (i, legs) => {
    return (<TripRowMore
      key={i + 1 * 100}
      visible={true}
      legs={legs}
    />
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="ui grid accordion-header">
          <div className="three wide column accordion-header-child" style={{alignSelf: 'center'}} >Avgång</div>
          <div className="six wide column accordion-header-child" style={{alignSelf: 'center'}}>Linje</div>
          <div className="three wide column accordion-header-child" style={{alignSelf: 'center'}}>Restid</div>
          <div className="three wide column accordion-header-child" style={{alignSelf: 'center'}}>Ankomst</div>
          <div className="one wide column accordion-header-child" style={{alignSelf: 'center'}}></div>
        </div>
          <Accordion accordion={true} onChange={(res)=>console.log(res)}>
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