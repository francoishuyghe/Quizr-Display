import QuizContainer from '../components/QuizContainer'
import ProductDisplay from '../components/productDisplay'
import { saveAnswer } from '../store'
import { connect } from 'react-redux'

class Results extends React.Component{

    render() {

        const { settings, topAnswers } = this.props

        const resultsTitle  = this.props.tradeshow ? settings.resultsTitleTradeshow || settings.resultsTitle : settings.resultsTitle
        const resultsParagraph  = this.props.tradeshow ? settings.resultsParagraphTradeshow || settings.resultsParagraph : settings.resultsParagraph
        const resultsTextAfter  = this.props.tradeshow ? settings.resultsTextAfterTradeshow || settings.resultsTextAfter : settings.resultsTextAfter

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
                <p>{ resultsTextAfter }</p>
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