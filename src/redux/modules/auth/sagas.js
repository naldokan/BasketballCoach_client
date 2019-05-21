import { takeLatest, put, call } from 'redux-saga/effects'
import '../api/sagas'
import * as actions from './actions'
import { throwRequest } from '../api/actions'

const tryAuth = function* ({ payload }) {
  const { email, password, onSuccess, onFailed } = payload

  yield put(throwRequest({
    method: 'post',
    url: '/login',
    params: { email, password },
    onSuccess: function* (data, status) {
      yield put(actions.setAuth(data.token))
      yield call(onSuccess, data, status)
    },
    onFailed: function* (data, status) {
      yield call(onFailed, data, status)
    }
  }))
}

const register = function* ({ payload }) {
  const { name, email, password, onSuccess, onFailed } = payload

  yield put(throwRequest({
    method: 'post',
    url: '/register',
    params: { name, email, password },
    onSuccess: function* (data, status) {
      yield put(actions.setAuth(data.token))
      yield call(onSuccess, data, status)
    },
    onFailed: function* (data, status) {
      yield call(onFailed, data, status)
    }
  }))
}

const signout = function* ({ payload }) {
  const { onSuccess } = payload

  yield put(throwRequest({
    method: 'post',
    url: '/logout',
    onSuccess: function* (data, status) {
      yield put(actions.setAuth(null))
      yield call(onSuccess, data, status)
    }
  }))
}

export default function* rootSaga() {
  yield takeLatest(actions.types.TRY_AUTH, tryAuth)
  yield takeLatest(actions.types.SIGN_OUT, signout)
  yield takeLatest(actions.types.REGISTER, register)
}
