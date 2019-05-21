import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import { Row, Col, Form, FormGroup, Input, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons'

import './styles.scss';


class Login extends Component {
  constructor(props) {
    super(props)
    this.state = { errorText: null }

    this.email = this.password = ''
  }
  
  handleSignupClick = () => this.props.history.push('/register')

  handleSigninClick = () => {
    if (this.email.length === 0) {
      this.setState({ errorText: 'Email is empty' }, this.autoEraseError)
    } else if (this.password.length === 0) {
      this.setState({ errorText: 'Password is empty' }, this.autoEraseError)
    } else {
      this.props.history.push('/dashboard')
    }
  }

  autoEraseError = () => setTimeout(() => this.setState({ errorText: null }), 2000)

  handleEmailChange = e => {
    this.email = e.target.value
    e.which === 13 && this.handleSigninClick()
  }

  handlePasswordChange = e => {
    this.password = e.target.value
    e.which === 13 && this.handleSigninClick()
  }

  render() {
    return (
      <Row className='login-form'>
        <Col xs='8' sm='6' md='5' lg='4' xl='3'>
          <Form>
            <FontAwesomeIcon
              icon={faBasketballBall}
              size='10x'
              color='lightgray'
              className="mb-5"
            />
            <FormGroup>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                required
                onKeyUp={this.handleEmailChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                placeholder="Password"
                onKeyUp={this.handlePasswordChange}
                required
              />
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
            <p className='text-warning'>
              &nbsp;{ this.state.errorText }&nbsp;
            </p>
            <p className="text-alert text-white-50">
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
