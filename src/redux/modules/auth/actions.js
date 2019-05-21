import { createAction } from 'redux-actions'

const TRY_AUTH = 'TRY_AUTH'
const SET_AUTH = 'SET_AUTH'
const SIGN_OUT = 'SIGN_OUT'
const REGISTER = 'REGISTER'

export const types = {
  TRY_AUTH,
  SET_AUTH,
  SIGN_OUT,
  REGISTER,
}

export const tryAuth = createAction(TRY_AUTH)
export const setAuth = createAction(SET_AUTH)
export const signout = createAction(SIGN_OUT)
export const register = createAction(REGISTER)
