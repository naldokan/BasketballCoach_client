import { eventChannel, END } from 'redux-saga'
import { select, call } from 'redux-saga/effects'
import { tokenSelector } from '../auth/selectors'
import * as actions from './actions'
import { Round } from 'utils'


const gameAvailability = {
  FREE: true,
  OCCUPIED: false
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
      socket.connected = true
    }

    socket.onclose = e => {
    }

    socket.onerror = e => {
      const msg = socket.connected ? 'Sorry, Network connection lost.'
        : 'Sorry, Can\'t connect to the server. Please make sure your server is up.'
      emit(actions.socketError(msg))
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
          break
        
        case 'START_GAME_RESULT':
          if (msg['value'] === gameAvailability.OCCUPIED) {
            emit(actions.showGameStatus({ status: false, user: 'Another user' }))
          } else {
            emit(actions.controlSuccess())
          }
          break;

        case 'LAST_SHOT':
          const shot = {
            releaseAngle: Round(msg.value['release_angle']),
            releaseTime: Round(msg.value['release_time']),
            legAngle: Round(msg.value['leg_angle']),
            elbowAngle: Round(msg.value['elbow_angle']),
            success: msg.value['goal'],
            x: msg.value['posX'] * 1000,
            y: msg.value['posY'] * 1000
          }
          emit(actions.updateLastShot(shot))
          break

        case 'ELAPSED_TIME':
          emit(actions.updateTime(msg['value'] * 1000))
          break

        case 'START_GAME_RESULT':
        case 'PAUSE_GAME_RESULT':
        case 'RESUME_GAME_RESULT':
          emit(actions.controlSuccess())
          break

        case 'STOP_GAME_RESULT':
        default:
          emit(actions.finishGame())
          break
      }
    }

    const unsubscribe = () => {
      socket.close(1000)
    }

    return unsubscribe
  })
}

export const send = function (socket, data) {
  return socket.send(data)
}

export const sendMessage = function* (socket, { type, payload }) {
  const { types } = actions
  const cmds = {
    [types.CHECK_GAME]:   'CHECK_AVAILABILITY',
    [types.START_GAME]:   types.START_GAME,
    [types.PAUSE_GAME]:   types.PAUSE_GAME,
    [types.RESUME_GAME]:  types.RESUME_GAME,
    [types.STOP_GAME]:    types.STOP_GAME, // response type: STATUS
    [types.FINISH_GAME]:  'STOP_GAME',
  }
  const msg = { action: cmds[type] }

  if (type === types.START_GAME) {
    msg.gameMode = gameMode[payload]
    msg.userToken = yield select(tokenSelector)
  }

  yield call(send, socket, JSON.stringify(msg))
}
