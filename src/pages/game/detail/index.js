import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import cx from 'classnames'
import { Row, Col, Table, Button } from 'reactstrap';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis
} from 'recharts';

import FancyBox from 'components/fancybox'
import playground from 'playground.png';
import './styles.scss';


class GameDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const data = [
      {uv: 400, pv: 2400, amt: 2400},
      {uv: 300, pv: 2100, amt: 2000},
      {uv: 500, pv: 2100, amt: 2000}
    ]
    const dummy = new Array(10).fill(0).map((val, key) => key)

    return (
      <>
        <Row className='game-detail'>
          <Col className={cx(
            'col-12 mb-5',
            'col-sm-8 offset-sm-2',
            'col-md-6 offset-md-3',
            'col-xl-3 offset-xl-1',
            'd-flex align-items-center')}>
            <div>
              <img className='w-100' src={playground} />
            </div>
          </Col>
          <Col className='col-12 col-xl-7 offset-xl-1 mb-5'>
            <Table hover striped borderless>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Release Angle</th>
                  <th>Release Time</th>
                  <th>Speed</th>
                  <th>Leg Angle</th>
                  <th>Vertical</th>
                </tr>
              </thead>
              <tbody>
              {dummy.map((val, key) => (
                <tr key={key}>
                  <td>{ key + 1 }</td>
                  <td>44</td>
                  <td>356</td>
                  <td>21</td>
                  <td>14</td>
                  <td>64</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col className='col-12'>
            { dummy.map((val, key) => (
            <Row key={key}>
              <Col className='col-12 d-flex justify-content-between'>
                <p>Release time</p>
                <p>123</p>
              </Col>
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
            </Row>
          ))}
          </Col>
        </Row>
      </>
    );
  }
}

export default compose(
  withRouter
)(GameDetail);
