import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import cx from 'classnames'
import {
  Row,
  Col,
  Button,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';
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


const PAGE_SIZE = 10
const PAGINATION_BAR_SIZE = 5


class GameDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0
    }
  }

  getGraphData = (caption, source) => {
    const { shots } = this.props
    return shots && shots.map(value => ({
      name: value['created_at'], [caption]: value[source]
    }))
  }

  handleTryClick = selected => () => this.setState({ selected })

  handlePageClick = page => () => {
    const { shots } = this.props
    this.setState({ page: page < 0 ? Math.ceil(shots.length / PAGE_SIZE) - 1 : page })
  }

  render() {
    const { shots } = this.props
    const { page } = this.state

    const start = PAGE_SIZE * page
    const end = Math.min(start + PAGE_SIZE, shots.length)
    const pageCount = Math.ceil(shots.length / PAGE_SIZE)
    const paginationBarSize = Math.min(PAGINATION_BAR_SIZE, pageCount)
    const half = Math.ceil(paginationBarSize / 2)
    const pageBarStart =
      paginationBarSize === PAGINATION_BAR_SIZE ?
      page < half ? 0
      : page >= pageCount - half ? pageCount - paginationBarSize
      : page + 1 - half
      : 0

    return (
      <div className='flex-column d-flex review-detail'>
        <Row className='game-detail order-2 order-xl-1'>
          <Col className={cx(
            'col-12 my-4',
            'col-sm-8 offset-sm-2',
            'col-md-6 offset-md-3',
            'col-xl-3 offset-xl-1',
            'd-flex')}>
            <Row>
              <Col>
                <GoalMap positions={shots} active={this.state.selected} />
              </Col>
            </Row>
          </Col>
          <Col className={cx(
            'd-xl-none my-3',
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
            'd-xl-none my-3',
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
          <Col className='col-12 col-xl-7 offset-xl-1 mt-4 mt-xl-0'>
            <Row>
              <Col>
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
                  {this.props.shots.slice(start, end).map((val, key) => (
                    <tr
                      key={ key }
                      className={cx({
                        'text-danger' : !val.success,
                        'selected' : key === this.state.selected
                      })}
                      onClick={ this.handleTryClick(key) }
                    >
                      <td>{ start + key + 1 }</td>
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
            {paginationBarSize > 1 && (
              <Row className='my-3'>
                <Col>
                  <Pagination>
                    <PaginationItem>
                      <PaginationLink
                        first
                        disabled={page === 0}
                        onClick={this.handlePageClick(0)}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        previous  
                        disabled={page === 0}
                        onClick={this.handlePageClick(page - 1)}
                      />
                    </PaginationItem>
                    {Array(paginationBarSize).fill(0).map((val, key) => (
                      <PaginationItem
                        key={key}
                        active={key + pageBarStart === page}
                      >
                        <PaginationLink
                          onClick={this.handlePageClick(key + pageBarStart)}
                        >
                          { key + pageBarStart + 1}
                        </PaginationLink>
                    </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationLink
                        next
                        disabled={page >= pageCount - 1}
                        onClick={this.handlePageClick(page + 1)}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        last
                        disabled={page >= pageCount - 1}
                        onClick={this.handlePageClick(-1)}
                      />
                    </PaginationItem>
                  </Pagination>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <Row className={cx(
          'd-none d-xl-flex my-5',
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
