import * as React from 'react';

interface Props {
  handleSwap: () => void;
}

class SwapCircle extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      spin: false,
    };
  }
  handleSwap = () => {
    this.setState({ spin: true });
    setTimeout(() => { this.setState({ spin: false }); }, 700);
    this.props.handleSwap();
  }

  render() {
    let classProps;
    this.state.spin ?
      classProps = 'swap-spin' :
      classProps = 'swap';

    return (
      <div className="swapDiv" >
        <img
          onClick={this.handleSwap}
          className={classProps}
          id="swapImg"
          src="images/swap.png"
        />
      </div>
    );
  }
}
export default SwapCircle;