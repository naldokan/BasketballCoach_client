import React, { Component } from 'react';
import { withRouter, Prompt } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'

import cx from 'classnames'
import { Row, Col, Button } from 'reactstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import fp from 'lodash/fp'

import {
  connectGame,
  disconnectGame,
  checkGame,
  startGame,
  pauseGame,
  resumeGame,
  stopGame,
  finishGame 
} from 'redux/modules/game/actions'
import { throwRequest, finishRequest } from 'redux/modules/api/actions'
import { electron } from 'my-electron'
import { Round } from 'utils'

import playground from 'playground.png';
import 'react-circular-progressbar/dist/styles.css';
import './styles.scss';


const progressStatus = {
  INIT: 0,
  FREE: 1,
  OCCUPIED: 2,
  GOING: 3,
  PAUSED: 4,
  COMPLETE: 5,
  REVIEW: 6
}

class GameProgress extends Component {

  constructor(props) {
    super(props)
    this.state = {
      progress: progressStatus.GOING,
      time: 0,
      shots: [],
    }
  }

  componentDidMount() {
    window.onbeforeunload = this.handleCloseWindow
    this.props.throwRequest()
    this.props.connectGame({
      showGameStatus:   this.showGameStatus,
      updateLastShot:   this.updateLastShot,
      updateTime:       this.updateTime,
      controlSuccess:   this.controlSuccess,
      finishGame:       this.finishGame,
      socketError:      this.socketError
    })
  }

  componentWillUnmount() {
    window.onbeforeunload = undefined
  }

  showGameStatus = ({ status, user }) => {
    this.props.finishRequest()
    if (status) {
      this.setState({ progress: progressStatus.FREE })
    } else {
      this.setState({ progress: progressStatus.OCCUPIED, countDown: 30, user },
        () => this.countDownTimer = setInterval(this.countDown, 1000))
    }
  }

  countDown = () => {
    if (this.state.countDown > 0) {
      this.setState({ countDown: this.state.countDown - 1 })
    } else {
      clearInterval(this.countDownTimer)
    }
  }

  countElapsedTime = () => this.setState({ time: this.state.time + 10 })

  updateLastShot = data => this.setState({ shots: this.state.shots.concat(data) })

  updateTime = data => this.setState({ time: Round(data) })

  controlSuccess = () => {
    this.props.finishRequest()
    switch (this.state.progress) {
      case progressStatus.FREE:
        this.setState({ time: 0 })
        this.elapsedTimer = setInterval(this.countElapsedTime, 100)
        return this.setState({ progress: progressStatus.GOING })

      case progressStatus.GOING:
        clearInterval(this.elapsedTimer)
        return this.setState({ progress: progressStatus.PAUSED})

      case progressStatus.PAUSED:
      default:
        this.elapsedTimer = setInterval(this.countElapsedTime, 100)
        return this.setState({ progress: progressStatus.GOING})
    }
  }

  finishGame = () => this.setState({ progress: progressStatus.COMPLETE })

  socketError = e => {
    const { remote } = electron
    this.props.finishRequest()
    remote.dialog.showMessageBox(
      remote.getCurrentWindow(), {
        buttons: ['OK'],
        defautlId: 1,
        type: 'error',
        message: 'Sorry, Network connection lost.',
      },
      () => this.props.history.push('/game')
    )
  }

  handleFinishClick = () => {
    clearInterval(this.elapsedTimer)
    this.setState({ progress: progressStatus.COMPLETE })
    this.props.finishGame()
  }
  
  handleStartClick = () => {
    this.props.throwRequest()
    switch (this.state.progress) {
      case progressStatus.FREE:
        return this.props.startGame()

      case progressStatus.OCCUPIED:
        return this.props.checkGame()

      case progressStatus.GOING:
        clearInterval(this.elapsedTimer)    
        return this.props.pauseGame()

      case progressStatus.PAUSED:
        return this.props.resumeGame()

      case progressStatus.COMPLETE:
        return this.setState({ progress: progressStatus.REVIEW })

      case progressStatus.REVIEW:
      default:
        return this.props.history.push('/game/detail')
    }
  }

