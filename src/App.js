import React, { Component } from 'react';
import qs from 'querystring';
import './App.css';
import ItemInput from './ItemInput';
import Pdf from './Pdf';
import Output from './Output';

const validators = {
  //'clearing': '(([0-9]{4}-[0-9]{1})|([0-9]{4}))$',
  //'account': '[0-9 ]+'
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      items: {
        0: { price: "", sum: 0, count: "", spec: "" },
        1: { price: "", sum: 0, count: "", spec: "" },
        2: { price: "", sum: 0, count: "", spec: "" },
        3: { price: "", sum: 0, count: "", spec: "" }
      },
      total: 0,
      purpose: "",
      clearing: "",
      account: "",
      bank: "",
      valid: {}
    }

    this.Input = (props) => (
      <label>
        <div>{props.title}</div>
        <input
          onChange={(e) => this.safeSetState({ [props.name]: e.target.value })}
          value={this.state[props.name]}
          data-valid={this.state.valid[props.name] !== false}
          />
      </label>
    );

  }

  render() {
    return (
      <div className="App">
        <div className="Inputs">
          <this.Input name="name" title="För- och efternamn"/>
          
          <div className="item-input-grid">
            <span>Specifikation</span>
            <span>Antal</span>
            <span>Pris</span>
            {
              [0,1,2,3].map(i => (
                <ItemInput 
                  key={`iteminput${i}`}
                  onChange={(k, v) => this.safeSetState({ items: { [i]: { [k]: v } } })}
                  data={this.state.items[i]}
                />
              ))
            }
          </div>

          <label>
            <div>Ändamål med inköpet.</div>
            <textarea rows="2" onChange={(e) => this.safeSetState({ purpose: e.target.value })} value={this.state.purpose} />
          </label>
          
          <this.Input name="clearing" title="Clearing-nr"/>
          <this.Input name="account" title="Konto-nr"/>
          <this.Input name="bank" title="Bank"/>

        </div>
        <Output state={this.state} setState={(state) => this.setState(state)} />
        <Pdf {...this.state}/>
      </div>
    );
  }

  componentDidMount() {
    const {output} = qs.parse(window.location.search.slice(1));
    if (output) {
      try {
        let value = output
        value = Buffer.from(value, 'base64').toString('utf8');
        //value = pako.inflate(value, { to: 'string' });
        value = JSON.parse(value);
      
        this.safeSetState(value);
      }
      catch (ex) {
        console.error(`Error parsing output param:\n${ex}`);
      }
    }
  }

  safeSetState(newState) {
    this.setState((prevState) => {
      return Object.keys(newState).reduce((previous, key) => {
        const obj = { ...previous }

        if (['name', 'clearing', 'account', 'bank', 'purpose'].includes(key))
          obj[key] = newState[key];

        if (Object.prototype.hasOwnProperty.call(validators, key))
          obj.valid = {
            ...prevState.valid,
            [key]: new RegExp(validators[key]).test(newState[key])
          };

        if (key === 'items') {
          obj.items = this.validateMergeItems(newState.items, prevState.items);
          obj.total = Object.keys(obj.items).reduce((accumulator, k) => accumulator + obj.items[k].sum, 0);
        }

        return obj;
      }, {}); 
    });
  }

  validateMergeItems(newItems, prevItems) {
    return Object.keys(newItems).reduce((previousItems, itemKey) => {
      const obj = { ...previousItems }
      obj[itemKey] = Object.keys(newItems[itemKey]).reduce((previousField, fieldKey) => {
        const itemObj = { ...previousField }
        if (['spec', 'count', 'price'].includes(fieldKey))
          itemObj[fieldKey] = newItems[itemKey][fieldKey];
        return itemObj;
      }, { ...previousItems[itemKey] });
      const {price, count} = obj[itemKey];
      obj[itemKey].sum = price * count;
      
      return obj;
    }, {...prevItems});
  }

  
}

export default App;
