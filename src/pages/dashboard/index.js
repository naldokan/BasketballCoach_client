import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, XAxis } from 'recharts';

import FancyBox from 'components/fancybox';
import FactTile from 'components/facttile';
import playground from 'playground.png';

import cx from 'classnames'
import {
  Row,
  Col,
} from 'reactstrap';

import './styles.scss';


class Dashboard extends Component {

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

    return (
      <>
        <Row className='justify-content-center'>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2'>
            <FancyBox>
              <FactTile score='100' caption='Total game plays' size='1'/>
            </FancyBox>
          </Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2'>
            <FancyBox>
              <FactTile score='60%' caption='Overall accuracy' size='1'/>
            </FancyBox>
          </Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2'>
            <FancyBox>
              <FactTile score='100' caption='Recent accuracy' size='1'/>
            </FancyBox>
          </Col>
        </Row>
        <p className='headline'>Performance of recent 10 performances</p>
        <Row>
          <Col className='col-12 col-lg-4 px-5 order-2 order-lg-1'>
            <Row>
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
            <Row>
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
            <Row>
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
          </Col>
          <Col className='col-12 col-lg-4 px-5 order-1 order-lg-2'>
            <img className='w-100 img-thumbnail rounded mb-5' src={playground} />
          </Col>
          <Col className='col-12 col-lg-4 px-5 order-3 order-lg-3'>
            <Row>
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
            <Row>
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
            <Row>
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
          </Col>
        </Row>
      </>
    );
  }
}

export default compose(
  withRouter
)(Dashboard);
