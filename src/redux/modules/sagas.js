import { all, call } from 'redux-saga/effects';
import { sagas as auth } from './auth';


export default function* rootSaga() {
  yield all([
    call(auth),
  ])
}
