import QuizContainer from '../components/QuizContainer'
import { connect } from 'react-redux'
import { getSettings } from '../store'
import {Router} from '../routes'

class Intro extends React.Component{

    static async getInitialProps ({query}) {
        return {query}
      }
    
      componentWillMount(){
        this.props.getSettings(this.props.query.shop)
      }

    render() {

        const settings = this.props.settings ? this.props.settings : {}

        return this.props.isLoaded ? 
        <QuizContainer name="intro">
            <h1>{ settings.introTitle }</h1>
            <p>{ settings.introParagraph }</p>
            <a onClick={() => Router.pushRoute('question', {number: 1}).then(() => window.scrollTo(0, 0))} className="btn">Next</a>
        </QuizContainer>
        : 'Loading'
    }
}

//Connect Redux
const mapStateToProps = (state) => {
  return {
    isLoaded: state.isLoaded,
    settings: state.settings
  }
}

const mapDispatchToProps = { getSettings }

const connectedIntro = connect(mapStateToProps, mapDispatchToProps)(Intro)

export default connectedIntro;