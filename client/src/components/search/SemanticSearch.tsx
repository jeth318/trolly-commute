// import * as _ from 'lodash';
import * as React from 'react';
import { Search, Grid } from 'semantic-ui-react';
import API from '../../api/APIService';
import classNames from 'classnames';
import { SemanticSearchProps as Props } from '../../InterfaceCollection';

const api = new API();

class SemanticSearch extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: false,
      results: [],
      value: '',
      typeingTimeOut: 0
    };
  }

  componentDidMount() {
    this.resetComponent();
    if (this.props.storedlocation) {
      this.setState({
        value: this.props.storedlocation.name.split(',')[0]
      },            this.doSearch);
    }
  }

  componentWillReceiveProps() {
    // If swap is true, set state with value from prop and trigger new search to update the results.
    this.props.swap && this.setState({value: this.props.value}, this.doSearch);
  }

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <div className={this.formGroupFromClasses()}>
      <Grid>
        <Grid.Column width={16}>
          <Search
            onFocus={this.onFocus}
            className="search-input"
            size="large"
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={results}
            value={this.props.value}
            minCharacters={3}
          />
        </Grid.Column>
      </Grid>
      </div>
    );
  }

  private formGroupFromClasses = () => {
    const { identifier, swap } = this.props;
    return classNames({
    'slideUp': identifier === 'origin' && swap,
    'slideDown': identifier === 'destination' && swap
  });}

  private resetComponent = () => this.setState({
    isLoading: false,
    results: [],
    value: ''
  })

  private handleResultSelect = (e, { result }) => {
    console.log(result);
    this.setState({ value: result.name, price: result.distance });
    this.props.onSelect(result, this.props.identifier);
  }

  private doSearch = async () => {
    if (this.state.value.length > 2) {
      try {
        const response = await api.getStopLocations(this.state.value)
        this.setState({
          isLoading: false,
          results: response.stopLocations
        });
      } catch (error) {
        return console.error(error);
      }
    }
  }
  
  private handleSearchChange = (e, { value }) => {
    const self = this;
    this.props.onChange(value, this.props.identifier);
    self.state.typeingTimeOut && clearTimeout(self.state.typeingTimeOut);

    self.setState({
      value,
      typeingTimeOut: setTimeout(() => {
        this.doSearch();
      },                         300)
    });
  }

  private onFocus = (event: any, data: any) => {
    const inputField = event.target;
    setTimeout(function() {
      inputField.setSelectionRange(0,inputField.value.length);
    },         0, inputField);
  }
}
export default SemanticSearch;
