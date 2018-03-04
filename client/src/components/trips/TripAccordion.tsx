import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';


import TripRow from './TripRow';
import TripRowMore from './TripRowMore';
import { TripTableProps as Props, LegRow } from '../../InterfaceCollection';

class TripAccordion extends React.Component <any, any>{
  constructor(props: Props) {
    super(props);
    this.state = {
      showMore: null,
      visible: true,
    };
  }

  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <div className="accordion-header">
          <div className="accordion-header-child">Avgång</div>
          <div className="accordion-header-child">Linje</div>
          <div className="accordion-header-child">Restid</div>
          <div className="accordion-header-child">Ankomst</div>
          <div className="accordion-header-child"></div>
        </div>
      <Accordion>
      {this.props.legCollection.map((legs: LegRow, i: number) => {
        return ([
          <AccordionItem>
          <AccordionItemTitle>
              <TripRow key={i}
                    id={i}
                    legs={legs}
                    visible={true}
                    onClick={()=>{'click'}}/>
                
          </AccordionItemTitle>
          <AccordionItemBody>
                <TripRowMore
                    key={i + 1 * 100}
                    visible={true}
                    legs={legs}
                  />
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