import * as React from 'react';
import { TripRowMoreProps as Props } from '../../InterfaceCollection';
import { Leg as LegInterface} from '../../InterfaceCollection';

class TripRowMore extends React.Component<Props, {}> {
 
  trimName = (name: string) => name.split(',', 1);
  
  renderMoreInfo = () => {
    const lastLeg = this.props.legs.Leg.length - 1;
    const { Leg } = this.props.legs;

    return Leg.map((leg: LegInterface, i: number) => {
      return (
        <div key={i} className={leg.type === 'WALK' ? 'legPieceWalk' : 'legPiece'}>
          <div className={i === 0? 'stopBlobFirst' : 'stopBlob'} />
          <div className={i === lastLeg? 'stopBlobFinal': ''} />

          <span>{this.trimName(leg.Origin.name)}</span>
          <span className="track"> {this.getTrack(leg.Origin.track)}</span>
          <span className="time">  @ {leg.Origin.time}</span>
          <br />
          {leg.type === 'WALK' ? this.getWalk() : this.getLegSubColors(leg)}
          <br />
          {i === lastLeg && <span>{this.trimName(leg.Destination.name)}</span>}
          {i === lastLeg && <span className="time"> @ {leg.Destination.time}</span>}
        </div>
      );
    });
  }

  render() {
    return (
        <div className="moreInfoRow">{this.renderMoreInfo()}</div>
    );
  }
  private getWalk = () => {
    return (
    <div>
      <img 
        src={__dirname + '../../../images/svg/walk.svg'} 
        style={{ backgroundColor: 'white' }} 
        className="legLogo-special" 
      />
    </div>
  );}

  private getTrack = (track: any) => {
    if (!track) {
      return null;
    } else if (!isNaN(track)) {
      return ' (Spår ' + track + ')';
    } else {
      return ' (Läge ' + track + ')';
    }
  }

  private getLegSubColors = (leg: LegInterface) => {
    if (leg.type === 'WALK') {
      return;
    } else {
      return (
        <div
          id={leg.id}
          className="legLogo-sub"
          style={{ backgroundColor: leg.fgColor, color: leg.bgColor }}
        >
          {leg.name}
        </div>
      );
    }
  }
}
export default TripRowMore;