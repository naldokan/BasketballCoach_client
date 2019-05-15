import React from 'react';

import { Container } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';


export default ({ children }) => <Container fluid className='p-0'>{ children }</Container>
