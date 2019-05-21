import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect';

import { Row, Col, Form, FormGroup, Input, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons'

import Loader from 'components/loader'
import { loadingSelector } from 'redux/modules/api/selectors'
import { register } from 'redux/modules/auth/actions'



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
      this.showErrorText('Email is empty')
    } else if (this.name.length === 0) {
      this.showErrorText('Name is empty')
    } else if (this.password.length === 0) {
      this.showErrorText('Password is empty')
    } else if (this.password.length < 8) {
      this.showErrorText('Password should be more than 8 letters')
    } else if (this.password !== this.passwordConfirm) {
      this.showErrorText('Password doesn\'t match')
    } else {
      this.props.register({
        name: this.name,
        email: this.email,
        password: this.password,
        onSuccess: (data, status) => this.props.history.push('/dashboard'),
        onFailed: (data, status) => this.showErrorText(
          (data.errors && data.errors.email && data.errors.email) || 'Unknown error'
        )
      })
    }
  }

  showErrorText = errorText => this.setState({ errorText }, this.autoEraseError)

  autoEraseError = () => setTimeout(() => this.setState({ errorText: null }), 3000)

  handleGobackClick = () => this.props.history.push('/login')

  render() {
    return (
      <Row className='register-form'>
        <Loader
          loading={this.props.loading}
          bottom
        />
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

const selector = createStructuredSelector({
  loading: loadingSelector
});

const actions = {
  register
}

export default compose(
  connect(selector, actions),
  withRouter
)(Register);
