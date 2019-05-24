import { take, call, takeLatest } from 'redux-saga/effects'
import * as websocket from './websocket'
import { types } from './actions'


const disconnectGame = function* (action, channel) {
  channel.close()
}

const connect = function* ({ payload }) {
  const {
    showGameStatus,
    updateLastShot,
    updateTime,
    controlSuccess,
    finishGame,
    socketError
  } = payload

  const socket = yield call(websocket.connect)
  
  const channel = yield call(websocket.createChannel, socket)

  yield takeLatest(types.START_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.PAUSE_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.RESUME_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.STOP_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.FINISH_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.DISCONNECT_GAME, disconnectGame, channel)
  
  while (true) {
    try {
      const { type, payload } = yield take(channel)

      switch (type) {
        case types.SHOW_GAME_STATUS:
          yield call(showGameStatus)
          break

        case types.CONTROL_SUCCESS:
          yield call(controlSuccess)
          break

        case types.UPDATE_LAST_SHOT:
          yield call(updateLastShot, payload)
          break

        case types.UPDATE_TIME:
          yield call(updateTime, payload)
          break

        case types.FINISH_GAME:
          yield call(finishGame)
          break

        case types.SOCKET_ERROR:
        default:
          yield call(socketError, payload)
          channel.close()
          return
      }
    } catch(err) {
      channel.close()
      return
    }
  }
}

export default function* rootSaga() {
  yield takeLatest(types.CONNECT_GAME, connect)
}
