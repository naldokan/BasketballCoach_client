import { takeLatest, put, call, select } from 'redux-saga/effects'
import axios from 'axios'
import * as actions from './actions'
import { tokenSelector } from '../auth/selectors'

const headers = {
  'X-Requested-With': 'XMLHttpRequest'
}

const request = (method, url, params, token) => {
  return axios.request({
    'method': method || 'get',
    headers,
    url: process.env.REACT_APP_SERVER + url,
    params: token ? { ...params, 'api_token': token } : params
  })
}

const throwRequest = function* ({ payload }) {
  const { method, url, params, onSuccess, onFailed } = payload
  const token = yield select(tokenSelector)

  try {
    const response = yield call(request, method, url, params, token)
    const { status, data } = response
    if (onSuccess) {
      yield call(onSuccess, data, status)
    }
  } catch (error) {
    const { status, data } = error.response
    if (onFailed) {
      yield call(onFailed, data, status)
    }
  }

  yield put(actions.finishRequest())
}

export default function* rootSaga() {
  yield takeLatest(actions.types.THROW_REQUEST, throwRequest)
}
