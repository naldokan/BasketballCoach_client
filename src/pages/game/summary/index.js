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

import './styles.scss';


class GameSummary extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <>
        Dashboard
      </>
    );
  }
}

export default compose(
  withRouter
)(GameSummary);
