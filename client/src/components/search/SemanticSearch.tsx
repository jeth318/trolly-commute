// import * as _ from 'lodash';
import * as React from 'react';
import { Search, Grid } from 'semantic-ui-react'
import API from '../../api/APIService';
const api = new API();

class SemanticSearch extends React.Component<any, any>{
  constructor() {
    super({});
    this.state = {
      isLoading: false,
      results: [],
      value: '',
      typeingTimeOut: 0
    };
  }
  componentWillMount() {
    this.resetComponent()
  }

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
    self.state.typeingTimeOut && clearTimeout(self.state.typeingTimeOut)

    self.setState({
      value: value,
      typeingTimeOut: setTimeout(() => {
        this.doSearch();
      }, 300)
    })
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Grid>
        <Grid.Column width={16}>
          <Search
            className="search-input"
            size="large"
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={results}
            value={value}
            minCharacters={3}
            {...this.props}
          />
        </Grid.Column>
      </Grid>
    )
  }
}
export default SemanticSearch;
