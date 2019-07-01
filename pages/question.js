import QuizContainer from '../components/QuizContainer'
import Answer from '../components/Answer'
import { saveAnswer } from '../store'
import { connect } from 'react-redux'
import {Router} from '../routes'

class Question extends React.Component{

    constructor( props ) {
        super( props );

        this.state = {
            question: {},
            isLeaving: false,
            enableNext: false
        }

        this.clickedAnswer = this.clickedAnswer.bind( this )
        this.nextPage = this.nextPage.bind( this )
    }

    static async getInitialProps ({query}) {
        return {query}
    }

    componentWillMount() { 
        const number = parseInt(this.props.query.number)
        const nextQuestion = number < this.props.settings.questions.length
            ? number + 1
            : 0
        
        this.setState({
            number,
            nextQuestion,
            question: this.props.settings.questions[number - 1]
        })
    }
    
    componentWillUpdate(nextProps) {

        if (this.props.query != nextProps.query) { 
            const number = parseInt(nextProps.query.number)
            const nextQuestion = number < nextProps.settings.questions.length
                ? number + 1
                : 0
            
            this.setState({
                number,
                nextQuestion,
                question: nextProps.settings.questions[number - 1]
            })
        }
    }

    render() {

        const { settings, answers } = this.props
        const { isLeaving, question, number } = this.state
        
        const currentAnswer = answers[question._id] || []

        //Render the answers
        const answerRender = question.answers && question.answers.map((answer, index) => {
            const selected = currentAnswer
                && currentAnswer.indexOf(answer) >= 0
            
            return <Answer 
                key={index}
                answer={answer}
                selected={selected}
                clicked={this.clickedAnswer}
                ordered={question.ordered ? currentAnswer.indexOf(answer) : -1}
            />
        })

        // Render the counter
        const renderCounter = settings.questions.map((item, index) => {
            const className = index == number - 1 ? 'line active' : 'line'
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
            { number > 1
                && <a className="btn back" onClick={() => Router.pushRoute('question', {number: number - 1})}>Back</a>
                }
                {
                    this.state.enableNext &&
                    <a className="btn next" onClick={() => this.nextPage()}>Next</a>
                }
            </footer>
        </QuizContainer>
    }

    clickedAnswer(answer) {
        // Save selected answer
        this.props.saveAnswer(answer, this.state.question)

        if (this.state.question.answerNumber == 1) {
            //If the is only a unique answer
            this.nextPage()

        } else {
            //If it is a multiple choice question
            this.setState({
                enableNext: true
            })
        }
    }

    nextPage() {
        this.setState({
            isLeaving: true
        })

        const {nextQuestion} = this.state

        // Go to next page
        if (nextQuestion > 0) {
            setTimeout(() => {
                Router.pushRoute('question', { number: nextQuestion }).then(() => window.scrollTo(0, 0))
                this.setState({ isLeaving: false, enableNext: false })
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