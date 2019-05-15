import React, { Component } from 'react';
import { withRouter } from "react-router";
import { compose } from 'redux'

import { Row, Col, Form, FormGroup, Input, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons'

import './styles.scss';


class Register extends Component {

  handleGobackClick = () => this.props.history.push('/login')

  render() {
    return (
      <Row className='register'>
        <Col xs='8' sm='6' md='5' lg='4'>
          <Form>
            <FontAwesomeIcon
              icon={faBasketballBall}
              size='10x'
              color='lightgray'
              className="mb-5"
            />
            <h4 className="text-secondary mb-5">Register your account</h4>
            <FormGroup>
              <Input type="email" name="email" placeholder="Email"/>
            </FormGroup>
            <FormGroup>
              <Input name="name" placeholder="Your name"/>
            </FormGroup>
            <FormGroup>
              <Input type="password" placeholder="Password"/>
            </FormGroup>
            <FormGroup>
              <Button color="primary" type="button">Sign up</Button>
            </FormGroup>
            <a
              onClick={this.handleGobackClick}
              class="text-info"
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

export default compose(
  withRouter
)(Register);
