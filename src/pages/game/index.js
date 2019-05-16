import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import cx from 'classnames'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink
} from 'reactstrap';

import './styles.scss';
import { Row, Col, Button } from 'reactstrap'; 

import './styles.scss';

class Game extends Component {
  
  handleThrowMode = () => this.props.history.push('/game/progress')

  render() {
    return (
      <div className="w-100">
        <p className='headline'>Why not try?</p>
        <Row className='justify-content-center'>
          <Col className='col-12 col-sm-4 col-md-3'>
            <Button
              color="primary"
              className="game-mode-button btn-block"
              onClick={this.handleThrowMode}
            >
              Free Throw
            </Button>
          </Col>
          <Col className='col-1'></Col>
          <Col className='col-12 col-sm-4 col-md-3'>
            <Button
              color="success"
              className="game-mode-button btn-block">Drills</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default compose(
  withRouter
)(Game);
