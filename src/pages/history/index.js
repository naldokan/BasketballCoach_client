import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import cx from 'classnames'
import Calendar from 'react-calendar'
import { Row, Col, Table } from 'reactstrap';

import './styles.scss';


class History extends Component {

  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }

  onDateChange = () => {}

  render() {
    return (
      <>
        <Row className='history-pane'>
          <Col className='col-12 col-md-6 mb-5'>
            <Calendar
              className='fancy-box'
              calendarType="US"
              onChange={this.onDateChange}
              value={this.state.date}
            />
          </Col>
          <Col className='col-12 col-md-6'>
            <Table striped borderless>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Release Angle</th>
                  <th>Release Time</th>
                  <th>Leg Angle</th>
                  <th>Vertical</th>
                  <th>Speed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>34</td>
                  <td>26</td>
                  <td>90</td>
                  <td>10</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>34</td>
                  <td>26</td>
                  <td>90</td>
                  <td>10</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>34</td>
                  <td>26</td>
                  <td>90</td>
                  <td>10</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>34</td>
                  <td>26</td>
                  <td>90</td>
                  <td>10</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>34</td>
                  <td>26</td>
                  <td>90</td>
                  <td>10</td>
                  <td>6</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </>
    );
  }
}

export default compose(
  withRouter
)(History);