  getStartButtonText = () => {
    switch (this.state.progress) {
      case progressStatus.INIT:
      case progressStatus.FREE:
        return 'Start'

      case progressStatus.OCCUPIED:
        return 'Try again'
      
      case progressStatus.GOING:
        return 'Pause'

      case progressStatus.PAUSED:
        return 'Resume'

      case progressStatus.COMPLETE:
        return 'Review'

      case progressStatus.REVIEW:
      default:
        return 'Detail'
    }
  }

  handleStopClick = () => {
    switch (this.state.progress) {
      case progressStatus.FREE:
      case progressStatus.OCCUPIED:
        this.props.disconnectGame()
        clearInterval(this.countDownTimer)
        return this.props.history.push('/game')

      case progressStatus.GOING:
        clearInterval(this.elapsedTimer)
      case progressStatus.PAUSED:
      case progressStatus.COMPLETE:
      case progressStatus.REVIEW:
        this.props.throwRequest()
        return this.props.checkGame()

      default:
    }
  }

  getStopButtonText = () => {
    switch (this.state.progress) {
      case progressStatus.INIT:
      case progressStatus.FREE:
      case progressStatus.OCCUPIED:
        return 'Go back'
      
      case progressStatus.GOING:
      case progressStatus.PAUSED:
        return 'Stop'

      case progressStatus.COMPLETE:
      case progressStatus.REVIEW:
      default:
        return 'Play again'
    }
  }

  handleNavigateAway = ({ pathname }) => {
    // remote.app.getVersion()
    if (this.state.progress === progressStatus.OCCUPIED) {
      clearInterval(this.countDownTimer)
      const navigate = this.safeNavigate(pathname)
      navigate()
      return false
    }

    this.confirmStopGame(this.safeNavigate(pathname))
    return false
  }

  safeNavigate = path => () => this.setState(
    { 'progress': progressStatus.INIT },
    () => this.props.history.push(path)
  )

  handleCloseWindow = e => {
    switch (this.state.progress) {
      case progressStatus.GOING:
      case progressStatus.PAUSED:
        const { remote } = electron
        e.returnValue = false
        this.confirmStopGame(() => this.setState(
          { 'progress': progressStatus.INIT },
          remote.app.quit)
        )
        return;

      default:
        this.props.disconnectGame()
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
      response => {
        if (response === 0) {
          clearInterval(this.elapsedTimer)
          this.props.disconnectGame()
          onYes()
        }
      }
    )
  }

  capitalizeFirstLetter =  name =>
    name && name.length > 0 ? name.charAt(0).toUpperCase() + name.slice(1) : undefined

  formatNumber = (num, length) => {
      let r = "" + num;
      while (r.length < length) {
          r = "0" + r;
      }
      return r;
  }

