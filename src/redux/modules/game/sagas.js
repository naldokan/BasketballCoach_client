import { take, call } from 'redux-saga/effects'
import * as websocket from './websocket'
import { types } from './actions'


const quitGame = function* (action, channel) {
  channel.close()
}

export default function* rootSaga() {
  const connect = yield take(types.CONNECT_SOCKET)

  const {
    waitForFreeGame,
    updateLastShot,
    updateTime,
    finishGame,
    socketError
  } = connect.payload

  const socket = yield call(websocket.connect)
  const channel = yield call(websocket.createChannel, socket)

  yield takeLatest(types.START_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.PAUSE_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.RESUME_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.STOP_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.FINISH_GAME, websocket.sendMessage, socket)
  yield takeLatest(types.QUIT_GAME, quitGame, channel)
  
  while (true) {
    try {
      const { type, payload } = yield take(channel)

      switch (type) {
        case types.WAIT_FOR_FREE_GAME:
          waitForFreeGame()
          break;

        case types.UPDATE_LAST_SHOT:
          updateLastShot(payload)
          break;

        case types.UPDATE_TIME:
          updateTime(payload)
          break;

        case types.FINISH_GAME:
          finishGame()
          break;

        case types.SOCKET_ERROR:
        default:
          socketError(payload)
          channel.close()
      }
    } catch(err) {
      channel.close()
    }
  }
}
