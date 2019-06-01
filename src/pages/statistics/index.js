import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'

import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import fp from 'lodash/fp'

import FancyBox  from 'components/fancybox'
import FactTile  from 'components/facttile'
import { LineChart, BarChart, GoalColorMap, GoalMap } from 'components/chart';

import { throwRequest } from 'redux/modules/api/actions'
import { Round } from 'utils'

import './styles.scss';


const graphInfo = [
  { caption: 'Release Angle', source: 'release_angle', color: '#ff7300' },
  { caption: 'Release Time', source: 'release_time', color: '#00e1ff' },
  { caption: 'Elbow Angle', source: 'elbow_angle', color: '#d400ff' },
  { caption: 'Leg Angle', source: 'leg_angle', color: '#ff3200' }
]

const recentMode = { DAYS: 'days', TRIES: 'tries'}

const statisticsMode = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
}

class Statistics extends Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      positions: [],
    }

    this.mode = statisticsMode.WEEKLY
    this.date = new Date()
  }

  componentDidMount() {
    this.requestStatistics()
  }

  requestStatistics = () =>  this.props.throwRequest({
    url: '/statistics',
    params: {
      mode: this.mode,
      date: this.date.toJSON().slice(0, 10)
    },
    onSuccess: ({ average, list, positions }) => {

      this.setState({ average, list, positions })
    }
  })

  handleStatisticsModeClick = mode => () => {
    this.mode = mode
    this.requestStatistics()
  }

  handleNavigateDateClick = direction => () => {
    switch (this.mode) {
      case statisticsMode.WEEKLY:
        this.date.setDate(this.date.getDate() + (direction ? 7 : -7))
        break;

      case statisticsMode.MONTHLY:
        this.date.setMonth(this.date.getMonth() + (direction ? 1 : -1))
        break;

      case statisticsMode.YEARLY:
      default:
        this.date.setMonth(this.date.getYear() + (direction ? 1 : -1))
        break;
    }
    this.requestStatistics()
  }

  getGraphData = (caption, source) => {
    const { list } = this.state
    return list && list.map(value => ({
      name: value['xkey'], [caption]: value[source]
    }))
  }

  render() {
    const { average, list, positions } = this.state
    const games = fp.sumBy('game_times')(list)
    const shots = fp.sumBy('shots')(list)
    const accuracy = shots && Math.round(fp.sumBy('success')(list) * 100 / shots)

    const gameData = this.getGraphData('Played', 'game_times')

    const shotData = list && list.map(val => ({
      name: val['xkey'],
      Goal: val['success'],
      Miss: val['shots'] - val['success'],
    }))

    const accuracyData = list && list.map(val => ({
      name: val['xkey'],
      Accuracy: Round(val['success'] * 100 / val['shots'])
    }))

    return (
      <div className='statistics-page'>
        <Row className='mode-buttons justify-content-center mb-4'>
          <Col className='col-10 col-sm-4 col-md-3 col-xl-2 mb-3'>
            <Button
              className='btn-block'
              onClick={this.handleStatisticsModeClick(statisticsMode.WEEKLY)}
              color={this.mode === statisticsMode.WEEKLY ? 'success' : 'primary'}
            >
              Weekly</Button>
          </Col>
          <Col className='col-10 col-sm-4 col-md-3 col-xl-2 mb-3'>
            <Button
              className='btn-block'
              onClick={this.handleStatisticsModeClick(statisticsMode.MONTHLY)}
              color={this.mode === statisticsMode.MONTHLY ? 'success' : 'primary'}
            >
              Montly</Button>
          </Col>
          <Col className='col-10 col-sm-4 col-md-3 col-xl-2 mb-3'>
            <Button
              className='btn-block'
              onClick={this.handleStatisticsModeClick(statisticsMode.YEARLY)}
              color={this.mode === statisticsMode.YEARLY ? 'success' : 'primary'}
            >
              Yearly</Button>
          </Col>
        </Row>
        <Row className='mb-4 align-items-center'>
          <Col className='col-6 col-sm-2 order-sm-1 date-nav-buttons mb-4'>
            <Button color='primary' onClick={this.handleNavigateDateClick(false)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          </Col>
          <Col className='col-6 col-sm-2 order-sm-3 text-right date-nav-buttons mb-4'>
            <Button color='primary' onClick={this.handleNavigateDateClick(true)}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </Col>
          <Col className='col-12 col-sm-8 order-sm-2'>
            <Row className='justify-content-center'>
              <Col className='col-12 col-sm-4 col-md-3 mb-3'>
                <FancyBox>
                  <FactTile caption='Shots'>{ shots }</FactTile>
                </FancyBox>
              </Col>
              <Col className='col-12 col-sm-4  col-md-3 mb-3'>
                <FancyBox>
                  <FactTile caption='Games'>{ games }</FactTile>
                </FancyBox>
              </Col>
              <Col className='col-12 col-sm-4  col-md-3 mb-3'>
                <FancyBox>
                  <FactTile caption='Accuracy'>{ accuracy }<small>%</small></FactTile>
                </FancyBox>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className='mb-4'>
          <Col className='col-12 col-md-4'>
            <p className='text-center'>Games</p>
            <BarChart data={gameData} color={['#a83430']} dataKey={['Played']}/>
          </Col>
          <Col className='col-12 col-md-4'>
            <p className='text-center'>Shots</p>
            <BarChart data={shotData} color={['#13a37c', '#8da212']} dataKey={['Goal', 'Miss']}/>
          </Col>
          <Col className='col-12 col-md-4'>
            <p className='text-center'>Accuracy</p>
            <LineChart data={accuracyData} color={'#1489ad'} dataKey={'Accuracy'}/>
          </Col>
        </Row>
        <Row>
          <Col className={cx(
            'col-10 offset-1',
            'col-sm-12 offset-sm-0',
            'col-md-5 col-lg-4 col-xl-3')}>
            <Row>
              <Col className='col-12 col-sm-6 col-md-12 mb-5'>
                <p>Area Accuracy</p>
                <GoalColorMap positions={positions} />
              </Col>
              <Col className='col-12 col-sm-6 col-md-12 mb-5'>
                <p>Shot Distribution</p>
                <GoalMap positions={positions} />
              </Col>
            </Row>
          </Col>
          <Col className='col-12 col-md-7 col-lg-8 col-xl-9'>
            {graphInfo.map(({ caption, source, color }) => (
              <Row key={source}>
                <Col className='col-12 d-flex justify-content-between'>
                  <p>{ caption }</p>
                  <p>{ list && list.length > 0 ? 'Average: ' + average[source] : 'No data'}</p>
                </Col>
                <Col className='col-12'>
                  <LineChart
                    data={this.getGraphData(caption, source)}
                    color={color}
                    dataKey={caption}
                  />
                </Col>
              </Row>
            ))}
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
)(Statistics);
