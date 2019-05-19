import React, { Component } from 'react';
import { withRouter, Prompt } from "react-router";
import { compose } from 'redux'

import { Row, Col, Button } from 'reactstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPlay, faStop, faPause, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import FactTile from 'components/facttile';
import { electron } from 'my-electron'

import playground from 'playground.png';
import './styles.scss';

const progressStatus = {
  INIT: 0,
  PROGRESS: 1,
  PAUSED: 2
}

class GameProgress extends Component {

  constructor(props) {
    super(props)
    this.state = {
      progress: progressStatus.INIT
    }
  }

  componentDidMount() {
    window.onbeforeunload = this.handleCloseWindow
  }

  componentWillUnmount() {
    window.onbeforeunload = undefined
  }

  handleStartClick = () => {
    switch (this.state.progress) {
      case progressStatus.INIT:
        return this.setState({ progress: progressStatus.PROGRESS })
      case progressStatus.PROGRESS:
        return this.setState({ progress: progressStatus.PAUSED})
      default:
        return this.setState({ progress: progressStatus.PROGRESS})
    }
  }

  handleStopClick = () =>
    this.state.progress === progressStatus.INIT
      ? this.props.history.push('/game')
      : this.disconnectGame() && this.setState({ progress: progressStatus.INIT})

  handleNavigateAway = location => {
    // remote.app.getVersion()
    this.confirmStopGame(
      () => this.setState({ 'progress': progressStatus.INIT },
        () => this.props.history.push(location.pathname)
      )
    )
    return false
  }

  handleCloseWindow = e => {
    if (this.state.progress !== progressStatus.INIT) {
      const { remote } = electron
      e.returnValue = false
      this.confirmStopGame(() => this.setState({ 'progress': progressStatus.INIT }, remote.app.quit))
    }
  }

  confirmStopGame = onYes => {
    const { remote } = electron
    remote.dialog.showMessageBox(
      remote.getCurrentWindow(), {
        buttons: ['Yes', 'No'],
        defautlId: 1,
        type: 'warning',
        message: 'You are in progress now. Really stop this game?',
      },
      response => response === 0 && this.disconnectGame() && onYes()
    )
  }

  disconnectGame = () => {
    return true
  }
  
  render() {
    return (
      <>
        <Prompt
          when={this.state.progress !== progressStatus.INIT}
          message={this.handleNavigateAway}
        />
        <Row className='d-flex align-items-center game-progress-container'>
          <Col className='game-detail col-md-5 col-12 order-2 order-md-1 mb-5 mb-md-0'>
            <Row>
              <Col className='overall col-12 col-sm-6 col-md-12 mb-4'>
                <Row>
                  <Col>Goals</Col>
                  <Col>3</Col>
                </Row>
                <Row>
                  <Col>Fails</Col>
                  <Col>4</Col>
                </Row>
                <Row>
                  <Col>Accuracy</Col>
                  <Col>87<small>%</small></Col>
                </Row>
                <Row>
                  <Col>Elapsed Time</Col>
                  <Col>01:30</Col>
                </Row>
              </Col>
              <Col className='last-try col-12 col-sm-6 col-md-12'>
                <Row>
                  <Col>Leg Angle</Col>
                  <Col>3</Col>
                </Row>
                <Row>
                  <Col>Release Angle</Col>
                  <Col>3</Col>
                </Row>
                <Row>
                  <Col>Release Time</Col>
                  <Col>3</Col>
                </Row>
                <Row>
                  <Col>Vertical</Col>
                  <Col>3</Col>
                </Row>
                <Row>
                  <Col>Speed</Col>
                  <Col>3</Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col className='game-control-pane text-center col-md-3 offset-md-0 col-12 col-sm-6 offset-sm-3 order-1 order-md-2'>
            <Row>
              <Col>
                <CircularProgressbar
                  value={34}
                  strokeWidth={1}
                  counterClockwise={true}
                  text={34} />
              </Col>
            </Row>
            <Row>
              <Col className='col-sm-12 col-xl-8 offset-xl-2'>
                <Button color="primary" className='game-control-button' onClick={this.handleStartClick}>
                  { this.state.progress === progressStatus.INIT ? 'Start'
                    : this.state.progress === progressStatus.PROGRESS ? 'Pause'
                    : 'Resume' }
                </Button>
              </Col>
              <Col className='col-sm-12 col-xl-8 offset-xl-2'>
                <Button color="primary" className='game-control-button' onClick={this.handleStopClick}>
                  { this.state.progress === progressStatus.INIT ? 'Go Back' : 'Stop' }
                </Button>
              </Col>
            </Row>
          </Col>
          <Col className='col-md-3 col-12 col-sm-8 offset-md-1 offset-sm-2 order-3'>
            <img className='w-100' src={playground} />
          </Col>
        </Row>
      </>
    );
  }
}

export default compose(
  withRouter
)(GameProgress);
