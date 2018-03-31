import * as React from 'react';
import SearchButton from './SearchButton';
import SwapCircle from './SwapCircle';
import ClearCirkle from './ClearCirkle';
import Flash from '../atoms/Flash';
import {FlashType} from '../../InterfaceCollection';
import * as classNames from 'classnames';
const Autosuggest = require('react-autosuggest');
import API from '../../api/APIService';
import {
  SearchFormProps as Props,
  SuggestionProps as Suggestion
} from '../../InterfaceCollection';
const api = new API;
import Error from '../atoms/Error';

interface State {
  spam: boolean;
  valueTo: string | null;
  toId: string | null;
  valueFrom: string | null;
  fromId: string | null;
  suggestions: Suggestion[];
  swap: Boolean;
}

class SearchForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      spam: true,
      valueTo: '',
      toId: null,
      valueFrom: '',
      fromId: null,
      suggestions: [],
      swap: false,
    };
  }

  componentWillMount() {
    if (localStorage.getItem('from') !== null) {
      this.setState({
        valueFrom: localStorage.getItem('from'),
        valueTo: localStorage.getItem('to'),
        fromId: localStorage.getItem('fromId'),
        toId: localStorage.getItem('toId'),
      });
    }
  }

  render() {
    const { suggestions, valueFrom, valueTo } = this.state;
    let inputPropsFrom = {
      placeholder: 'Ange starthållplats',
      value: valueFrom,
      id: 'inputFrom',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onClick: this.handleSelect,
      className: this.createClassNamesFrom()
    };
    let inputPropsTo = {
      placeholder: 'Ange sluthållplats',
      value: valueTo,
      id: 'inputTo',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onClick: this.handleSelect,
      className: this.createClassNamesTo()
    };

    let formGroupFromClasses = classNames({
      'form-group': true,
      'slideUp': this.state.swap
    });
  
    let formGroupToClasses = classNames({
      'form-group': true,
      'slideDown': this.state.swap
    });
    return (
      <div className="row main-row">
        <div className="inner-container col-xs-12 col-sm-12 col-md-4 col-md-offset-4">
          <div className={formGroupFromClasses}>
            <div className="btn-group relative">
              {this.autoSuggest('inputFrom', inputPropsFrom, suggestions)}
              {this.state.valueFrom && <ClearCirkle onClick={this.handleClear} />}
            </div>
            {this.props.errors.fromId && <Error type="from" />}
          </div>
          <div className={formGroupToClasses}>
            <div className="btn-group relative">
              {this.autoSuggest('inputTo', inputPropsTo, suggestions)}
              {this.state.valueTo && <ClearCirkle onClick={this.handleClear} />}
            </div>
            {this.props.errors.toId && <Error type="to" />}
            {this.props.errors.sameDest && <Error type="same" />}
          </div>
          <SwapCircle handleSwap={this.handleSwap} />
          {this.props.visibleFlash ? this.renderFlash() : this.renderSearchButton()}
        </div>
      </div>
    );
  }

  private renderSearchButton() {
    return(
      <SearchButton
        handleSubmit={this.props.handleSubmit}
      />
    );
  }

  private renderFlash() {
    return(
      <Flash
        title={'Luuugn i Vagnen! Nu ska vi inte spamma för mycket här'}
        message={'Sök-knappen kommer tillbaka om några sekunder.'}
        type={FlashType.WARNING}
        visible={true}
      />
    );
  }

  private autoSuggest = (id: string, inputProps: any, suggestions: any) => {
    return (
      <Autosuggest
        id={id}

        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionSelected={this.onSuggestionSelected}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }

  private getSuggestionValue = (suggestion: Suggestion) => {
    return suggestion.fullName;
  }

  private renderSuggestion = (suggestion: Suggestion) => {
    return (
      <span data-stopid={suggestion.id.toString()}>{suggestion.fullName}</span>
    );
  }

  private handleSelect = (e: React.MouseEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) { e.currentTarget.setSelectionRange(0, 100); }
  }

  private shouldRenderSuggestions = (value: string) => {
    return value.trim().length >= 3;
  }

  private onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  }

  private onSuggestionsFetchRequested = ({ value, reason }: any) => {
    if (reason !== 'input-focused') {
      api.GetStopLocations(value)
        .then((res: any) => {
          this.setState({ suggestions: res });
        });
    }
  }
  private createClassNamesFrom () {
    let classString = 'react-autosuggest__input';
    classString += this.props.errors.fromId ? ' error' : '';
    return classString;
  }

  private createClassNamesTo () {
    let classString = 'react-autosuggest__input';
    classString += this.props.errors.toId ? ' error' : '';
    return classString;
  }

  private onSuggestionSelected = (event: any, { suggestion, suggestionValue, method }: any) => {
    let id = event.target.id;
    let parId = event.target.parentElement.id;
    if (id.includes('inputFrom') || parId.includes('inputFrom')) {
      this.props.handleInputFrom(suggestionValue, suggestion.id.toString());
    } else if (id.includes('inputTo') || parId.includes('inputTo')) {
      this.props.handleInputTo(suggestionValue, suggestion.id.toString());
    }
  }

  private onChange = (event: React.MouseEvent<HTMLInputElement>, { newValue, method }: any) => {
    let id = event.currentTarget.id;
    if (id.includes('inputFrom')) {
      this.setState({ valueFrom: newValue, fromId: '' });

    } else if (id.includes('inputTo')) {
      this.setState({ valueTo: newValue, toId: '' });
    }
  }

  private handleSwap = () => {
    this.setState({
      swap: true,
      fromId: this.state.toId,
      toId: this.state.fromId,
      valueFrom: this.state.valueTo,
      valueTo: this.state.valueFrom,
    });

    setTimeout(()=> {
      this.setState({
        swap: false,
        fromId: this.state.fromId,
        toId: this.state.toId,
        valueFrom: this.state.valueFrom,
        valueTo: this.state.valueTo,
      });
    // tslint:disable-next-line
    }, 700);
    this.props.handleSwap();
  }

  private handleClear = (id: string) => {
    if (id === 'inputFrom') {
      this.setState({ valueFrom: '', fromId: '' });

    } else if (id === 'inputTo') {
      this.setState({ valueTo: '', toId: '' });
    }
  }

  private onBlur = (event: any, { highlightedSuggestion }: any) => {
    if (highlightedSuggestion !== null) {
      let id = event.target.id;
      let parId = event.target.parentElement.id;

      if (id.includes('inputFrom') || parId.includes('inputFrom')) {
        this.props.handleInputFrom(highlightedSuggestion.name, highlightedSuggestion.id.toString());
      } else if (id.includes('inputTo') || parId.includes('inputTo')) {
        this.props.handleInputTo(highlightedSuggestion.name, highlightedSuggestion.id.toString());
      }
    }
  }
}
export default SearchForm;
