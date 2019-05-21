import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import cx from 'classnames'
import { Row, Col, Button, Table } from 'reactstrap';

import './styles.scss';


class History extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <>
        <Row>
          <Col className='col-12 col-md-5 leaderboard-select'>
            <Row>
              <Col className='col-8 col-sm-6 col-md-8 col-xl-6'>
                <Button className='btn-block' color='primary'>Accuracy</Button>
              </Col>
            </Row>
            <Row>
              <Col className='col-8 col-sm-6 col-md-8 col-xl-6'>
                <Button className='btn-block' color='primary'>Release Time</Button>
              </Col>
            </Row>
            <Row>
              <Col className='col-8 col-sm-6 col-md-8 col-xl-6'>
                <Button className='btn-block' color='primary'>Speed</Button>
              </Col>
            </Row>
            <Row>
              <Col className='col-8 col-sm-6 col-md-8 col-xl-6'>
                <Button className='btn-block' color='primary'>Leg Angle</Button>
              </Col>
            </Row>
          </Col>
          <Col className='col-12 col-md-5 mt-5'>
            <Row className="mb-3 text-center">
              <Col>Your ranking is 7</Col>
            </Row>
            <Row>
              <Col>
                <Table striped borderless>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Figure</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Jack</td>
                      <td>90</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Jane</td>
                      <td>80</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>John</td>
                      <td>70</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Jim</td>
                      <td>60</td>
                    </tr>
                  </tbody>
                </Table>
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
)(History);
