import React, { Component, Fragment } from 'react';

class App extends Component {
  render() {
    return (
      <Fragment>
        <input type="text" value={this.props.data.spec} onChange={(e) => this.props.onChange('spec' ,e.target.value)} />
        <input type="number" value={this.props.data.count} onChange={(e) => this.props.onChange('count' ,e.target.value)} />
        <input type="number" value={this.props.data.price} onChange={(e) => this.props.onChange('price' ,e.target.value)} />
      </Fragment>
    );
  }
}

export default App;
