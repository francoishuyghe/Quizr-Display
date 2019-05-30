import QuizContainer from '../components/QuizContainer'
import Result from '../components/Result'
import { saveAnswer } from '../store'
import { connect } from 'react-redux'

class Results extends React.Component{

    render() {

        const { settings, topAnswers } = this.props

        const defaultOption = settings.resultOptions.find((option) => {
            return option.defaultOption == true
        })

        return <QuizContainer name="results">
            <header>
                <h1>{ settings.resultsTitle }</h1>
                <p>{ settings.resultsParagraph }</p>
            </header>

            <div className="content">
                {topAnswers && topAnswers.map(answer => <Result result={answer} />)}
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
      topAnswers: state.topAnswers
    }
  }
  const mapDispatchToProps = { saveAnswer }

  const connectedResults = connect(mapStateToProps, mapDispatchToProps)(Results)
  
  export default connectedResults;