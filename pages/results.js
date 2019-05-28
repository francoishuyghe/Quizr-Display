import QuizContainer from '../components/QuizContainer'
import Result from '../components/Result'
import { saveAnswer } from '../store'
import { connect } from 'react-redux'

class Results extends React.Component{
    state = {
        result: {}
    }

    componentWillMount(){
        let positive = []
        let negative = []
        let results = {}

        //Group positivie and negative answers
        this.props.answers.map((answer) => {
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
            return a[1] - b[1];
        });

        //Only get top result
        const topResult = sortable.slice(0, 1)
        this.setState({
            result: topResult[0]
        })
    }

    render() {

        const { settings } = this.props

        const resultOption = settings.resultOptions.find((option) => {
            return option._id == this.state.result[0]
        })

        const defaultOption = settings.resultOptions.find((option) => {
            return option.defaultOption == true
        })

        return <QuizContainer name="results">
            <header>
                <h1>{ settings.resultsTitle }</h1>
                <p>{ settings.resultsParagraph }</p>
            </header>

            <div className="content">
                {resultOption && <Result key={resultOption._id} result={resultOption} />}
                {defaultOption && <Result key={defaultOption._id} result={defaultOption} />}
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
      answers: state.answers
    }
  }
  const mapDispatchToProps = { saveAnswer }

  const connectedResults = connect(mapStateToProps, mapDispatchToProps)(Results)
  
  export default connectedResults;