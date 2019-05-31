import React, { Component } from 'react';
import { withRouter, Prompt } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'

import cx from 'classnames'
import Fade from 'react-reveal/Fade';
import { Row, Col } from 'reactstrap';
import GameProgress from 'pages/game/progress'
import GameReview from 'pages/game/review'
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

import './styles.scss';


export const progressStatus = {
  INIT: 0,
  FREE: 1,
  OCCUPIED: 2,
  GOING: 3,
  PAUSED: 4,
  COMPLETE: 5,
  REVIEW: 6,
  REVIEW_DETAIL: 7
}

export const elapsedTimeInterval = 10

class Game extends Component {

  constructor(props) {
    super(props)
    this.state = {
      progress: progressStatus.REVIEW_DETAIL,
      totalElapsedTime: 0,
      currentElapsedTime: 0,
      shots: []
      // shots: Array(53).fill(0).map(v =>({
      //   releaseTime: 0,
      //   releaseAngle: 0,
      //   legAngle: 0,
      //   elbowAngle: 0,
      //   x: 1000,
      //   y: 0,
      //   success: 1,
      // })),
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
      this.setState({
        progress: progressStatus.FREE,
        currentElapsedTime: 0,
        totalElapsedTime: 0,
        shotNotice: false,
        finishNotice: false,
        shots: []
      })
    } else {
      this.setState({
        progress: progressStatus.OCCUPIED,
        currentElapsedTime: 0,
        totalElapsedTime: 0,
        shotNotice: false,
        finishNotice: false,
        countDown: 30,
        shots: [],
        user
      },
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

  countElapsedTime = () => this.setState({
    totalElapsedTime: this.state.totalElapsedTime + elapsedTimeInterval,
    currentElapsedTime: this.state.currentElapsedTime + elapsedTimeInterval
  })

  updateLastShot = data => {
    clearTimeout(this.shotNoticeTimer)
    this.shotNoticeTimer = setTimeout(this.clearShotNoticeTimer, 2000)
    this.setState({
      shots: this.state.shots.concat(data),
      currentElapsedTime: 0,
      shotNotice: true
    })
  }

  clearShotNoticeTimer = () => {
    clearTimeout(this.shotNoticeTimer)
    this.setState({ shotNotice: false })
  }

  updateTime = data => this.setState({ totalElapsedTime: Round(data) })

  controlSuccess = () => {
    this.props.finishRequest()
    switch (this.state.progress) {
      case progressStatus.FREE:
        this.elapsedTimer = setInterval(this.countElapsedTime, elapsedTimeInterval)
        return this.setState({ progress: progressStatus.GOING })

      case progressStatus.GOING:
        clearInterval(this.elapsedTimer)
        return this.setState({ progress: progressStatus.PAUSED})

      case progressStatus.PAUSED:
      default:
        this.elapsedTimer = setInterval(this.countElapsedTime, elapsedTimeInterval)
        return this.setState({ progress: progressStatus.GOING})
    }
  }

  finishGame = () => this.setState({ progress: progressStatus.REVIEW })

  socketError = message => {
    const { remote } = electron
    this.props.finishRequest()
    remote.dialog.showMessageBox(
      remote.getCurrentWindow(), {
        buttons: ['OK'],
        defautlId: 1,
        type: 'error',
        message,
      },
      () => this.props.history.push('/game')
    )
  }

  handleFinishClick = () => {
    clearInterval(this.elapsedTimer)
    clearTimeout(this.shotNoticeTimer)
    this.finishNoticeTimer = setTimeout(this.clearFinishNoticeTimer, 2000)
    this.setState({ progress: progressStatus.REVIEW, shotNotice: false, finishNotice: true })
    this.props.finishGame()
  }

  clearFinishNoticeTimer = () => {
    this.setState({ finishNotice: false })
    clearTimeout(this.finishNoticeTimer)
  }

  handleStartClick = () => {
    switch (this.state.progress) {
      case progressStatus.FREE:
        this.props.throwRequest()
        return this.props.startGame(this.props.mode)

      case progressStatus.OCCUPIED:
        this.props.throwRequest()
        return this.props.checkGame()

      case progressStatus.GOING:
        this.props.throwRequest()
        clearInterval(this.elapsedTimer)    
        return this.props.pauseGame()

      case progressStatus.PAUSED:
        this.props.throwRequest()
        return this.props.resumeGame()

      case progressStatus.COMPLETE:
        clearTimeout(this.finishNoticeTimer)
        return this.setState({ progress: progressStatus.REVIEW, finishNotice: false })

      case progressStatus.REVIEW:
        return this.setState({ progress: progressStatus.REVIEW_DETAIL })

      case progressStatus.REVIEW_DETAIL:
      default:
        return this.setState({ progress: progressStatus.REVIEW })
    }
  }

  handleStopClick = () => {
    switch (this.state.progress) {
      case progressStatus.FREE:
      case progressStatus.OCCUPIED:
        const navigate = this.safeNavigate('/game')
        this.props.disconnectGame()
        clearInterval(this.countDownTimer)
        return navigate()

      case progressStatus.GOING:
      case progressStatus.PAUSED:
      case progressStatus.COMPLETE:
      case progressStatus.REVIEW:
      case progressStatus.REVIEW_DETAIL:
      default:
        clearInterval(this.elapsedTimer)
        clearTimeout(this.shotNoticeTimer)
        clearTimeout(this.finishNoticeTimer)
        this.props.throwRequest()
        return this.props.checkGame()

    }
  }

  handleNavigateAway = ({ pathname }) => {
    // remote.app.getVersion()
    switch (this.state.progress) {
      case progressStatus.OCCUPIED:
        clearInterval(this.countDownTimer)
      case progressStatus.FREE:
      case progressStatus.COMPLETE:
      case progressStatus.REVIEW:
      case progressStatus.REVIEW_DETAIL:
        clearTimeout(this.finishNoticeTimer)
        this.props.disconnectGame()
        const navigate = this.safeNavigate(pathname)
        navigate()
        return false

      case progressStatus.GOING:
      case progressStatus.PAUSED:
      default:
        this.confirmStopGame(this.safeNavigate(pathname))
        return false
    }
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
          clearTimeout(this.shotNoticeTimer)
          clearTimeout(this.successFinishTimer)
          this.props.disconnectGame()
          onYes()
        }
      }
    )
  }

