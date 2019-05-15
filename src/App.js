import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'
import { Container } from 'react-bootstrap'

import './App.css';


library.add(faStroopwafel)

class App extends Component {
  render() {
    return (
      <Container>
        
      </Container>
    );
  }
}

export default App;
