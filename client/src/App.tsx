import * as React from 'react';
import API from './api/APIService';
import Header from './components/Header';
import Loading from './components/atoms/Loading';
import TripTable from './components/trips/TripTable';
import SearchForm from './components/search/SearchForm';
import { LegCollection } from './InterfaceCollection';
import './App.css';
const api = new API;

export interface SearchFormProps {
  resetInputId: (id: string) => void;
  handleInputTo: (value: string, id: string) => void;
  handleInputFrom: (value: string, id: string) => void;
  handleSubmit: () => void;
  error: JSX.Element |  null;
  handleSwap: () => void;
}

interface State {
  inputFrom: string;
  inputTo: string;
  fromId: string;
  toId: string;
  legCollection: LegCollection |  null;
  loading: boolean;
  visibleFlash: boolean;
  submitCount: any;
  recentSubmit: boolean;
  errors: {
    fromId: boolean;
    toId: boolean;
    sameDest: boolean;
  };
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
      },
    };
  }

  componentWillMount() {
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
        },
      });
    }
  }
  render() {
    let triptable: JSX.Element |  null;
    let loading: JSX.Element | null;

    if (this.state.legCollection !== null) {
      triptable = <TripTable legCollection={this.state.legCollection} />;
    } else {
      triptable = null;
    }
    if (this.state.loading) {
      loading = <Loading />;
      triptable = null;
    } else {
      loading = null;
    }

    return (
      <div>
        <Header />
        <SearchForm
          resetInputId={this.resetInputId}
          handleInputFrom={this.handleInputFrom}
          handleInputTo={this.handleInputTo}
          handleSubmit={this.handleSubmit}
          errors={this.state.errors}
          handleSwap={this.handleSwap}
          visibleFlash={this.state.visibleFlash}
        />
        {loading}
        {triptable}
      </div>
    );
  }
  private setLocalStorage() {
    localStorage.setItem('from', this.state.inputFrom);
    localStorage.setItem('to', this.state.inputTo);
    localStorage.setItem('fromId', this.state.fromId);
    localStorage.setItem('toId', this.state.toId);
  }

  private handleInputFrom = (value: string, id: string) => {
    this.setState({
      inputFrom: value,
      fromId: id,
    });
  }

  private handleInputTo = (value: string, id: string) => {
    this.setState({
      inputTo: value,
      toId: id,
    });
  }

  private resetInputId = (id: string) =>  {
    if (id.includes('inputFrom')) {
      this.setState({
        fromId: '',
        errors: {
          fromId: false,
          toId: false,
          sameDest: false
        }
      });
    } else if (id.includes('inputTo')) {
      this.setState({
        toId: '',
        errors: {
          fromId: false,
          toId: false,
          sameDest: false
        }
      });
    }
  }

  private preventSpam() {
    this.setState({
      loading: true, 
      recentSubmit: true, 
      submitCount: this.state.submitCount + 1}
    );
    setTimeout(() => { this.setState({ recentSubmit: false, submitCount: 0 });}, 7000);
    if (this.state.submitCount === 2 && this.state.recentSubmit) {
      this.setState({visibleFlash: true});
      setTimeout(() => {this.setState({ visibleFlash: false });}, 7000);
    }
  }

  private handleSubmit = () =>  {
    let fromIdError = false;
    let toIdError = false;
    let sameDestError = false;
    let fromId = this.state.fromId;
    let toId = this.state.toId;

    if (fromId !== '' && toId !== '' && fromId !== toId) {
     
      this.preventSpam();      
      api.GetTrips(this.state.fromId, this.state.toId)
        .then((res: LegCollection) =>  {
          this.setState({
            legCollection: res,
            loading: false,
          });
        });
      this.setLocalStorage();

    } else {
      if (fromId === '' && toId) {
        fromIdError = true;
        toIdError = false;
      } else if (toId === '' && fromId)  {
        toIdError = true;
        fromIdError = false;
      } else if (fromId === '' && toId === '') {
        fromIdError = true;
        toIdError = true;
      } else if (fromId === toId) {
        sameDestError = true;
      }
      this.setState({ errors: { fromId: fromIdError, toId: toIdError, sameDest: sameDestError }});
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
        sameDest: sameDest
      }
    });
  }
}
export default App;
