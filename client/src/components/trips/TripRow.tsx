import * as React from 'react';
import { TripRowProps as Props, Leg } from '../../InterfaceCollection';
import moment from 'moment';

class TripRow extends React.Component<Props, {}> {
  
  render() {
    const leg = this.props.legs.Leg;
    return (
      <div className="ui grid" >
        <div className={'four wide column'} style={{alignSelf: 'center'}}> 
          {this.props.legs.Leg[0].Origin.time} {this.CheckDelays(leg[0])}
        </div>
        <div className={'five wide column'} style={{alignSelf: 'center'}}>
          {this.GetLegColors(leg)}
        </div>
        <div className={'three wide column'} style={{alignSelf: 'center'}}>
          {this.GetLegTravelTime(leg)}
        </div>
        <div className={'three wide column'} style={{alignSelf: 'center'}}>
          {leg[leg.length - 1].Destination.time}
        </div>
        <div className="one wide column accessibility" style={{alignSelf: 'center'}}>
          {this.CheckAccessibility(leg)}
        </div>
      </div>
    );
  }

  private CheckDelays = (legObj: Leg) => {

    if (!legObj.Origin.rtTime || legObj.Origin.time === legObj.Origin.rtTime) { return ''; }

    if (legObj.cancelled) {
      return <span style={{ color: 'red' }}> INSTÄLLD</span>;
    }

    let a = moment(legObj.Origin.date + 'T' + legObj.Origin.time);
    let b = moment(legObj.Origin.date + 'T' + legObj.Origin.rtTime);
    let minDiff = b.diff(a, 'minutes');

    if (minDiff > 0) {
        return <span style={{ color: 'red' }}>+{minDiff}</span>;
      } else {
        return <span style={{ color: 'green' }}>{minDiff}</span>;
      } 
  }

  private CheckAccessibility = (legObj: Leg[]) => {
    for (let i = 0; i < legObj.length; i++) {
      if (legObj[i].name !== 'GÅ') {
        if (legObj[i].accessibility === 'wheelChair') {
          return <div><img id="wheelchair" src="/images/svg/wheelchair.svg" className="accessibility" alt="wheelchair"/></div>;
        } else {
          return null;
        }
      }
    }
    return;
  }

  private GetLegTravelTime = (legObj: Leg[]) => {
    let a = moment(legObj[0].Origin.date + 'T' + legObj[0].Origin.time);
    let b = moment(legObj[legObj.length - 1].Destination.date + 'T' + legObj[legObj.length - 1].Destination.time);
    let ttMin = b.diff(a, 'minutes');
    let ttHours = b.diff(a, 'hours');

    if (ttMin >= 60) {
      return ttHours + 'h, ' + (ttMin - (ttHours * 60)) + ' min';
    } else {
      return ttMin + ' min';
    }
  }

  private GetLegColors = (legObj: Leg[]) => {
    return (
      legObj.map((leg: Leg, index: number) => {
        if (leg.type === 'WALK') {
          return null;
        } else if (leg.type === 'REG') {
          let source = '../../../images/svg/';
          switch (leg.name)  {
            case 'SJ Regional':
              source += 'sj_logo.svg';
              break;
            case 'NSB Regionaltåg':
              source += 'nsb_logo.svg';
              break;
            case 'TÅGAB Regiontåg':
              source += 'tagab_logo.svg';
              break;
            case 'Öresundståg':
              source += 'oresundstag_logo.svg';
              break;
            default:
              source += 'qmark.svg';
              break;
          }
          return (
            <img key={leg.id} src={source} className="legLogo-special" alt="leg" />
          );
        } else {
          return (
            <div
              key={index}
              className="legLogo"
              style={{ backgroundColor: leg.bgColor, color: leg.fgColor }}
            >
              {leg.sname}
            </div>
          );
        }
      })
    );
  }
}
export default TripRow;