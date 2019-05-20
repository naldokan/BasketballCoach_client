import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import { Row, Col, Button } from 'reactstrap';
import cx from 'classnames'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis
} from 'recharts';

import playground from 'playground.png';
import './styles.scss';


const recentTries = [
  { text: 'Recent 10 tries', value: 10},
  { text: 'Recent 20 tries', value: 20},
  { text: 'Recent 50 tries', value: 50},
  { text: 'Recent 100 tries', value: 100},
  { text: 'All', value: 10}
]

const recentDays = [
  { text: 'Today', value: 1},
  { text: 'Recent 7 days', value: 7},
  { text: 'Recent 30 days', value: 30},
  { text: 'Recent 6 months', value: 182},
  { text: 'Recent year', value: 365}
]

class Statistics extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleRecentTries = value => () => {}

  handleRecentDays = value => () => {}

  render() {
    const dummy = new Array(10).fill(0).map((val, key) => key)
    const data = [
      {uv: 400, pv: 2400, amt: 2400},
      {uv: 300, pv: 2100, amt: 2000},  
      {uv: 500, pv: 2100, amt: 2000}
    ]
    
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
              // 'offset-'
            )}>
              <img className='w-100' src={playground} />
            </Col>
          </Row>
          <Row className='mb-5'>
            <Col className={cx(
              'statistics-filter',
              'col-md-4 offset-md-2',
              'col-lg-3 offset-lg-0',
              'col-xl-2')
            }>
              {recentTries.map(({ value, text }, key) => (
                <Row key={key} className='my-2 my-lg-4'>
                  <Col>
                    <Button color="primary btn-block" onClick={this.handleRecentTries(value)}>{text}</Button>
                  </Col>
                </Row>
              ))}
            </Col>
            <Col className={cx(
              'statistics-filter',
              'col-md-4',
              'col-lg-3 offset-lg-0',
              'col-xl-2')
            }>              {recentDays.map(({ value, text }, key) => (
                <Row key={key} className='my-2 my-lg-4'>
                  <Col>
                    <Button color="primary btn-block" onClick={this.handleRecentDays(value)}>{text}</Button>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
          {dummy.map((val, key) => (
            <Row key={key}>
              <Col className='col-12'>
                <ResponsiveContainer height={100} width='100%'>
                  <LineChart
                    width={400}
                    height={150}
                    data={data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
                  </LineChart>
                </ResponsiveContainer>
              </Col>
              <Col className='col-12'>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    );
  }
}

export default compose(
  withRouter
)(Statistics);
