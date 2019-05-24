import { eventChannel, END } from 'redux-saga'
import { select, call } from 'redux-saga/effects'
import { tokenSelector } from '../auth/selectors'
import * as actions from './actions'


const gameAvailability = {
  FREE: 1,
  OCCUPIED: 0
}

const gameMode = {
  FREE_THROW: 0,
  DRILLS: 1
}

export const connect = function () {
  return new WebSocket(process.env.REACT_APP_SOCKET_URL)
}

export const createChannel = function (socket) {
  return eventChannel(emit => {
    socket.onopen = e => {
    }

    socket.onclose = e => {
    }

    socket.onerror = e => {
      emit(actions.socketError(e))
    }

    socket.onmessage = e => {
      const msg = JSON.parse(e.data)
      switch (msg['type']) {
        case 'GAME_AVAILABILITY':
          if (msg['value'] === gameAvailability.OCCUPIED) {
            emit(actions.showGameStatus({ status: false, user: 'Another user' /* msg['user' ] */ }))
          } else {
            emit(actions.showGameStatus({ status: true }))
          }
          break;
        
        case 'START_GAME_RESULT':
          if (msg['value'] === gameAvailability.OCCUPIED) {
            emit(actions.showGameStatus({ status: false, user: 'Another user' }))
          } else {
            emit(actions.controlSuccess())
          }

        case 'LAST_SHOT':
          emit(actions.updateLastShot(msg['data']))
          break;

        case 'ELAPSED_TIME':
          emit(actions.updateTime(msg['time']))
          break;

        case 'START_GAME_RESULT':
        case 'PAUSE_GAME_RESULT':
        case 'RESUME_GAME_RESULT':
          emit(actions.controlSuccess())
          break;

        case 'STOP_GAME_RESULT':
        default:
          emit(actions.finishGame())
          break;
      }
    }

    const unsubscribe = () => {
      socket.close()
    }

    return unsubscribe
  })
}

export const sendMessage = function* ({ type, payload }, socket) {
  const { types } = actions
  const cmds = {
    [types.CHECK_GAME]:   'CHECK_AVAILABILITY',
    [types.START_GAME]:   types.START_GAME,
    [types.PAUSE_GAME]:   types.PAUSE_GAME,
    [types.RESUME_GAME]:  types.RESUME_GAME,
    [types.STOP_GAME]:    types.STOP_GAME, // response type: STATUS
    [types.FINISH_GAME]:  'STOP_GAME',
  }
  const msg = { cmd: cmds[type] }

  if (type === types.START_GAME) {
    msg.gameMode = gameMode[payload]
    msg.userToken = yield select(tokenSelector)
  }

  yield call(socket, 'send', JSON.stringify(msg))
}
