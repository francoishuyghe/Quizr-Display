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
  shop: '',
  domain: '',
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
  topAnswers: [],
  answers: []
}

export const actionTypes = {
  GET_SETTINGS: 'GET_SETTINGS',
  REQUEST_SETTINGS: 'REQUEST_SETTINGS',
  RECEIVE_SETTINGS: 'RECEIVE_SETTINGS',
  SAVE_ANSWER: 'SAVE_ANSWER',
  SEND_EMAIL: 'SEND_EMAIL',
  SAVE_EMAIL: 'SAVE_EMAIL',
  CALCULATE_ANSWER: 'CALCULATE_ANSWER'
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {

    case actionTypes.GET_SETTINGS:
      newState.shop = action.data.shop
      newState.domain = action.data.domain
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
    
    case actionTypes.CALCULATE_ANSWER:
      newState.topAnswers = action.topAnswers
      return newState  

    default:
      return state
  }
}

// ACTIONS

//#################
// GET SETTINGS
//#################
export const requestSettings = (data) => {
  return {
    type: actionTypes.GET_SETTINGS,
    data
  }
}
export const receiveSettings = (shop, settings) => {
  return {
    type: actionTypes.RECEIVE_SETTINGS,
    shop,
    settings
  }
}

export function getSettings(data) {
  return function (dispatch, getState) {

    const state = Object.assign({}, getState());
    if (state.isLoaded) return

    dispatch(requestSettings(data))
    const shop = data.shop

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

export function sendEmail(email) {
  return (dispatch, getState) => {

    const state = Object.assign({}, getState());
    let dataToSave = {
      email,
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

export function calculateAnswer() {
  return (dispatch, getState) => {
    let { answers, settings } = Object.assign({}, getState());
    
    let positive = []
    let negative = []
    let results = {}

    //Group positivie and negative answers
    answers.map((answer) => {
        positive = positive.concat(answer.positive)
        negative = negative.concat(answer.negative)
    })

    //Count points for each option
    positive.map((value) => {
        results[value._id] = results[value._id] ? results[value._id] + 1 : 1
    })
    negative.map((value) => {
        results[value._id] = results[value._id] ? results[value._id] - 1 : -1
    })

    //Organize results in array
    var sortable = [];
    for (var value in results) {
        sortable.push([value, results[value]]);
    }

    //Sort array
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    //Only get top results
    var numberOfResults = 2
    const topResult = sortable.slice(0, numberOfResults)
    
    //Find full option object in settings
    const topAnswers = topResult.map(result => { 
      return settings.resultOptions.find((option) => {
        return option._id == result[0]
      })
    })

    dispatch({
      type: actionTypes.CALCULATE_ANSWER,
      topAnswers
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