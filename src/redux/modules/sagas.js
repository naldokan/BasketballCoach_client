import { all, call } from 'redux-saga/effects';
import { sagas as auth } from './auth';
import { sagas as api } from './api';


export default function* rootSaga() {
  yield all([
    call(auth),
    call(api)
  ])
}
