import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect';

import { Row, Col, Form, FormGroup, Input, Button } from 'reactstrap'

import Loader from 'components/loader'
import { loadingSelector } from 'redux/modules/api/selectors'
import { tryAuth } from 'redux/modules/auth/actions'

import './styles.scss';


class Login extends Component {
  constructor(props) {
    super(props)
    this.state = { errorText: null }
  }
  
  getEmailRef = ref => this.emailRef = ref
  
  getPasswordRef = ref => this.passwordRef = ref

  handleSignupClick = () => {
    clearTimeout(this.timer)
    this.props.history.push('/register')
  }

  handleSigninClick = () => {
    const email = this.emailRef.value
    const password = this.passwordRef.value
    
    clearTimeout(this.timer)
    
    if (email.length === 0) {
      this.emailRef.focus()
      this.showErrorText('Email is empty')
    } else if (password.length === 0) {
      this.passwordRef.focus()
      this.showErrorText('Password is empty')
    } else {
      this.props.tryAuth({
        email,
        password,
        onSuccess: () => this.props.history.push('/dashboard'),
        onFailed: (data, status) => {
          this.passwordRef.focus()
          this.showErrorText(
          status === 422 ? 'Invalid credential'
            : (data.errors && data.errors.email && data.errors.email) || 'Unknown error'
          )
        }
      })
    }
  }

  showErrorText = errorText => this.setState({ errorText }, this.autoEraseError)

  autoEraseError = () => this.timer = setTimeout(() => this.setState({ errorText: null }), 3000)

  handleInputKeyPress = ({ which }) => which === 13 && this.handleSigninClick()

  render() {
    return (
      <Row className='login-form'>
        <Loader
          loading={this.props.loading}
          bottom
        />
        <Col className='col-6 pr-5'>
          <Form>
            <h4 className="text-white-50 mb-5">Login</h4>
            <FormGroup>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                required
                onKeyUp={this.handleInputKeyPress}
                innerRef={this.getEmailRef}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                placeholder="Password"
                onKeyUp={this.handleInputKeyPress}
                innerRef={this.getPasswordRef}
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
            <p className='text-white'>
              &nbsp;{ this.state.errorText }&nbsp;
            </p>
            <p className="text-alert text-white">
              <nobr className='mr-3'>Haven't account?</nobr>
              &nbsp;
              <a 
                onClick={this.handleSignupClick}
                className="text-white-50 link"
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

const selectors = createStructuredSelector({
  loading: loadingSelector
});

const actions = {
  tryAuth
}

export default compose(
  connect(selectors, actions),
  withRouter
)(Login);
