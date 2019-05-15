import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import cx from 'classnames'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink
} from 'reactstrap';

import Dashboard from '../dashboard';
import Game from '../game';
import GameProgress from '../game/progress';
import GameSummary from '../game/summary';
import GameDetail from '../game/detail';
import Statistics from '../statistics';
import History from '../history';
import Leaderboard from '../leaderboard';

import './styles.scss';

const navs = [
  { link: '/leaderboard', label: 'Leaderboard' },
  { link: '/statistics', label: 'Statistics' },
  { link: '/dashboard', label: 'Dashboard' },
  { link: '/history', label: 'History' },
  { link: '/game', label: 'Game' },
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

    const child = this.props.view === 'dashboard' ? <Dashboard/>
      : this.props.view === 'game' ? <Game/>
      : this.props.view === 'game/progress' ? <GameProgress/>
      : this.props.view === 'game/summary' ? <GameSummary/>
      : this.props.view === 'game/detail' ? <GameDetail/>
      : this.props.view === 'statistics' ? <Statistics/>
      : this.props.view === 'history' ? <History/>
      : <Leaderboard/> 

    return (
      <div className="home-container">
        <Navbar color="secondary" light expand="md" className="py-md-0">
          <NavbarBrand>
          </NavbarBrand>
          <NavbarToggler onClick={this.handleToggleClick} />
          <Collapse isOpen={this.state.navbarExpand} navbar>
            <Nav className="ml-auto nav-pills" navbar>
              {navs.map(({ link, label }) => (
                <NavLink
                  key={link}
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
        {child}
      </div>
    );
  }
}

export default compose(
  withRouter
)(Home);
