import * as React from 'react';
import { SwapCircleProps as Props } from '../../InterfaceCollection';

class SwapCircle extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      spin: false,
    };
  }

  handleSwap = () => {
    this.setState({ spin: true });
    this.props.handleSwap();
    setTimeout(() => { this.setState({ spin: false }); }, 700);
  }

  render() {
    return (
      <div className="swapDiv" >
        <img
          onClick={this.handleSwap}
          className={this.state.spin ? 'swap-spin' : 'swap'}
          id="swapImg"
          src="images/swap.png"
        />
      </div>
    );
  }
}
export default SwapCircle;