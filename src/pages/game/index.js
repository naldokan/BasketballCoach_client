import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'
import { Row, Col, Button } from 'reactstrap'; 
import cx from 'classnames';

import { throwRequest } from 'redux/modules/api/actions'
import './styles.scss';


class Game extends Component {
  constructor(props) {
    super(props)
    this.state = { gameFree: true }
  }
  
  handleThrowMode = () => this.props.history.push('/game/progress')

  componentDidMount() {
    this.props.throwRequest({
      url: '/game/check',
      onSuccess: ({ status, user }) => {
        if (status !== 'free') {
          this.gameUser = user
        }
        this.setState({ gameFree: status === 'free' })
      }
    })
  }

  capitalizeFirstLetter =  name => name.charAt(0).toUpperCase() + name.slice(1)

  render() {
    return (
      <div className="w-100 game-lobby">
        <Row className='justify-content-center align-items-center'>
          <Col className={cx(
            'order-2 order-sm-1',
            'col-xs-12',
            'col-sm-4 offset-sm-1',
            'col-xl-3 offset-xl-2'
          )}>
            <Row>
              <Col className='col-12'>
                <Button
                  color="primary"
                  disabled={!this.state.gameFree}
                  className="game-mode-button btn-block"
                  onClick={this.handleThrowMode}
                >
                  Free Throw
                </Button>
              </Col>
              <Col className='col-12'>
                <Button
                  color="success"
                  disabled={!this.state.gameFree}
                  className="game-mode-button btn-block"
                >
                  Drills</Button>
              </Col>
            </Row>
          </Col>
          <Col className={cx(
            'order-1 order-sm-2 mb-5',
            'col-12',
            'col-sm-6 offset-sm-1',
            'offset-xl-1'
          )}>
            { this.state.gameFree ? <p className='caption'>Why not try?</p>
                : <p>Sorry, {this.capitalizeFirstLetter(this.gameUser)} is now playing.
                  <br/>Please wait for a moment until he finishes and try again.</p>}
          </Col>
        </Row>
      </div>
    );
  }
}

const actions = {
  throwRequest
}

export default compose(
  connect(undefined, actions),
  withRouter
)(Game);
