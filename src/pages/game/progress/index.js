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
      progress: progressStatus.INIT,
      allowNavigateAway: false
    }
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
      : this.stopProgress()

  stopProgress = () => {
    this.setState({ progress: progressStatus.INIT})
  }

  // also should work on window closed

  handleNavigateAway = location => {
    // remote.app.getVersion()
    const { remote } = electron
    remote.dialog.showMessageBox(
      remote.getCurrentWindow(), {
        buttons: ['Yes', 'No'],
        defautlId: 1,
        type: 'warning',
        message: 'You are in progress now. Really stop this game?',
      },
      response => response === 0 && this.setState({ allowNavigateAway: true })
    )
    return false
  }
  
  render() {
    return (
      <>
        { !this.state.allowNavigateAway &&
          <Prompt
            when={this.state.progress != progressStatus.INIT}
            message={this.handleNavigateAway}
          />}
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
