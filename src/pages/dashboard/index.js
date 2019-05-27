import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux'

import { Row, Col } from 'reactstrap';
import cx from 'classnames';
import FancyBox from 'components/fancybox';
import FactTile from 'components/facttile';
import { LineChart, GoalMap } from 'components/chart';
import fp from 'lodash/fp';
import { throwRequest } from 'redux/modules/api/actions'
import { Round } from 'utils'
import playground from 'playground.png';
import './styles.scss';


const graphInfo = {
  left: [
    { caption: 'Release Angle', source: 'release_angle' },
    { caption: 'Release Time', source: 'release_time' }
  ],
  right: [
    { caption: 'Elbow Angle', source: 'elbow_angle' },
    { caption: 'Leg Angle', source: 'leg_angle' }
  ]
}


class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.state = { }
  }

  componentDidMount() {
    this.props.throwRequest({
      url: '/dashboard',
      onSuccess: data => this.setState({
        totalGamePlays: data.total_game_plays,
        overallAccuracy: Round(data.overall_accuracy * 100),
        recentAccuracy: Round(data.recent_accuracy * 100),
        history: data.history,
        positions: data.positions
      })
    })
  }

  getGraphData = (caption, source) => {
    const { history } = this.state
    return history && history.map(value => ({
      name: value['created_at'], [caption]: value[source]
    }))
  }

  render() {
    const { totalGamePlays, overallAccuracy, recentAccuracy, history, positions } = this.state

    return (
      <>
        <Row className='dashboard-overall'>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2'>
            <FancyBox>
              <FactTile caption='Total game plays' size='1'>
                {totalGamePlays}
              </FactTile>
            </FancyBox>
          </Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2'>
            <FancyBox>
              <FactTile caption='Overall accuracy' size='1'>
                {overallAccuracy === undefined ? undefined : (
                  <>
                    {overallAccuracy}<small>%</small>
                  </>
                )}
              </FactTile>
            </FancyBox>
          </Col>
          <Col className='col-12 col-sm-3 col-lg-3 col-xl-2'>
            <FancyBox>
              <FactTile caption='Recent accuracy' size='1'>
                {recentAccuracy === undefined ? undefined : (
                  <>
                    {recentAccuracy}<small>%</small>
                  </>
                )}
              </FactTile>
            </FancyBox>
          </Col>
        </Row>
        <p className='headline'>Performance of recent 10 performances</p>
        <Row>
          <Col className='col-12 col-lg-4 px-5 order-2 order-lg-1'>
            { graphInfo.left.map(({ caption, source }, key) => (
              <Row key={key} className='mb-4'>
                <Col className='col-12 d-flex justify-content-between'>
                  <p>{ caption }</p>
                  <p>{ history && history.length > 0 && Round(fp.meanBy(source)(history))}</p>
                </Col>
                <Col className='col-12'>
                  <LineChart data={this.getGraphData(caption, source)} dataKey={caption} />
                </Col>
              </Row>
            ))}
          </Col>
          <Col className={cx(
            'col-12 px-5 order-1',
            'col-sm-8 offset-sm-2',
            'col-lg-4 offset-lg-0 order-lg-2'
          )}>
            <img className='w-100 img-thumbnail rounded mb-5' src={playground} />
            {/* <GoalMap
              success={this.state.positions &&
                this.state.positions.filter(goal => goal.success)
                  .map(({ x, y }) => ({x, y, z: 1}))}
              fail={this.state.positions &&
                this.state.positions.filter(goal => !goal.success)
                  .map(({ x, y }) => ({x, y, z: 1}))} 
            /> */}
          </Col>
          <Col className='col-12 col-lg-4 px-5 order-3 order-lg-3'>
            { graphInfo.right.map(({ caption, source }, key) => (
              <Row key={key} className='mb-4'>
                <Col className='col-12 d-flex justify-content-between'>
                  <p>{ caption }</p>
                  <p>{ history && history.length > 0 && Round(fp.meanBy(source)(history))}</p>
                </Col>
                <Col className='col-12'>
                  <LineChart data={this.getGraphData(caption, source)} dataKey={caption} />
                </Col>
              </Row>
              ))}
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
)(Dashboard);
