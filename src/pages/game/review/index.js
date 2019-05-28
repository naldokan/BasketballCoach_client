import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import cx from 'classnames'
import { Row, Col, Button, Table } from 'reactstrap';
import { LineChart } from 'components/chart';
import fp from 'lodash/fp';

import { GoalMap } from 'components/chart'
import { Round } from 'utils';
import './styles.scss';


const graphInfo = [
  { caption: 'Release Angle', source: 'releaseAngle', color: '#ff7300' },
  { caption: 'Release Time', source: 'releaseTime', color: '#00e1ff' },
  { caption: 'Elbow Angle', source: 'elbowAngle', color: '#d400ff' },
  { caption: 'Leg Angle', source: 'legAngle', color: '#ff3200' }
]

class GameDetail extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  getGraphData = (caption, source) => {
    const { shots } = this.props
    return shots && shots.map(value => ({
      name: value['created_at'], [caption]: value[source]
    }))
  }

  handleTryClick = selected => () => this.setState({ selected })

  render() {
    const { shots } = this.props
    return (
      <div className='flex-column d-flex review-detail'>
        <Row className='game-detail order-2 order-xl-1'>
          <Col className={cx(
            'col-12 mb-4',
            'col-sm-8 offset-sm-2',
            'col-md-6 offset-md-3',
            'col-xl-3 offset-xl-1',
            'd-flex align-items-center')}>
            <GoalMap positions={shots} active={this.state.selected} />
          </Col>
          <Col className={cx(
            'd-xl-none',
            'col-sm-4 offset-sm-2',
            'col-md-3 offset-md-3'
          )}>
            <Button
              className="btn-block"
              color='primary'
              onClick={this.props.summaryClick}
            >
              Summary View
            </Button>
          </Col>
          <Col className={cx(
            'd-xl-none',
            'col-sm-4',
            'col-md-3'
          )}>
            <Button
              className="btn-block"
              color='primary'
              onClick={this.props.replayClick}
            >
              Play again
            </Button>
          </Col>
          <Col className='col-12 col-xl-7 offset-xl-1 mb-5 mt-4 mt-xl-0'>
            <Table hover striped borderless>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Release Angle</th>
                  <th>Release Time</th>
                  <th>Elbow Angle</th>
                  <th>Leg Angle</th>
                </tr>
              </thead>
              <tbody>
              {this.props.shots.map((val, key) => (
                <tr
                  key={ key }
                  className={cx({
                    'text-danger' : !val.success,
                    'selected' : key === this.state.selected
                  })}
                  onClick={ this.handleTryClick(key) }
                >
                  <td>{ key + 1 }</td>
                  <td>{ val.releaseAngle }</td>
                  <td>{ val.releaseTime }</td>
                  <td>{ val.elbowAngle }</td>
                  <td>{ val.legAngle}</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className={cx(
          'd-none d-xl-flex mb-4',
          'order-1 order-xl-2'
        )}>
          <Col className={cx('col-xl-2 offset-xl-4')}>
            <Button
              className="btn-block"
              color='primary'
              onClick={this.props.summaryClick}
            >
              Summary View
            </Button>
          </Col>
          <Col className={cx('col-xl-2')}>
            <Button
              className="btn-block"
              color='primary'
              onClick={this.props.replayClick}
            >
              Play again
            </Button>
          </Col>
        </Row>
        <Row className='order-3'>
          <Col className='col-12'>
          {graphInfo.map(({ caption, source, color }) => (
            <Row key={source}>
              <Col className='col-12 d-flex justify-content-between'>
                <p>{ caption }</p>
                <p>{ shots && shots.length > 0 && Round(fp.meanBy(source)(shots))}</p>
              </Col>
              <Col className='col-12'>
                <LineChart
                  data={this.getGraphData(caption, source)}
                  dataKey={caption}
                  color={color}
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

export default compose(
  withRouter
)(GameDetail);
