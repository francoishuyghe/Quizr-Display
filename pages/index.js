import QuizContainer from '../components/QuizContainer'
import { connect } from 'react-redux'
import { getSettings } from '../store'
import {Router} from '../routes'

class Index extends React.Component{

  static async getInitialProps ({query}) {
    return {query}
  }
    
  componentWillMount() {
    this.props.getSettings(this.props.query)
  }

    render() {

      const settings = this.props.settings ? this.props.settings : {}

      const intro = this.props.tradeshow ? settings.introTradeshow || settings.intro : settings.intro
      const title = this.props.tradeshow ? settings.titleTradeshow || settings.title : settings.title

        return this.props.isLoaded ? 
        <QuizContainer name="index">
            <h1>{ title }</h1>
            <p>{intro}</p>
            <a onClick={() => Router.pushRoute('intro').then(() => window.scrollTo(0, 0))} className="btn">Start</a>
        </QuizContainer>
        : 'Loading'
    }
}

//Connect Redux
const mapStateToProps = (state) => {
  return {
    isLoaded: state.isLoaded,
    settings: state.settings,
    tradeshow: state.tradeshow
  }
}

const mapDispatchToProps = { getSettings }

const connectedIndex = connect(mapStateToProps, mapDispatchToProps)(Index)

export default connectedIndex;