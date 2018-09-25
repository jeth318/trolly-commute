import * as React from 'react';
import TripRow from './TripRow';
import TripRowMore from './TripRowMore';
import Thead from './Thead';
import { TripTableProps as Props, LegRow } from '../../InterfaceCollection';

interface State {
  showMore: number | null;
  visible: boolean;
}
class TripTable extends React.Component<any, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showMore: null,
      visible: true,
    };
  }

  render() {
    return (
      <div className="container-wrapper">
        <div className="container-fluid">
          <table className={`table table-basic trip-table noselect`} >
            <Thead />
            <tbody>
              {this.props.legCollection.map((legs: LegRow, i: number) => {
                return ([
                  <TripRow
                    key={i}
                    id={i}
                    legs={legs}
                    visible={this.isVisible(i)}
                    onClick={this.handleClick}
                  />,
                  <TripRowMore
                    key={i + 1 * 100}
                    visible={this.isVisible(i)}
                    legs={legs}
                  />,
                ]);
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  private handleClick = (id: number) => this.setState({ showMore: this.state.showMore === id ? id : null})
  
  private isVisible = (i: number) => this.state.showMore === i;
}
export default TripTable;