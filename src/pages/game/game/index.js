import React, { Component } from 'react';
import { withRouter, Prompt } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'

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
      progress: progressStatus.INIT,
      totalElapsedTime: 0,
      currentElapsedTime: 0,
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
      this.setState({
        progress: progressStatus.FREE,
        currentElapsedTime: 0,
        totalElapsedTime: 0,
        shots: []
      })
    } else {
      this.setState({
        progress: progressStatus.OCCUPIED,
        currentElapsedTime: 0,
        totalElapsedTime: 0,
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

  updateLastShot = data => this.setState({ shots: this.state.shots.concat(data), currentElapsedTime: 0 })

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

  finishGame = () => this.setState({ progress: progressStatus.COMPLETE })

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
    this.setState({ progress: progressStatus.COMPLETE })
    this.props.finishGame()
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
        return this.setState({ progress: progressStatus.REVIEW })

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
        clearInterval(this.elapsedTimer)
      case progressStatus.PAUSED:
      case progressStatus.COMPLETE:
      case progressStatus.REVIEW:
      case progressStatus.REVIEW_DETAIL:
      default:
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
          this.props.disconnectGame()
          onYes()
        }
      }
    )
  }

  render() {
    return (
      <>
        <Prompt
          when={this.state.progress !== progressStatus.INIT}
          message={this.handleNavigateAway}
        />
        { this.state.progress !== progressStatus.REVIEW_DETAIL ? (
          <GameProgress
            progress={this.state.progress}
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
)(Game);
