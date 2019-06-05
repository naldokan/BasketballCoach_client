import React, { Component } from 'react';

import cx from 'classnames'
import { Row, Col, Button } from 'reactstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import fp from 'lodash/fp'

import { Round, accuracyColor } from 'utils'
import FancyBox  from 'components/fancybox'
import FactTile  from 'components/facttile'
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
    min: this.formatNumber(Math.floor(milisecond / 1000 / 60), 2),
    sec: this.formatNumber(Math.floor(milisecond / 1000) % 60, 2),
    ms: this.formatNumber(Math.floor((milisecond % 1000) / elapsedTimeInterval), 2)
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

    return (
      <div className='game-progress-container'>
        { this.props.progress === progressStatus.OCCUPIED ? (
          <Row>
            <Col>
              <p className='busy-game-text my-5'>
                Sorry, {this.capitalizeFirstLetter(this.props.user)} is now playing.<br/>
                { this.props.countDown > 0 ? 'Please try again after ' + this.props.countDown + ' seconds.'
                    : 'Please wait for a while until he finishes and try again.'}
              </p>
            </Col>
          </Row>
        ) : (
          <>
            <Row>
              <Col className={cx(
                'col-6',
                'col-sm-4 offset-sm-2 order-md-1',
                'col-md-3 offset-md-1',
                'col-xl-2 offset-xl-2'
              )}>
                <FancyBox className='goal-box'>
                  <FactTile caption='Goals' titleFontSize='2' contentFontSize='5'>
                    { goals }
                  </FactTile>
                </FancyBox>
              </Col>
              <Col className={cx(
                'col-6',
                'col-sm-4 order-md-3',
                'col-md-3',
                'col-xl-2'
              )}>
                <FancyBox className='fail-box'>
                  <FactTile caption='Misses' titleFontSize='2' contentFontSize='5'>
                    { fails }
                  </FactTile>
                </FancyBox>
              </Col>
              <Col className='col-12 col-md-4 order-md-2'>
                <FancyBox className='elapsed-time'>
                  <FactTile caption='Elapsed Time' titleFontSize='2' contentFontSize='5'>
                    { totalTime.min }:{ totalTime.sec }&nbsp;<small>{ totalTime.ms }</small>
                  </FactTile>
                </FancyBox>
              </Col>
            </Row>
            <Row className='game-detail order-2 order-lg-1 my-lg-5'>
              <Col className={cx(
                'last-try',
                'order-lg-2',
                'col-12',
                'col-lg-6',
                'col-xl-4'
              )}>
                <Row>
                  <Col className='col-6 col-sm-3 col-lg-6 field-title'>Accuracy</Col>
                  <Col className='col-6 col-sm-3 col-lg-6 field-value'>{ accuracy }&nbsp;<small>%</small></Col>
                  <Col className='col-6 col-sm-3 col-lg-6 field-title'>Release Angle</Col>
                  <Col className='col-6 col-sm-3 col-lg-6 field-value'>{ lastShot.releaseAngle }</Col>
                  <Col className='col-6 col-sm-3 col-lg-6 field-title'>Release Time</Col>
                  <Col className='col-6 col-sm-3 col-lg-6 field-value'>{ lastShot.releaseTime }</Col>
                  <Col className='col-6 col-sm-3 col-lg-6 field-title'>Elbow Angle</Col>
                  <Col className='col-6 col-sm-3 col-lg-6 field-value'>{ lastShot.elbowAngle }</Col>
                  <Col className='col-6 col-sm-3 col-lg-6 field-title'>Leg Angle</Col>
                  <Col className='col-6 col-sm-3 col-lg-6 field-value'>{ lastShot.legAngle }</Col>
                </Row>
              </Col>
              <Col className={cx(
                'order-lg-1',
                'col-10 offset-1 my-3',
                'col-sm-8 offset-sm-2',
                'col-md-6 offset-md-3',
                'col-lg-3 offset-lg-0 mt-5 mb-0',
                'col-xl-2 offset-xl-2'
              )}>
                <CircularProgressbar
                  value={accuracy}
                  strokeWidth={1}
                  counterClockwise={true}
                  text={`${total}`}
                  styles={{ path: { stroke: accuracyColor(accuracy) } }}
                />
              </Col>
              <Col className={cx(
                'goal-map-pane',
                'order-lg-3',
                'col-10 offset-1 my-3',
                'col-sm-8 offset-sm-2',
                'col-md-6 offset-md-3',
                'col-lg-3 offset-lg-0',
                'col-xl-2'
              )}>
                <GoalMap positions={shots}/>
              </Col>
            </Row>
          </>
        )}
        <Row className='my-4 mt-xl-5 mb-lg-0 order-1 order-lg-3'>
          <Col className={cx(
            'col-sm-4 offset-sm-2',
            'col-md-3 offset-md-3',
            'col-xl-2 offset-xl-4',
          )}>
            <Button
              color="primary"
              className='game-control-button'
              onClick={this.props.startClick}
              disabled={
                this.props.progress === progressStatus.OCCUPIED
                && this.props.countDown > 0
              }
            >
              { this.getStartButtonText() }
            </Button>
          </Col>
            { this.props.progress !== progressStatus.GOING &&
              this.props.progress !== progressStatus.PAUSED ? (
                <Col className={cx(
                  'col-sm-4',
                  'col-md-3',
                  'col-xl-2',
                )}>
                  <Button
                    className='game-control-button'
                    onClick={ this.props.stopClick }
                    color="primary"
                  >
                    { this.getStopButtonText() }
                  </Button>
                </Col>
              ) : this.props.shots.length >= process.env.REACT_APP_MINIMUM_TRIES_A_GAME && (
                <Col className={cx(
                  'col-sm-4',
                  'col-md-3',
                  'col-xl-2',
                )}>
                  <Button
                    className='game-control-button'
                    onClick={ this.props.finishClick }
                    color="primary"
                  >
                    Finish
                  </Button>
                </Col>
              )
            }
        </Row>
      </div>
    )
  }
}

export default GameProgress;
