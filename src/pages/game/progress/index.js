import React, { Component } from 'react';
import { withRouter, Prompt } from "react-router";
import { compose } from 'redux'

import cx from 'classnames'
import { Row, Col, Button } from 'reactstrap';

import { electron } from '../../../electron'

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
        <Row>
          <Col className='game-control-button'>
            <Button color="primary" onClick={this.handleStartClick}>
              {this.state.progress === progressStatus.INIT ? 'Start'
                : this.state.progress === progressStatus.PROGRESS ? 'Pause'
                : 'Resume'}
            </Button>
            <Button color="primary" onClick={this.handleStopClick}>
              {this.state.progress === progressStatus.INIT ? 'Back' : 'Stop'}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default compose(
  withRouter
)(GameProgress);
