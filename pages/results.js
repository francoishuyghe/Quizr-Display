import QuizContainer from '../components/QuizContainer'
import ProductDisplay from '../components/productDisplay'
import { saveAnswer } from '../store'
import { connect } from 'react-redux'

class Results extends React.Component{

    render() {

        const { settings, domain, topAnswers } = this.props

        const defaultOption = settings.resultOptions.find((option) => {
            return option.defaultOption == true
        })

        return <QuizContainer name="results">
            <header>
                <h1>{ settings.resultsTitle }</h1>
                <p>{ settings.resultsParagraph }</p>
            </header>

            <div className="content">
                {topAnswers && topAnswers.map((answer, index) => <ProductDisplay index={index} key={answer._id} product={answer.product} description={answer.paragraph}  domain={domain} />)}
                {defaultOption && <ProductDisplay product={defaultOption.product} description={defaultOption.paragraph} settings={settings} />}
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
        domain: state.domain,
      topAnswers: state.topAnswers
    }
  }
  const mapDispatchToProps = { saveAnswer }

  const connectedResults = connect(mapStateToProps, mapDispatchToProps)(Results)
  
  export default connectedResults;