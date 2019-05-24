import { eventChannel, END } from 'redux-saga'
import { select, call } from 'redux-saga/effects'
import { tokenSelector } from '../auth/selectors'
import * as actions from './actions'


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
        case 'STATUS':
          if (msg['status'] === 'ALREADY_OCCUPIED') {
            emit(actions.showGameStatus({ status: false, user: msg['user' ]}))
          } else if (socket.afterStartRequest) {
            emit(actions.controlSuccess())
          } else {
            emit(actions.showGameStatus({ status: true }))
          }
          break;

        case 'LAST_SHOT':
          emit(actions.updateLastShot(msg['data']))
          break;

        case 'ELAPSED_TIME':
          emit(actions.updateTime(msg['time']))
          break;

        case 'CONTROL_SUCCESS':
          emit(actions.controlSuccess())
          break;

        case 'FINISH':
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
    [types.START_GAME]:   types.START_GAME,
    [types.PAUSE_GAME]:   types.PAUSE_GAME,
    [types.RESUME_GAME]:  types.RESUME_GAME,
    [types.STOP_GAME]:    types.STOP_GAME, // response type: STATUS
    [types.FINISH_GAME]:  types.FINISH_GAME,
  }
  const msg = { cmd: cmds[type] }

  if (type === types.START_GAME) {
    msg.mode = payload.mode
    msg.token = yield select(tokenSelector)
    socket.afterStartRequest = true
  }

  yield call(socket, 'send', JSON.stringify(msg))
}
