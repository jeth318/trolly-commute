import * as React from 'react';
import {FlashProps as Props, FlashType} from '../../InterfaceCollection';

class Flash extends React.Component<Props, any> {

    render() {
        let flashType;
        switch(this.props.type) {
            case FlashType.INFO:
                flashType = 'info';
                break;
            case FlashType.WARNING: 
                flashType = 'warning';
                break;
            case FlashType.ERROR:
                flashType = 'error';
                break;
            default:
                break;
            }
        let flashClass = `alert alert-${flashType}`; 
        return (
            <div className="flash-container">
                <div id="alertDanger" className={flashClass}>
                    <strong>{this.props.title}</strong>
                    <p>{this.props.message}</p>
                </div>
            </div>
            );
    }
}

export default Flash;