import QuizContainer from '../components/QuizContainer'
import Answer from '../components/Answer'
import { saveAnswer } from '../store'
import { connect } from 'react-redux'
import {Router} from '../routes'

class Question extends React.Component{

    constructor( props ) {
        super( props );

        this.state = {
            isLeaving: false
        }

        this.clickedAnswer = this.clickedAnswer.bind( this );
    }

    static async getInitialProps ({query}) {
        return {query}
    }

    render() {

        const { settings, query, answers } = this.props
        const { isLeaving } = this.state

        const currentNumber = parseInt(query.number)
        const currentAnswer = answers[currentNumber]

        const question = settings.questions[currentNumber - 1] || {}

        //Render the answers
        const answerRender = question.answers && question.answers.map((answer, index) => {
            return <Answer 
                        key={index} 
                        answer={answer}
                        selected={currentAnswer && currentAnswer._id == answer._id}
                        clicked={this.clickedAnswer} 
                    />
        })

        // Render the counter
        const renderCounter = settings.questions.map((item, index) => {
            const className = index == currentNumber - 1 ? 'line active' : 'line'
            return <div key={item._id} className={className} ></div>
        })

        return <QuizContainer name="question">
            <header>
                <div className="counter">
                    {renderCounter}
                </div>
                <h1>{question.question}</h1>
            </header>

            <div className='content'>
                <div className={isLeaving ? "answerWrap leaving" : "answerWrap"}>
                    {answerRender}
                </div>
            </div>

            <footer>
            { currentNumber > 1
                && <a className="btn back" onClick={() => Router.pushRoute('question', {number: currentNumber - 1})}>Back</a>
            }
            </footer>
        </QuizContainer>
    }

    clickedAnswer(answer) {
        // Save selected answer
        const currentNumber = parseInt(this.props.query.number)
        //Define if there is a following question
        const nextQuestion = currentNumber < this.props.settings.questions.length
            ? currentNumber + 1
            : 0

        this.props.saveAnswer(answer, currentNumber)

        this.setState({
            isLeaving: true
        })

        // Go to next page
        if (nextQuestion > 0) {
            setTimeout(() => {
                Router.pushRoute('question', { number: nextQuestion }).then(() => window.scrollTo(0, 0))
                this.setState({ isLeaving: false })
            }, 500)

        } else { 
            Router.pushRoute('share').then(() => window.scrollTo(0, 0))
        }
    }
}

//Connect Redux
const mapStateToProps = (state) => {
    return {
      settings: state.settings,
      answers: state.answers,
      rand: Math.random()
    }
  }
  const mapDispatchToProps = { saveAnswer }

  const connectedQuestion = connect(mapStateToProps, mapDispatchToProps)(Question)
  
  export default connectedQuestion;