import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect';

import { Row, Col, Form, FormGroup, Input, Button } from 'reactstrap'

import Loader from 'components/loader'
import { loadingSelector } from 'redux/modules/api/selectors'
import { register } from 'redux/modules/auth/actions'



class Register extends Component {
  constructor(props) {
    super(props)
    this.state = { errorText: null }
  }

  getEmailRef = ref => this.emailRef = ref

  getNameRef = ref => this.nameRef = ref

  getPasswordRef = ref => this.passwordRef = ref

  getPasswordConfirmRef = ref => this.passwordConfirmRef = ref

  handleInputKeyPress = ({ which }) => which === 13 && this.handleRegisterClick()

  handleRegisterClick = () => {
    const email = this.emailRef.value
    const name = this.nameRef.value
    const password = this.passwordRef.value
    const passwordConfirm = this.passwordConfirmRef.value

    clearTimeout(this.timer)

    if (email.length === 0) {
      this.emailRef.focus()
      this.showErrorText('Email is empty')
    } else if (name.length === 0) {
      this.nameRef.focus()
      this.showErrorText('Name is empty')
    } else if (password.length === 0) {
      this.passwordRef.focus()
      this.showErrorText('Password is empty')
    } else if (password.length < 8) {
      this.passwordRef.focus()
      this.showErrorText('Password should be more than 8 letters')
    } else if (password !== passwordConfirm) {
      this.passwordRef.focus()
      this.showErrorText('Password doesn\'t match')
    } else {
      this.props.register({
        name: this.name,
        email: this.email,
        password: this.password,
        onSuccess: () => this.props.history.push('/dashboard'),
        onFailed: data => {
          this.passwordRef.focus()
          this.showErrorText(
            (data.errors && data.errors.email && data.errors.email) || 'Unknown error'
          )
        }
      })
    }
  }

  showErrorText = errorText => this.setState({ errorText }, this.autoEraseError)

  autoEraseError = () => this.timer = setTimeout(() => this.setState({ errorText: null }), 3000)

  handleGobackClick = () => {
    clearTimeout(this.timer)
    this.props.history.push('/login')
  }

  render() {
    return (
      <Row className='register-form'>
        <Loader
          loading={this.props.loading}
          bottom
        />
        <div className='logo'/>
        <div className='copyright'>2019 © Fro.G</div>
        <Col className='col-10'>
          <Form>
            <h4 className="text-white-50 mb-4">Register your account</h4>
            <FormGroup>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                innerRef={this.getEmailRef}
                onKeyUp={this.handleInputKeyPress}
              />
            </FormGroup>
            <FormGroup>
              <Input
                name="name"
                placeholder="Your name"
                innerRef={this.getNameRef}
                onKeyUp={this.handleInputKeyPress}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                placeholder="Password"
                innerRef={this.getPasswordRef}
                onKeyUp={this.handleInputKeyPress}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                placeholder="Confirm password"
                innerRef={this.getPasswordConfirmRef}
                onKeyUp={this.handleInputKeyPress}
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
            <p className='text-warning semi-transparent-text'>
              &nbsp;{ this.state.errorText }&nbsp;
            </p>
            <a
              onClick={this.handleGobackClick}
              className="text-info"
              style={{cursor: 'pointer'}}
            >
              Cancel and go back
            </a>
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
  register
}

export default compose(
  connect(selectors, actions),
  withRouter
)(Register);
