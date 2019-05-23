import { createAction } from 'redux-actions'

const CONNECT_GAME = 'CONNECT_GAME'
const DISCONNECT_GAME = 'DISCONNECT_GAME'
const WAIT_FOR_FREE_GAME = 'WAIT_FOR_FREE_GAME'

const START_GAME = 'START_GAME'
const FINISH_GAME = 'FINISH_GAME'
const PAUSE_GAME = 'PAUSE_GAME'
const RESUME_GAME = 'RESUME_GAME'
const STOP_GAME = 'STOP_GAME'
const QUIT_GAME = 'QUIT_GAME'

const UPDATE_TIME = 'UPDATE_TIME'
const UPDATE_LAST_SHOT = 'UPDATE_LAST_SHOT'

const SOCKET_ERROR = 'SOCKET_ERROR'

export const types = {
  CONNECT_GAME,
  DISCONNECT_GAME,
  WAIT_FOR_FREE_GAME,
  START_GAME,
  FINISH_GAME,
  PAUSE_GAME,
  RESUME_GAME,
  STOP_GAME,
  QUIT_GAME,
  UPDATE_TIME,
  UPDATE_LAST_SHOT,
  FINISH_GAME,
  SOCKET_ERROR
}

export const connectGame = createAction(CONNECT_GAME)
export const disconnectGame = createAction(DISCONNECT_GAME)
export const waitForFreeGame = createAction(WAIT_FOR_FREE_GAME)
export const startGame = createAction(START_GAME)
export const updateLastShot = createAction(UPDATE_LAST_SHOT)
export const finishGame = createAction(FINISH_GAME)
export const updateTime = createAction(UPDATE_TIME)
export const socketError = createAction(SOCKET_ERROR)
