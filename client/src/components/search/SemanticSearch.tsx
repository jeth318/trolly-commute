// import * as _ from 'lodash';
import * as React from 'react';
import { Search, Grid } from 'semantic-ui-react'
import API from '../../api/APIService';
import classNames from 'classnames';

const api = new API();

class SemanticSearch extends React.Component<any, any>{
  constructor() {
    super({});
    this.state = {
      isLoading: false,
      results: [],
      value: '' || this.props.swappedValue,
      typeingTimeOut: 0
    };
  }
  componentWillMount() {
    console.log('Will mount')
    this.resetComponent()
    if (this.props.storedLocation) {
      this.setState({
        value: this.props.storedLocation.name.split(',')[0]
      },this.doSearch)
    }
  }

  formGroupFromClasses = () => {
    return classNames({
    'slideUp': this.props.identifier === 'origin' && this.props.swap,
    'slideDown': this.props.identifier === 'destination' && this.props.swap
  })};

  resetComponent = () => this.setState({
    isLoading: false,
    results: [],
    value: '',
    searchId: '',
  })

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })
    { }
    this.props.handleSelect(result, this.props.identifier)
  }

  private doSearch = () => {
    if (this.state.value.length > 2) {
      api.GetStopLocations(this.state.value)
        .then((response: any) => {
          this.setState({
            isLoading: false,
            results: response.stopLocations,
          })
        })
    }
  }
  handleSearchChange = (e, { value }) => {
    const self = this;
    this.props.handleChange(value, this.props.identifier)
    self.state.typeingTimeOut && clearTimeout(self.state.typeingTimeOut)

    self.setState({
      value: value,
      typeingTimeOut: setTimeout(() => {
        this.doSearch();
      }, 300)
    })
  }

  private onFocus = (event: any, data: any) => {
    console.log(this.state);
    const inputField = event.target
    setTimeout(function(x){
      inputField.setSelectionRange(0,inputField.value.length);
    }, 0, inputField);
      console.log('FOCUS');
  }

  render() {
    console.log('Rerendered')
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
            {...this.props}
          />
        </Grid.Column>
      </Grid>
      </div>
    )
  }
}
export default SemanticSearch;
