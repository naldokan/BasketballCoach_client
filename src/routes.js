import React from 'react';
import { Router, Route, Redirect } from 'react-router-dom';

import App from './App';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';


const view = mode => () => <Home view={mode} />

const redirect = () => <Redirect to='login' />

export default ({ history }) => (
  <Router history={history}>
    <App>
      <Route path='/dashboard' render={view('dashboard')} />
      <Route path='/game' exact render={view('game')} />
      <Route path='/game/progress' render={view('game/progress')} />
      <Route path='/game/summary' render={view('game/summary')} />
      <Route path='/game/detail' render={view('game/detail')} />
      <Route path='/statistics' render={view('statistics')} />
      <Route path='/history' render={view('history')} />
      <Route path='/leaderboard' render={view('leaderboard')} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/' exact render={redirect} />
    </App>
  </Router>
)