  render() {
    const { shots } = this.state
    const lastShot =
      this.state.progress === progressStatus.REVIEW ? {
        releaseAngle: fp.meanBy('releaseAngle')(shots),
        releaseTime: fp.meanBy('releaseTime')(shots),
        elbowAngle: fp.meanBy('elbowAngle')(shots),
        legAngle: fp.meanBy('legAngle')(shots),
      } : shots.length > 0 ? shots[shots.length - 1]
        : {
        releaseAngle: 0,
        releaseTime: 0,
        elbowAngle: 0,
        legAngle: 0
      }
    const total = shots.length
    const goals = shots.filter(val => val.success).length
    const fails = total - goals
    const accuracy = total > 0 ? Round(goals * 100 / total) : 0

    const { time } = this.state
    const min = this.formatNumber(Math.round(time / 1000 / 60), 2)
    const sec = this.formatNumber(Math.round(time / 1000) % 60, 2)
    const ms = this.formatNumber(Math.round(time % 1000), 2)

    const circularColor = accuracy >= 90 ? '#188e28'
      : accuracy >=75 ? '#e0ab26'
      : accuracy >= 50 ? '#e05d25'
      : '#960000'

    return (
      <>
        <Prompt
          when={this.state.progress === progressStatus.OCCUPIED ||
            this.state.progress === progressStatus.GOING ||
            this.state.progress === progressStatus.PAUSED}
          message={this.handleNavigateAway}
        />
        <Row className='d-flex align-items-center game-progress-container'>
          { this.state.progress >= progressStatus.GOING &&
          <Col className='game-detail col-md-5 col-12 order-2 order-md-1 mb-5 mb-md-0'>
            <Row>
              <Col className='overall col-12 col-sm-6 col-md-12 mb-4'>
                <Row>
                  <Col>Goals</Col>
                  <Col>{ goals }</Col>
                </Row>
                <Row>
                  <Col>Fails</Col>
                  <Col>{ fails }</Col>
                </Row>
                <Row>
                  <Col>Accuracy</Col>
                  <Col>{ accuracy }<small>%</small></Col>
                </Row>
                <Row>
                  <Col>Elapsed Time</Col>
                  <Col>{ min }:{ sec }&nbsp;{ ms }</Col>
                </Row>
              </Col>
              <Col className='last-try col-12 col-sm-6 col-md-12'>
                <Row>
                  <Col>Release Angle</Col>
                  <Col>{ lastShot.releaseAngle }</Col>
                </Row>
                <Row>
                  <Col>Release Time</Col>
                  <Col>{ lastShot.releasTime }</Col>
                </Row>
                <Row>
                  <Col>Elbow Angle</Col>
                  <Col>{ lastShot.elbowAngle }</Col>
                </Row>
                <Row>
                  <Col>Leg Angle</Col>
                  <Col>{ lastShot.legAngle }</Col>
                </Row>
              </Col>
            </Row>
          </Col> }
          <Col className={cx(
            'game-control-pane',
            'text-center',
            'order-1 order-md-2',
            'col-12',
            (this.state.progress === progressStatus.INIT ||
              this.state.progress === progressStatus.FREE) ? 'col-sm-6 offset-sm-3 col-md-4 offset-md-4'
              : this.state.progress === progressStatus.OCCUPIED ? 'col-sm-8 offset-sm-2'
              : 'col-sm-6 offset-sm-3 col-md-3 offset-md-0'
          )}>
            <Row>
              <Col>
                { this.state.progress === progressStatus.OCCUPIED ? (
                  <p className='busy-game-text my-5'>
                    Sorry, {this.capitalizeFirstLetter(this.state.user)} is now playing.<br/>
                    { this.state.countDown > 0 ? 'Please try again after ' + this.state.countDown + ' seconds.'
                        : 'Please wait for a while until he finishes and try again.'}
                  </p>
                ) : (
                  <CircularProgressbar
                    value={accuracy}
                    strokeWidth={1}
                    counterClockwise={true}
                    text={`${total}`}
                    styles={{ path: { stroke: circularColor } }}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col className={cx(
                'col-8 offset-2',
                { 'col-md-6 offset-md-3 col-xl-4 offset-xl-4': this.state.progress === progressStatus.OCCUPIED }
              )}>
                <Button
                  color="primary"
                  className='game-control-button'
                  onClick={this.handleStartClick}
                  disabled={this.state.progress === progressStatus.OCCUPIED && this.state.countDown > 0}>
                  { this.getStartButtonText() }
                </Button>
              </Col>
              <Col className={cx(
                'col-8 offset-2',
                { 'col-md-6 offset-md-3 col-xl-4 offset-xl-4': this.state.progress === progressStatus.OCCUPIED }
              )}>
                { this.state.progress !== progressStatus.GOING &&
                  this.state.progress !== progressStatus.PAUSED && (
                  <Button color="primary" className='game-control-button' onClick={this.handleStopClick}>
                    { this.getStopButtonText() }
                  </Button>
                )}
              </Col>
              { (this.state.progress === progressStatus.GOING ||
                this.state.progress === progressStatus.PAUSED) &&
                this.state.shots.length > process.env.REACT_APP_MINIMUM_TRIES_A_GAME && (
                <Col className='col-8 offset-2'>
                  <Button color="primary" className='game-control-button' onClick={this.handleFinishClick}>
                    Finish
                  </Button>
                </Col> )}
            </Row>
          </Col>
          { this.state.progress >= progressStatus.GOING &&
          <Col className='col-md-3 col-12 col-sm-8 offset-md-1 offset-sm-2 order-3'>
            <img className='w-100' src={playground} />
          </Col> }
        </Row>
      </>
    );
  }
}

const actions = {
  connectGame,
  disconnectGame,
  checkGame,
  startGame,
  pauseGame,
  resumeGame,
  stopGame,
  finishGame,
  throwRequest,
  finishRequest
}

export default compose(
  connect(undefined, actions),
  withRouter
)(GameProgress);
