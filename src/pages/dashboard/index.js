import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

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
    return (
      <>
        <Row className='dashboard-overall'>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2 fancy-box'>sd</Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2 fancy-box'>sd</Col>
          {/* <Col className='col-12 col-sm-3 col-lg-3 col-xl-2 fancy-box'>sd</Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2 fancy-box'>sd</Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2 fancy-box'>sd</Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2 fancy-box'>sd</Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2 fancy-box'>sd</Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2 fancy-box'>sd</Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2 fancy-box'>sd</Col> */}
        </Row>
      </>
    );
  }
}

export default compose(
  withRouter
)(Dashboard);
