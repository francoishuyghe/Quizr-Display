import thunkMiddleware from 'redux-thunk'
import {
  createStore,
  applyMiddleware
} from 'redux'
import {
  createLogger
} from 'redux-logger'
import fetch from 'cross-fetch'

const loggerMiddleware = createLogger({
  collapsed: true
})

const initialState = {
  isFetching: false,
  isLoaded: false,
  settings: {
    collectEmailChecked: true,
    resultsTitle: '',
    resultsParagraph: '',
    resultsTextAfter: '',
    introTitle: '',
    introParagraph: '',
    questions: [],
    resultOptions: []
  },
  answers: []
}

export const actionTypes = {
  GET_SETTINGS: 'GET_SETTINGS',
  REQUEST_SETTINGS: 'REQUEST_SETTINGS',
  RECEIVE_SETTINGS: 'RECEIVE_SETTINGS',
  SAVE_ANSWER: 'SAVE_ANSWER',
  SEND_EMAIL: 'SEND_EMAIL',
  SAVE_EMAIL: 'SAVE_EMAIL'
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {

    case actionTypes.GET_SETTINGS:
      newState.shop = action.shop
      return newState

    case actionTypes.REQUEST_SETTINGS:
      newState.isFetching = true
      return newState

    case actionTypes.RECEIVE_SETTINGS:
      newState.isFetching = false
      newState.isLoaded = true
      newState.settings = action.settings
      return newState

    case actionTypes.SAVE_ANSWER:
      return Object.assign({}, state, {
        answers: action.answers
      });

    default:
      return state
  }
}

// ACTIONS

//#################
// GET SETTINGS
//#################
export const requestSettings = (shop) => {
  return {
    type: actionTypes.GET_SETTINGS,
    shop
  }
}
export const receiveSettings = (shop, settings) => {
  return {
    type: actionTypes.RECEIVE_SETTINGS,
    shop,
    settings
  }
}

export function getSettings(shop) {
  return function (dispatch, getState) {

    const state = Object.assign({}, getState());
    if (state.isLoaded) return

    dispatch(requestSettings(shop))

    return fetch(APP_URL + `/api/settings/${shop}`)
      .then(
        response => response.json(),
        // Do not use catch
        error => console.log('An error occurred.', error)
      )
      .then(json => dispatch(receiveSettings(shop, json)))
  }
}

//#################
// EMAIL FUNCTIONS
//#################

export function sendEmail(email, results) {
  return (dispatch, getState) => {

    const state = Object.assign({}, getState());
    let dataToSave = {
      email,
      results,
      state
    }
    dispatch(saveEmail(email))

    return fetch(APP_URL + `/api/sendemail`, {
        method: 'POST',
        body: JSON.stringify(dataToSave),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(
        response => response.json(),
        // Do not use catch
        error => console.log('An error occurred.', error)
      )
      .then(json => dispatch({
        type: actionTypes.SEND_EMAIL
      }))
  }
}

export function saveEmail(email) {
  return (dispatch, getState) => {

    let {
      shop
    } = getState();
    let dataToSave = {
      email,
      shop
    }

    return fetch(APP_URL + `/api/saveemail`, {
        method: 'PUT',
        body: JSON.stringify(dataToSave),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(
        response => response.json(),
        // Do not use catch
        error => console.log('An error occurred.', error)
      )
      .then(json => dispatch({
        type: actionTypes.SAVE_EMAIL
      }))
  }
}

//#################
// SAVE ANSWERS WHEN PEOPLE TAKE THE QUIZ
//#################

export function saveAnswer(answer, questionNum) {
  return (dispatch, getState) => {
    let {
      answers
    } = Object.assign({}, getState());
    answers[questionNum] = answer

    dispatch({
      type: actionTypes.SAVE_ANSWER,
      answers
    })
  }
}



// INITIALIZE
export function initializeStore() {
  return createStore(
    reducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
}

export function makeStore(initialState) {
  return createStore(reducer, initialState);
};