import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'

import Calendar from 'react-calendar'
import { Row, Col, Table } from 'reactstrap';

import { throwRequest } from 'redux/modules/api/actions'
import { Round } from 'utils'
import './styles.scss';


class History extends Component {

  constructor(props) {
    super(props)
    this.date = new Date()
    this.state = { }
  }

  componentDidMount() {
    this.requestHistory(new Date())
  }  

  requestHistory = date => this.props.throwRequest({
    url: '/history',
    params: {
      date: date.toJSON().slice(0, 10)
    },
    onSuccess: ({ history }) => this.setState({ history })
  })

  onDateChange = this.requestHistory

  render() {
    const { history } = this.state
    const historyExist = history && history.length

    return (
      <>
        <Row className='history-pane'>
          <Col className='col-12 col-xl-3 mb-5'>
            <Calendar
              className='fancy-box'
              calendarType="US"
              onChange={this.requestHistory}
              value={this.date}
            />
          </Col>
          <Col className='col-12 col-xl-9'>
            { !historyExist ? <p className='watermark-text mt-5'>:) No Game</p> : (
              <Table striped borderless>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mode</th>
                    <th>Tries</th>
                    <th>Score</th>
                    <th>Accuracy %</th>
                    <th>Release Angle</th>
                    <th>Release Time</th>
                    <th>Elbow Angle</th>
                    <th>Leg Angle</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((value, key) => (
                    <tr key={key}>
                      <td>{ key + 1 }</td>
                      <td>{ value.mode === 'FREE_THROW' ? 'Free Throw' : 'Drills' }</td>
                      <td>{ value['try_count'] }</td>
                      <td>{ value['score'] }</td>
                      <td>{ value['try_count'] ? Round(value['score'] * 100 / value['try_count']) : '-' }</td>
                      <td>{ Round(value['release_angle']) }</td>
                      <td>{ Round(value['release_time']) }</td>
                      <td>{ Round(value['elbow_angle']) }</td>
                      <td>{ Round(value['leg_angle']) }</td>
                      <td>{ value['created_at'].substring(11) }</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </>
    );
  }
}

const actions = {
  throwRequest
}

export default compose(
  connect(undefined, actions),
  withRouter
)(History);
