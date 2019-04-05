import * as React from 'react';
import API from './api/APIService';
import Header from './components/Header';
import Loading from './components/atoms/Loading';
import TripAccordion from './components/trips/TripAccordion';
import SemanticSearch from './components/search/SemanticSearch';
import { LegCollection } from './InterfaceCollection';
import './App.css';
import Error from './components/atoms/Error';
import SearchButton from './components/search/SearchButton';
import SwapCircle from './components/search/SwapCircle';
const api = new API;

interface State {
  inputFrom: string;
  inputTo: string;
  fromId: string;
  toId: string;
  legCollection: LegCollection | null;
  loading: boolean;
  visibleFlash: boolean;
  submitCount: any;
  recentSubmit: boolean;
  errors: {
    fromId: boolean;
    toId: boolean;
    sameDest: boolean;
    other: Boolean,
  };
  swap: boolean;
  isSwapped: boolean;
}

class App extends React.Component<{}, State> {

  constructor(state: State) {
    super(state);
    this.state = {
      inputFrom: '',
      inputTo: '',
      fromId: '',
      toId: '',
      legCollection: null,
      loading: false,
      visibleFlash: false,
      submitCount: 0,
      recentSubmit: true,
      errors: {
        fromId: false,
        toId: false,
        sameDest: false,
        other: false
      },
      swap: false,
      isSwapped: false
    };
  }

  componentDidMount() {
    let from = localStorage.getItem('from');
    let fromId = localStorage.getItem('fromId');
    let to = localStorage.getItem('to');
    let toId = localStorage.getItem('toId');

    if (typeof from === 'string' &&
      typeof to === 'string' &&
      typeof fromId === 'string' &&
      typeof toId === 'string') {

      this.setState({
        inputFrom: from,
        inputTo: to,
        fromId: fromId,
        toId: toId,
        errors: {
          fromId: false,
          toId: false,
          sameDest: false,
          other: false
        },
      });
    }
  }

  renderTripTable() {
    return (
      <div className="ui column">
        {this.state.loading && <Loading />}
        {this.state.legCollection && !this.state.loading &&
          <TripAccordion legCollection={this.state.legCollection} />}
      </div>
    );
  }
  render() {
    return (
      <div className="app-wrapper">
        <div className="ui stackable">
          {this.renderSearch()}
          <div className="ui column">
            {!this.state.errors.other ? this.renderTripTable() : <Error type="other" />}
          </div>
        </div>
      </div>
    );
  }

  private renderSearch() {
    return (
      <div className="ui column">
        <Header />
        <SemanticSearch
          identifier="origin"
          onSelect={this.handleSelect}
          onChange={this.handleChange}
          swap={this.state.swap}
          value={this.state.inputFrom}
          storedlocation={{ name: this.state.inputFrom, id: this.state.fromId }}
        />
        {this.state.errors.fromId && <Error type="from" />}

        <SemanticSearch
          identifier="destination"
          onSelect={this.handleSelect}
          onChange={this.handleChange}
          swap={this.state.swap}
          value={this.state.inputTo}
          storedlocation={{ name: this.state.inputTo, id: this.state.toId }}
        />
        {this.state.errors.toId && <Error type="to" />}
        {this.state.errors.sameDest && <Error type="same" />}

        <SwapCircle handleSwap={this.handleSwap} />
        <SearchButton handleSubmit={this.handleSubmit} />
      </div>
    );
  }

  private handleChange = (value, identifier) => {
    if (identifier === 'origin') {
      this.resetInputId(identifier, value);
    } else {
      this.resetInputId(identifier, value);
    }
  }

  private setError = (error) => {
    console.error(error);

    this.setState({loading: false, errors: { ...this.state.errors, other: true } });
  }

  private handleSelect = (value, identifier) => {
    if (identifier === 'origin') {
      this.setState({
        fromId: value.id,
        inputFrom: value.fullName
      });
    } else {
      this.setState({
        toId: value.id,
        inputTo: value.fullName
      });
    }
  }

  private setLocalStorage() {
    const { inputFrom, inputTo, fromId, toId } = this.state;
    localStorage.setItem('from', inputFrom);
    localStorage.setItem('to', inputTo);
    localStorage.setItem('fromId', fromId);
    localStorage.setItem('toId', toId);
  }

  private resetInputId = (identifier: string, value) => {
    if (identifier === 'origin') {
      this.setState({
        inputFrom: value,
        fromId: '',
        errors: {
          fromId: false,
          toId: false,
          sameDest: false,
          other: this.state.errors.other
        }
      });
    } else {
      this.setState({
        inputTo: value,
        toId: '',
        errors: {
          fromId: false,
          toId: false,
          sameDest: false,
          other: this.state.errors.other
        }
      });
    }
  }

  private preventSpam() {
    this.setState({
      loading: true,
      recentSubmit: true,
      submitCount: this.state.submitCount + 1,
      errors: {...this.state.errors, other: false }
    }
    );
    setTimeout(() => { this.setState({ recentSubmit: false, submitCount: 0 }); }, 7000);
    if (this.state.submitCount === 2 && this.state.recentSubmit) {
      this.setState({ visibleFlash: true });
      setTimeout(() => { this.setState({ visibleFlash: false }); }, 7000);
    }
  }

  private handleSubmit = () => {
    let fromIdError = false;
    let toIdError = false;
    let sameDestError = false;
    let fromId = this.state.fromId;
    let toId = this.state.toId;

    if (fromId !== '' && toId !== '' && fromId !== toId) {
      this.preventSpam();
      api.GetTrips(this.state.fromId, this.state.toId)
        .then((res: any) => {
          this.setState({
            legCollection: res,
            loading: false,
            errors: {...this.state.errors, other: false }
          });
        })
        .catch((error) => this.setError(error));
      this.setLocalStorage();

    } else {
      if (fromId === '' && toId !== '') {
        fromIdError = true;
        toIdError = false;
      } else if (toId === '' && fromId !== '') {
        toIdError = true;
        fromIdError = false;
      } else if (fromId === '' && toId === '') {
        fromIdError = true;
        toIdError = true;
      } else if (fromId === toId) {
        sameDestError = true;
      }
      this.setState({ 
        errors: { 
          fromId: fromIdError, 
          toId: toIdError, 
          sameDest: sameDestError, 
          other: this.state.errors.other 
        }
      });
    }
  }

  private handleSwap = () => {
    let fromId = this.state.fromId;
    let toId = this.state.toId;
    let inputFrom = this.state.inputFrom;
    let inputTo = this.state.inputTo;
    let errorFromId = this.state.errors.fromId;
    let errorToId = this.state.errors.toId;
    let sameDest = this.state.errors.sameDest;

    this.setState({
      fromId: toId,
      toId: fromId,
      inputFrom: inputTo,
      inputTo: inputFrom,
      errors: {
        fromId: errorToId,
        toId: errorFromId,
        sameDest: sameDest,
        other: this.state.errors.other
      },
      swap: true,
      isSwapped: !this.state.isSwapped
    });

    setTimeout(() => {
      this.setState(({
        swap: false,
      }));
    },         600);
  }
}
export default App;
