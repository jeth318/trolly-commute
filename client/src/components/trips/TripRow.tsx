import * as React from 'react';
import { TripRowProps as Props, Leg } from '../../InterfaceCollection';
import * as moment from 'moment';
const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

class TripRow extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    let mobClass: string;
    iOS ? mobClass = '-ios' : mobClass = '';
    const leg = this.props.legs.Leg;
    return (
      <div className="ui grid" >
      
        <div className={"three wide column"} style={{alignSelf: 'center'}}> {this.props.legs.Leg[0].Origin.time} {this.CheckDelays(leg[0])}</div>
        <div className={"six wide column"} style={{alignSelf: 'center'}}>{this.GetLegColors(leg)}</div>
        <div className={"three wide column"} style={{alignSelf: 'center'}}>{this.GetLegTravelTime(leg)}</div>
        <div className={"three wide column"} style={{alignSelf: 'center'}}>{leg[leg.length - 1].Destination.time}</div>
        <div className="one wide column accessibility" style={{alignSelf: 'center'}} >{this.CheckAccessibility(leg)}</div>
      </div>

      
    );
  }

  /* private onClick = () => {
    this.props.onClick(this.props.id);
  } */

  private CheckDelays = (legObj: Leg) => {
    if (legObj.cancelled) {
      return <span style={{ color: 'red' }}> INSTÄLLD</span>;
    }
    if (legObj.Origin.rtTime != null) {
      let a = moment(legObj.Origin.date + 'T' + legObj.Origin.time);

      let b = moment(legObj.Origin.date + 'T' + legObj.Origin.rtTime);
      let minDiff = b.diff(a, 'minutes');

      if (minDiff > 0) {
        return <span style={{ color: 'red' }}>+{minDiff}</span>;
      } else if (minDiff < 0) {
        return <span style={{ color: 'green' }}>{minDiff}</span>;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  private CheckAccessibility = (legObj: Leg[]) => {
    for (let i = 0; i < legObj.length; i++) {
      if (legObj[i].name !== 'GÅ') {
        if (legObj[i].accessibility === 'wheelChair') {
          return <div><img src="/images/wheelChair.png" className="accessibility" /></div>;
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
          let source = '../../../images/';
          switch (leg.name)  {
            case 'SJ Regional':
              source += 'sj_logo.png';
              break;
            case 'NSB Regionaltåg':
              source += 'nsb_logo.png';
              break;
            case 'TÅGAB Regiontåg':
              source += 'tagab_logo.jpg';
              break;
            default:
              source += 'qmark.png';
              break;
          }
          return (
            <img key={leg.id} src={source} className="legLogo-special" />
          );
        } else {
          return (
            <div
              key={index}
              className="legLogo"
              style={{ backgroundColor: leg.fgColor, color: leg.bgColor }}
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