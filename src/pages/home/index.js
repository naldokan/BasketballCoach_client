import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons'

import cx from 'classnames'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink
} from 'reactstrap';

import './styles.scss';

const navs = [{
    link: '/dashboard', label: 'Dashboard'
  }, {
    link: '/game', label: 'Game'
  }, {
    link: '/statistics', label: 'Statistics'
  }, {
    link: '/history', label: 'History'
  }, {
    link: '/leaderboard', label: 'Leaderboard'
  }
]

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      navbarExpand: false
    }
  }

  handleToggleClick = () => this.setState({ navbarExpand: !this.state.navbarExpand})

  handleNavigatorClick = link => () => this.props.history.push(link)

  handleSignoutClick = () => this.props.history.push('/login')

  check = link => {

  }

  render() {

    // const child = this.props.view === 'dashboard' ? <Dashboard/>
    //   : this.props.view === 'game' ? <Game/>
    //   : this.props.view === 'game/progress' ? <GameProgress/>
    //   : this.props.view === 'game/summary' ? <GameSummary/>
    //   : this.props.view === 'game/Detail' ? <GameDetail/>
    //   : this.props.view === 'statistics' ? <Statistics/>
    //   : this.props.view === 'history' ? <History/>
    //   : <Leaderboard/> 

    return (
      <>
        <Navbar color="secondary" light expand="md" className="py-md-0">
          <NavbarBrand>
            <FontAwesomeIcon
              icon={faBasketballBall}
              size='1x'
              color='white'
            />
          </NavbarBrand>
          <NavbarToggler onClick={this.handleToggleClick} />
          <Collapse isOpen={this.state.navbarExpand} navbar>
            <Nav className="ml-auto nav-pills" navbar>
              {navs.map(({ link, label }) => (
                <NavLink
                  onClick={this.handleNavigatorClick(link)}
                  className={cx('py-md-3', 'px-3', 'px-md-4', 'text-white', link === '/' + this.props.view.split('/')[0] ? 'active' : undefined)} 
                >
                  {label}
                </NavLink>
              ))}
              <NavLink
                onClick={this.handleSignoutClick}
                className={cx('py-md-3', 'px-3', 'px-md-4', 'text-white')} 
              >
                Sign out
              </NavLink>
            </Nav>
          </Collapse>
        </Navbar>
        {/* {child} */}
      </>
    );
  }
}

export default compose(
  withRouter
)(Home);
