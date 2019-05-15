import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import { Row, Col, Form, FormGroup, Input, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons'

import './styles.scss';


class Login extends Component {

  handleSignupClick = () => this.props.history.push('/register')

  handleSigninClick = () => this.props.history.push('/dashboard')

  render() {
    return (
      <Row className='login'>
        <Col xs='8' sm='6' md='5' lg='4' xl='3'>
          <Form>
            <FontAwesomeIcon
              icon={faBasketballBall}
              size='10x'
              color='lightgray'
              className="mb-5"
            />
            <FormGroup>
              <Input type="email" name="email" placeholder="Email"/>
            </FormGroup>
            <FormGroup>
              <Input type="password" placeholder="Password"/>
            </FormGroup>
            <FormGroup>
              <Button
                color="primary"
                type="button"
                onClick={this.handleSigninClick}
              >
                Sign in
              </Button>
            </FormGroup>
            <p className="text-alert">
              <nobr>Haven't account?</nobr>
              &nbsp;
              <a 
                onClick={this.handleSignupClick}
                className="text-info"
                style={{cursor: 'pointer'}}
              >
                <nobr>Now sign up!</nobr>
              </a>
            </p>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default compose(
  withRouter
)(Login);
