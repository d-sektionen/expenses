import React, { Component } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import dd from './documentDefinition';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

class App extends Component {
  constructor() {
    super();

    this.createPdfDebounced = debounce(this.createPdf, 1000);

    this.state = {
      pdf: ""
    }
  }

  render() {
    return (
      <div className="Preview">
        <iframe src={this.state.pdf} title="pdfFrame" />
      </div>
    );
  }

  componentDidMount() {
    this.createPdf(this.props);
  }

  componentWillReceiveProps(newProps) {
    // kolla om lika som förr

    this.createPdfDebounced(newProps);
  }

  createPdf(props) {
    pdfMake.createPdf(dd(props)).getDataUrl(dataUrl => {
      this.setState({
        pdf: dataUrl
      });
    });
  }
}

export default App;
