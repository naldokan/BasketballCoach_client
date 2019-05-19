import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'
import { Row, Col, Button } from 'reactstrap'; 

import './styles.scss';


class Game extends Component {
  
  handleThrowMode = () => this.props.history.push('/game/progress')

  render() {
    return (
      <div className="w-100 game-lobby">
        <Row className='justify-content-center align-items-center'>
          <Col className='order-2 order-sm-1 col-xs-12 col-sm-4 offset-sm-2 col-xl-3 offset-xl-3'>
            <Row>
              <Col className='col-12'>
                <Button
                  color="primary"
                  className="game-mode-button btn-block"
                  onClick={this.handleThrowMode}>
                  Free Throw
                </Button>
              </Col>
              <Col className='col-12'>
                <Button
                  color="success"
                  className="game-mode-button btn-block">Drills</Button>
              </Col>
            </Row>
          </Col>
          <Col className='order-1 order-sm-2 col-12 col-sm-6 mb-5'>
            <p className='caption'>Why not try?</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default compose(
  withRouter
)(Game);
