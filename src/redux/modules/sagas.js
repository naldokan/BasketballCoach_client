import { all, call } from 'redux-saga/effects';
import { sagas as auth } from './auth';
import { sagas as api } from './api';
import { sagas as game } from './game';


export default function* rootSaga() {
  yield all([
    call(auth),
    call(api),
    call(game)
  ])
}
