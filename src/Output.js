import React, { Component } from 'react';
import ClipboardJS from 'clipboard';

const reduceState = (state) => ({
  name: state.name,
  clearing: state.clearing,
  account: state.account,
  bank: state.bank,
  purpose: state.purpose,
  items: {...state.items},
});

class Output extends Component{
  render() {
    const {state} = this.props;

    const reducedState = reduceState(state);

    let output = JSON.stringify(reducedState);
    //output = pako.deflate(output, { to: 'string' });
    output = Buffer.from(output, 'utf8').toString('base64');
    const {origin, pathname} = window.location;
    return (
      <div className="Output">
        <code ref={(elem) => {this.outputElem = elem}}>{`${origin}${pathname}?output=${output}`}</code>
        <div className="button-group">
          <a href="" ref={(elem) => {this.copyButton = elem}}>
            Kopiera länk  
          </a>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.clipboardObj = new ClipboardJS(this.copyButton, {
      target: () => this.outputElem
    });
  }

  componentWillUnmount() {
    this.clipboardObj.destroy();
  }
}


export default Output;
