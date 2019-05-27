import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'

import { Row, Col, Button } from 'reactstrap';
import cx from 'classnames'
import fp from 'lodash/fp'

import { LineChart, GoalColorMap } from 'components/chart';

import { throwRequest } from 'redux/modules/api/actions'
import { Round } from 'utils'

import './styles.scss';


const recentGames = [
  { text: 'Recent 10 games', value: 10},
  { text: 'Recent 20 games', value: 20},
  { text: 'Recent 50 games', value: 50},
  { text: 'Recent 100 games', value: 100},
  { text: 'All', value: 0}
]

const recentDays = [
  { text: 'Today', value: 1},
  { text: 'Recent 7 days', value: 7},
  { text: 'Recent 30 days', value: 30},
  { text: 'Recent 6 months', value: 182},
  { text: 'Recent year', value: 365}
]

const graphInfo = [
  { caption: 'Release Angle', source: 'release_angle' },
  { caption: 'Release Time', source: 'release_time' },
  { caption: 'Elbow Angle', source: 'elbow_angle' },
  { caption: 'Leg Angle', source: 'leg_angle' }
]

const recentMode = { DAYS: 'days', TRIES: 'tries'}

class Statistics extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: recentMode.DAYS,
      period: 7
    }
  }

  componentDidMount() {
    this.requestStatistics()
  }

  requestStatistics = () => this.props.throwRequest({
    url: '/statistics',
    params: {
      mode: this.state.mode,
      period: this.state.period
    },
    onSuccess: ({ history, positions }) => this.setState({ history, positions })
  })

  getGraphData = (caption, source) => {
    const { history } = this.state
    return history && history.map(value => ({
      name: value['created_at'], [caption]: value[source]
    }))
  }

  handleRecentGames = value => () =>
    this.setState({ mode: recentMode.TRIES, period: value }, this.requestStatistics )

  handleRecentDays = value => () =>
    this.setState({ mode: 'days', period: value }, this.requestStatistics )

  render() {
    const { history, positions } = this.state

    return (
      <Row className='statistics-page'>
        <Col className={cx(
          'col-md-12',
          'col-lg-6 offset-lg-3',
          'col-xl-8 offset-xl-2')}>
          <Row className='mb-5'>
            <Col className={cx(
              'offset-xl-4 col-xl-4',
              'offset-lg-2 col-lg-8',
              'offset-sm-3 col-sm-6',
              'order-md-2'
            )}>
              <GoalColorMap positions={positions}/>
            </Col>
          </Row>
          <Row className='mb-5'>
            <Col className={cx(
              'statistics-filter',
              'col-md-4 offset-md-2',
              'col-lg-3 offset-lg-0',
              'col-xl-2')
            }>
              {recentGames.map(({ value, text }, key) => (
                <Row key={key} className='my-2 my-lg-4'>
                  <Col>
                    <Button
                      className='btn-block'
                      onClick={this.handleRecentGames(value)}
                      color={
                        this.state.mode === recentMode.TRIES &&
                        value === this.state.period ? 'success' : 'primary'
                      }
                    >
                      {text}
                    </Button>
                  </Col>
                </Row>
              ))}
            </Col>
            <Col className={cx(
              'statistics-filter',
              'col-md-4',
              'col-lg-3 offset-lg-0',
              'col-xl-2')
            }>
              {recentDays.map(({ value, text }, key) => (
                <Row key={key} className='my-2 my-lg-4'>
                  <Col>
                    <Button
                      className='btn-block'
                      onClick={this.handleRecentDays(value)}
                      color={
                        this.state.mode === recentMode.DAYS &&
                        value === this.state.period ? 'success' : 'primary'
                      }
                    >
                      {text}
                    </Button>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
          {graphInfo.map(({ caption, source }) => (
            <Row key={source}>
              <Col className='col-12 d-flex justify-content-between'>
                <p>{ caption }</p>
                <p>{ history && history.length > 0 && Round(fp.meanBy(source)(history))}</p>
              </Col>
              <Col className='col-12'>
                <LineChart data={this.getGraphData(caption, source)} dataKey={caption}/>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
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