  render() {
    const { shots, progress } = this.state
    const success = shots.length > 0 ? shots[shots.length - 1].success : undefined
    const showNotice = !!(this.state.shotNotice || this.state.finishNotice)

    return (
      <div className='game-panel'>
        <Prompt
          when={progress !== progressStatus.INIT}
          message={this.handleNavigateAway}
        />
          <Fade when={showNotice}>
            <p className={cx(
              'text-game-notice',
              { 'bring-to-top': showNotice },
              this.state.shotNotice ? success ? 'text-success' : 'text-danger' : 'text-success'
            )}>
              <b>{this.state.shotNotice ? success ? 'SUCCESS' : 'FAILED' : 'GAME FINISHED'}</b>
            </p>
          </Fade>
          { progress === progressStatus.COMPLETE ? (
              <Row>
                <Col className='col-12 text-center mb-4'>
                  <p className='text-game-finished text-success'><b>GAME FINISHED</b></p>
                </Col>
              </Row>
            ) : (progress === progressStatus.REVIEW_DETAIL ||
                progress === progressStatus.REVIEW) && (
              <Row>
                <Col className='col-12 text-center mb-4'>
                  <p className='text-game-finished text-success'><b>GAME RESULT</b></p>
                </Col>
              </Row>
            )
          }
          { progress !== progressStatus.REVIEW_DETAIL ? (
            <GameProgress
              progress={progress}
              shots={this.state.shots}
              startClick={this.handleStartClick}
              stopClick={this.handleStopClick}
              finishClick={this.handleFinishClick}
              countDown={this.state.countDown}
              totalElapsedTime={this.state.totalElapsedTime}
              currentElapsedTime={this.state.currentElapsedTime}
              user={this.state.user}
            />
          ) : (
            <GameReview
              shots={this.state.shots}
              summaryClick={this.handleStartClick}
              replayClick={this.handleStopClick}
            />  
          )}
      </div>
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
)(Game);
