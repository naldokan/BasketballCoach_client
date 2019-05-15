import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class Login extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React + Electron = <span role="img" aria-label="love">😍</span></h2>
        </div>
        <p className="App-intro">
          <b> Release 0.2.7 </b>
        </p>
      </div>
    );
  }
}

export default Login;
