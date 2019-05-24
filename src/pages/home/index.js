import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Redirect } from 'react-router-dom';
import cx from 'classnames'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink
} from 'reactstrap';

import Dashboard from 'pages/dashboard';
import Game from 'pages/game/mode';
import GameProgress from 'pages/game/progress';
import Statistics from 'pages/statistics';
import Leaderboard from 'pages/leaderboard';
import History from 'pages/history';

import Loader from 'components/loader'
import { loadingSelector } from 'redux/modules/api/selectors'
import { tokenSelector } from 'redux/modules/auth/selectors'
import { signout } from 'redux/modules/auth/actions'
import './styles.scss';


const navs = [
  { link: '/dashboard', label: 'Dashboard' },
  { link: '/game', label: 'Game' },
  { link: '/statistics', label: 'Statistics' },
  { link: '/history', label: 'History' },
  { link: '/leaderboard', label: 'Leaderboard' },
]

const verticalCenterViews = ['game']

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      navbarExpand: false
    }
  }

  handleToggleClick = () => this.setState({ navbarExpand: !this.state.navbarExpand})

  handleNavigatorClick = link => () => this.props.history.push(link)

  handleSignoutClick = () => this.props.signout({
    onSuccess: () => this.props.history.push('/login'),
  })

  render() {

    const child = this.props.view === 'dashboard' ? <Dashboard/>
      : this.props.view === 'game' ? <Game/>
      : this.props.view === 'game/progress' ? <GameProgress/>
      : this.props.view === 'statistics' ? <Statistics/>
      : this.props.view === 'history' ? <History/>
      : <Leaderboard/>
    const verticalCenterView = verticalCenterViews.includes(this.props.view)
    
    if (!this.props.token) {
      return <Redirect to='/login' />
    }

    return (
      <div className="home-container">
        <Loader loading={this.props.loading} />
        <Navbar color="white" light expand="md" className="py-md-0">
          <NavbarBrand>
          </NavbarBrand>
          <NavbarToggler className='navbar-toggler' onClick={this.handleToggleClick} />
          <Collapse isOpen={this.state.navbarExpand} navbar>
            <Nav className="ml-auto nav-pills" navbar>
              {navs.map(({ link, label }) => (
                <NavLink
                  key={link}
                  onClick={this.handleNavigatorClick(link)}
                  className={cx('py-md-3', 'px-3', 'px-md-4',
                    link === '/' + this.props.view.split('/')[0] ? 'active' : undefined)} 
                >
                  {label}
                </NavLink>
              ))}
              <NavLink
                onClick={this.handleSignoutClick}
                className={cx('py-md-3', 'px-3', 'px-md-4')} 
              >
                Sign out
              </NavLink>
            </Nav>
          </Collapse>
        </Navbar>
        <div className={ cx('home-body', { 'home-body-vertical-middle': verticalCenterView }) }>
          {child}
        </div>
      </div>
    );
  }
}

const selectors = createStructuredSelector({
  loading: loadingSelector,
  token: tokenSelector
});

const actions = {
  signout
}

export default compose(
  connect(selectors, actions),
  withRouter
)(Home);
