import QuizContainer from '../components/QuizContainer'
import Result from '../components/Result'
import { saveAnswer, calculateAnswer } from '../store'
import { connect } from 'react-redux'

class Results extends React.Component{

    componentWillMount(){
        this.props.calculateAnswer()
    }

    render() {

        const { settings, answer } = this.props

        const defaultOption = settings.resultOptions.find((option) => {
            return option.defaultOption == true
        })

        return <QuizContainer name="results">
            <header>
                <h1>{ settings.resultsTitle }</h1>
                <p>{ settings.resultsParagraph }</p>
            </header>

            <div className="content">
                {answer && <Result result={answer} />}
                {defaultOption && <Result result={defaultOption} />}
            </div>

            <footer>
                <p>{ settings.resultsTextAfter }</p>
            </footer>
        </QuizContainer>
    }
}

//Connect Redux
const mapStateToProps = (state) => {
    return {
      settings: state.settings,
      answer: state.answer
    }
  }
  const mapDispatchToProps = { saveAnswer, calculateAnswer }

  const connectedResults = connect(mapStateToProps, mapDispatchToProps)(Results)
  
  export default connectedResults;