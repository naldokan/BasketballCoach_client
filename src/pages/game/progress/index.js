import React, { Component } from 'react';

import cx from 'classnames'
import { Row, Col, Button } from 'reactstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import fp from 'lodash/fp'

import { Round } from 'utils'
import { GoalMap } from 'components/chart'
import { progressStatus, elapsedTimeInterval } from '../game'

import 'react-circular-progressbar/dist/styles.css';
import './styles.scss';


class GameProgress extends Component {

  getStartButtonText = () => {
    switch (this.props.progress) {
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
        return 'View detail'
    }
  }

  getStopButtonText = () => {
    switch (this.props.progress) {
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

  capitalizeFirstLetter =  name =>
    name && name.length > 0 ? name.charAt(0).toUpperCase() + name.slice(1) : undefined

  formatNumber = (num, length) => {
      let r = "" + num;
      while (r.length < length) {
          r = "0" + r;
      }
      return r;
  }

  formatMilisecond = milisecond => ({
    min: this.formatNumber(Math.round(milisecond / 1000 / 60), 2),
    sec: this.formatNumber(Math.round(milisecond / 1000) % 60, 2),
    ms: this.formatNumber(Math.round((milisecond % 1000) / elapsedTimeInterval), 2)
  })

  render() {
    const shots = this.props.shots
    const lastShot =
      shots.length > 0 ? 
      this.props.progress === progressStatus.REVIEW ? {
        releaseAngle: Round(fp.meanBy('releaseAngle')(shots)),
        releaseTime: Round(fp.meanBy('releaseTime')(shots)),
        elbowAngle: Round(fp.meanBy('elbowAngle')(shots)),
        legAngle: Round(fp.meanBy('legAngle')(shots)),
      } : shots[shots.length - 1]
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

    const { totalElapsedTime, currentElapsedTime } = this.props
    const totalTime = this.formatMilisecond(totalElapsedTime)
    const delayTime = this.formatMilisecond(currentElapsedTime)

    const circularColor = accuracy >= 90 ? '#188e28'
      : accuracy >=75 ? '#e0ab26'
      : accuracy >= 50 ? '#e05d25'
      : '#960000'

    return (
      <Row className='d-flex align-items-center game-progress-container'>
        { (this.props.progress === progressStatus.REVIEW || 
          this.props.progress === progressStatus.COMPLETE ) && (
          <Col className='col-12 text-center mb-4'>
            <p className='text-game-finished text-success'><b>GAME FINISHED</b></p>
          </Col>
        )}
        { this.props.progress >= progressStatus.GOING &&
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
                <Col>{ accuracy }&nbsp;<small>%</small></Col>
              </Row>
              <Row>
                <Col>Elapsed Time</Col>
                <Col>{ totalTime.min }:{ totalTime.sec }&nbsp;<small>{ totalTime.ms }</small></Col>
              </Row>
              <Row>
                <Col>Delay</Col>
                <Col>{ delayTime.min }:{ delayTime.sec }&nbsp;<small>{ delayTime.ms }</small></Col>
              </Row>
            </Col>
            <Col className='last-try col-12 col-sm-6 col-md-12'>
              <Row>
                <Col>Release Angle</Col>
                <Col>{ lastShot.releaseAngle }</Col>
              </Row>
              <Row>
                <Col>Release Time</Col>
                <Col>{ lastShot.releaseTime }</Col>
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
          (this.props.progress === progressStatus.INIT ||
            this.props.progress === progressStatus.FREE) ? 'col-sm-6 offset-sm-3 col-md-4 offset-md-4'
            : this.props.progress === progressStatus.OCCUPIED ? 'col-sm-8 offset-sm-2'
            : 'col-sm-6 offset-sm-3 col-md-3 offset-md-0'
        )}>
          <Row>
            <Col>
              { this.props.progress === progressStatus.OCCUPIED ? (
                <p className='busy-game-text my-5'>
                  Sorry, {this.capitalizeFirstLetter(this.props.user)} is now playing.<br/>
                  { this.props.countDown > 0 ? 'Please try again after ' + this.props.countDown + ' seconds.'
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
              'col-10 offset-1',
              this.props.progress === progressStatus.OCCUPIED ? 'col-md-6 offset-md-3 col-xl-4 offset-xl-4'
                : 'col-xl-8 offset-xl-2'
            )}>
              <Button
                color="primary"
                className='game-control-button'
                onClick={this.props.startClick}
                disabled={this.props.progress === progressStatus.OCCUPIED && this.props.countDown > 0}>
                { this.getStartButtonText() }
              </Button>
            </Col>
            <Col className={cx(
              'col-10 offset-1',
              this.props.progress === progressStatus.OCCUPIED ? 'col-md-6 offset-md-3 col-xl-4 offset-xl-4'
                : 'col-xl-8 offset-xl-2'
            )}>
              { this.props.progress !== progressStatus.GOING &&
                this.props.progress !== progressStatus.PAUSED && (
                <Button
                  className='game-control-button'
                  onClick={this.props.stopClick}
                  color="primary"
                >
                  { this.getStopButtonText() }
                </Button>
              )}
            </Col>
            { (this.props.progress === progressStatus.GOING ||
              this.props.progress === progressStatus.PAUSED) &&
              this.props.shots.length >= process.env.REACT_APP_MINIMUM_TRIES_A_GAME && (
              <Col className='col-10 offset-1 col-xl-8 offset-xl-2'>
                <Button color="primary" className='game-control-button' onClick={this.props.finishClick}>
                  Finish
                </Button>
              </Col> )}
          </Row>
        </Col>
        { this.props.progress >= progressStatus.GOING &&
          <Col className={cx(
            'col-12',
            'col-md-3  offset-md-1',
            'col-sm-8 offset-sm-2',
            'order-3'
          )}>
            <GoalMap positions={shots}/>
          </Col> }
      </Row>
    );
  }
}

export default GameProgress;
