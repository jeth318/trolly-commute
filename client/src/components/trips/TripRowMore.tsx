import * as React from 'react';
import { TripRowMoreProps as Props, Leg } from '../../InterfaceCollection';

class TripRowMore extends React.Component<Props, {}> {
 
  trimName = (name: string) => name.split(',', 1)
  
  renderMoreInfo = () => {
    const lastLeg = this.props.legs.Leg.length - 1;
    return this.props.legs.Leg.map((leg: Leg, i: number) => {
      return (
        <div key={i} className={leg.type === 'WALK' ? 'legPieceWalk' : 'legPiece'}>
          <div className={i===0? 'stopBlobFirst' : 'stopBlob'} />
          <div className={i === lastLeg? 'stopBlobFinal': ''} />

          <span>{this.trimName(leg.Origin.name)}</span>
          <span className="track"> {this.getTrack(leg.Origin.track)}</span>
          <span className="time">  @ {leg.Origin.time}</span>
          <br />

          {leg.type === 'WALK' ? this.getWalk() : this.getLegSubColors(leg)}
          <br />
          <br />
          {i === lastLeg &&
            <span>{this.trimName(leg.Destination.name)}</span>}
          {i === lastLeg &&
            <span className="time"> @ {leg.Destination.time}</span>}
        </div>
      );
    });
  }

  render() {
    return (
      <div className='moreInfoRow'>
          {this.renderMoreInfo()}
      </div>
      
    );
  }

  private getWalk = () => <img src={__dirname + '../../../images/walk.png'} style={{ backgroundColor: 'white' }} className="legLogo-special" />;

  private getTrack = (track: any) => {
    if (!track) {
      return null;
    } else if (!isNaN(track)) {
      return ' (Spår ' + track + ')';
    } else {
      return ' (Läge ' + track + ')';
    }
  }

  private getLegSubColors = (leg: Leg) => {
    if (leg.type === 'WALK') {
      return;
    } else {
      return (
        <div
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