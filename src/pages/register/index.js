import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import { Row, Col, Form, FormGroup, Input, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons'


class Register extends Component {
  constructor(props) {
    super(props)
    this.state = { errorText: null }

    this.email = this.password = this.passwordConfirm = this.name = ''
  }

  handleNameChange = e => {
    this.name = e.target.value
    e.which === 13 && this.handleRegisterClick()
  }

  handleEmailChange = e => {
    this.email = e.target.value
    e.which === 13 && this.handleRegisterClick()
  }

  handlePasswordChange = e => {
    this.password = e.target.value
    e.which === 13 && this.handleRegisterClick()
  }

  handlePasswordConfirmChange = e => {
    this.passwordConfirm = e.target.value
    e.which === 13 && this.handleRegisterClick()
  }

  handleRegisterClick = () => {
    if (this.email.length === 0) {
      this.setState({ errorText: 'Email is empty' }, this.autoEraseError)
    } else if (this.name.length === 0) {
      this.setState({ errorText: 'Name is empty' }, this.autoEraseError)
    } else if (this.password.length === 0) {
      this.setState({ errorText: 'Password is empty' }, this.autoEraseError)
    } else if (this.password !== this.passwordConfirm) {
      this.setState({ errorText: 'Password doesn\'t match' }, this.autoEraseError)
    } else {
      this.props.history.push('/dashboard')
    }
  }

  autoEraseError = () => setTimeout(() => this.setState({ errorText: null }), 2000)

  handleGobackClick = () => this.props.history.push('/login')

  render() {
    return (
      <Row className='register-form'>
        <Col xs='8' sm='6' md='5' lg='4' xl='3'>
          <Form>
            <FontAwesomeIcon
              icon={faBasketballBall}
              size='10x'
              color='lightgray'
              className="mb-3"
            />
            <h4 className="text-white-50 mb-3">Register your account</h4>
            <FormGroup>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                onKeyUp={this.handleEmailChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                name="name"
                placeholder="Your name"
                onKeyUp={this.handleNameChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                placeholder="Password"
                onKeyUp={this.handlePasswordChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                placeholder="Confirm password"
                onKeyUp={this.handlePasswordConfirmChange}
              />
            </FormGroup>
            <FormGroup>
              <Button
                color="primary"
                type="button"
                onClick={this.handleRegisterClick}
              >
                Sign up
              </Button>
            </FormGroup>
            <p className='text-warning'>
              &nbsp;{ this.state.errorText }&nbsp;
            </p>
            <a
              onClick={this.handleGobackClick}
              className="text-info"
              style={{cursor: 'pointer'}}
            >
              <nobr>Cancel and go back</nobr>
            </a>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default compose(
  withRouter
)(Register);
