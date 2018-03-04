import * as _ from 'lodash';
// import faker from 'faker';
import * as React from 'react';
import { Search, Grid } from 'semantic-ui-react'
import API from '../../api/APIService';
const api = new API();

/* const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, '$'),
}))
 */


class SemanticSearch extends React.Component <any, any>{
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })
  }

  handleSearchChange = (e, { value }) => {
    
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()
      
    }, 500)
    api.GetStopLocations(value)
    .then((res: any)=>{
      let adjustedRes = _.map(res, (r: any)=>{
        r.title = r.name;
        r.description = r.city;
        return r;
      })
      console.log(adjustedRes);
      this.setState({
        isLoading: false,
        results: adjustedRes,
      })
    })
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Grid>
        <Grid.Column width={16}>
          <Search
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
