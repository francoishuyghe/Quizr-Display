import QuizContainer from '../components/QuizContainer'
import ProductDisplay from '../components/productDisplay'
import ResultsNotes from '../components/ResultsNotes'
import { saveAnswer } from '../store'
import { connect } from 'react-redux'

class Results extends React.Component{

    render() {

        const { settings, topAnswers, tradeshow } = this.props

        const resultsTitle  = tradeshow ? settings.resultsTitleTradeshow || settings.resultsTitle : settings.resultsTitle
        const resultsParagraph  = tradeshow ? settings.resultsParagraphTradeshow || settings.resultsParagraph : settings.resultsParagraph
        const resultsTextAfter  = tradeshow ? settings.resultsTextAfterTradeshow || settings.resultsTextAfter : settings.resultsTextAfter

        const defaultOption = settings.resultOptions.find((option) => {
            return option.defaultOption == true
        })

        return <QuizContainer name="results">
            <header>
                <h1>{resultsTitle}</h1>
                <div className="description" dangerouslySetInnerHTML={{ __html: resultsParagraph }} />
            </header>

            <div className="content">
                {topAnswers && topAnswers.map((answer, index) => <ProductDisplay index={index} key={answer._id} product={answer.product} description={answer.paragraph} settings={settings} />)}
                {defaultOption && <ProductDisplay product={defaultOption.product} description={defaultOption.paragraph} settings={settings} />}
            </div>

            <footer>
                <p>{resultsTextAfter}</p>
                {tradeshow && <ResultsNotes />}
            </footer>
        </QuizContainer>
    }
}

//Connect Redux
const mapStateToProps = (state) => {
    return {
        settings: state.settings,
        topAnswers: state.topAnswers,
        tradeshow: state.tradeshow
    }
  }
  const mapDispatchToProps = { saveAnswer }

  const connectedResults = connect(mapStateToProps, mapDispatchToProps)(Results)
  
  export default connectedResults;