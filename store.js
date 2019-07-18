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
  tradeshow: false,
  settings: {
    domain: '',
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
  answers: [],
  isSaving: false,
  savingError: '',
  redirect: false
}

export const actionTypes = {
  GET_SETTINGS: 'GET_SETTINGS',
  REQUEST_SETTINGS: 'REQUEST_SETTINGS',
  RECEIVE_SETTINGS: 'RECEIVE_SETTINGS',
  SAVE_ANSWER: 'SAVE_ANSWER',
  SEND_EMAIL: 'SEND_EMAIL',
  SAVE_EMAIL: 'SAVE_EMAIL',
  TRY_SAVING_EMAIL: 'TRY_SAVING_EMAIL',
  ERROR_SAVING_EMAIL: 'ERROR_SAVING_EMAIL',
  CALCULATE_ANSWER: 'CALCULATE_ANSWER',
  RESET_QUIZ: 'RESET_QUIZ',
  UPDATE_COUPONS: 'UPDATE_COUPONS'
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {

    case actionTypes.GET_SETTINGS:
      newState.shop = action.data.shop + ".myshopify.com"
      newState.tradeshow = action.data.tradeshow
      return newState

    case actionTypes.REQUEST_SETTINGS:
      newState.isFetching = true
      return newState

    case actionTypes.RECEIVE_SETTINGS:
      newState.isFetching = false
      newState.isLoaded = true
      newState.settings = action.settings
      newState.coupons = action.coupons
      return newState
    
    case actionTypes.TRY_SAVING_EMAIL:
      newState.isSaving = true
      return newState
    
    case actionTypes.ERROR_SAVING_EMAIL:
      newState.isSaving = false
      newState.savingError = action.error
      return newState
    
    case actionTypes.SAVE_EMAIL:
      newState.isSaving = false
      newState.savingError = ''
      newState.redirect = true
      return newState

    case actionTypes.SAVE_ANSWER:
      return Object.assign({}, state, {
        answers: action.answers
      });
    
    case actionTypes.CALCULATE_ANSWER:
      newState.topAnswers = action.topAnswers
      return newState
    
    case actionTypes.RESET_QUIZ:
      newState.answers = []
      
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
export const receiveSettings = (shop, settings, coupons) => {
  return {
    type: actionTypes.RECEIVE_SETTINGS,
    shop,
    settings,
    coupons
  }
}

export function getSettings(data) {
  return function (dispatch, getState) {

    const state = Object.assign({}, getState());
    if (state.isLoaded) return

    dispatch(requestSettings(data))
    const shop = data.shop + ".myshopify.com"

    return fetch(APP_URL + `/api/settings/${shop}`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(settings => { 
        //Get the coupons
        return fetch(APP_URL + `/api/coupons/${shop}`)
        .then(
          response => response.json(),
          error => console.log('An error occurred.', error)
        )
        .then(coupons => dispatch(receiveSettings(shop, settings, coupons)))
      })
  }
}

//#################
// EMAIL FUNCTIONS
//#################

export function sendEmail(email) {
  return (dispatch, getState) => {

    const state = Object.assign({}, getState());

    let coupons = state.coupons
    let couponToSend = {}
    if (coupons._id && !coupons.discountPaused && coupons.discountCodes.length > 0) { 
      couponToSend = {
        discountCode: coupons.discountCodes[0],
        discountText: coupons.discountType == 'dollars' ? '$' + coupons.discountAmount : coupons.discountAmount + '%'
      }
      dispatch(updateCoupons(coupons, state.shop))
    }

    let dataToSave = {
      email,
      state,
      couponToSend
    }

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

// export function checkEmail(email) {
//   return (dispatch, getState) => {

//     const {shop} = getState()
//     let dataToSave = {
//       shop
//     }

//     return fetch(APP_URL + `/api/checkemail`, {
//         method: 'POST',
//         body: JSON.stringify(dataToSave),
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       .then(
//         response => response.json(),
//         // Do not use catch
//         error => console.log('An error occurred.', error)
//       )
//       .then(json => console.log(json))
//   }
// }

export function updateCoupons(coupons, shop) {
  return (dispatch) => {

    let updatedCoupons = coupons
    updatedCoupons.discountCodesSent.push(coupons.discountCodes[0])
    updatedCoupons.discountCodes.splice(0, 1)

    return fetch(APP_URL + `/api/updatecoupons`, {
        method: 'PUT',
        body: JSON.stringify({updatedCoupons, shop}),
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
        type: actionTypes.UPDATE_COUPONS
      }))
  }
}

export const trySavingEmail = () => {
  return {
    type: actionTypes.TRY_SAVING_EMAIL
  }
}

export function saveUser(data) {
  return (dispatch, getState) => {

    let { shop, answers } = getState();
    const quizAnswers = []
    for (var key in answers) {
      quizAnswers.push({
        question: key,
        answers: answers[key].map(answer => { 
          return answer.text
        })
      })
    }
    
    const user = {
      quizAnswers,
      ...data
    }

    let dataToSave = {
      user,
      shop
    }

    dispatch(trySavingEmail())

    return fetch(APP_URL + `/api/saveuser`, {
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
      .then(json => {
        if (json.data.nModified == 0 && !json.data.upserted) {
          dispatch({
            type: actionTypes.ERROR_SAVING_EMAIL,
            error: 'Email address has been used before',
            isSaving: false
          })
        } else { 
          if (data && data.email) {
            dispatch(sendEmail(data.email))
            dispatch({ type: actionTypes.SAVE_EMAIL })
          }
        }
      })
  }
}

//#################
// SAVE ANSWERS WHEN PEOPLE TAKE THE QUIZ
//#################

export function saveAnswer(answer, question) {
  return (dispatch, getState) => {
    let { answers } = Object.assign({}, getState());

    answer.question = question._id

    if (question.answerNumber == 1) {
      //Unique answer
      answers[question._id] = [answer]
    } else {
      if (answers[question._id]) {
        const indexOf = answers[question._id].indexOf(answer)

        if (indexOf >= 0) {
          //If the element is alreadfy in array
          answers[question._id].splice(indexOf, 1)
        } else { 
          //If the answer is new
          answers[question._id].push(answer)
        }
      } else {
        //If this is a first answer
        answers[question._id] = [answer]
      }
    }

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

    let allAnswers = []
    for (var key in  answers) { 
      allAnswers.push(answers[key])
    }
    allAnswers.map(answers => { 
      return answers.length > 1 ? answers.push(answers[0]): answers 
    })

    allAnswers = [].concat.apply([], allAnswers)

    //Group positive and negative answers
    
    allAnswers.map((answer) => {
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


export function resetQuiz() {
  return {
      type: actionTypes.RESET_QUIZ,
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