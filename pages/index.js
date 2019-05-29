import QuizContainer from '../components/QuizContainer'
import { connect } from 'react-redux'
import { getSettings } from '../store'
import {Router} from '../routes'

class Index extends React.Component{

    static async getInitialProps ({query}) {
        return {query}
      }
    
      componentWillMount(){
        this.props.getSettings(this.props.query)
      }

    render() {

      const settings = this.props.settings ? this.props.settings : {}

        return this.props.isLoaded ? 
        <QuizContainer name="index">
            <h1>{ settings.title }</h1>
            <p>{ settings.intro }</p>
            <a onClick={() => Router.pushRoute('intro')} className="btn">Start</a>
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

const connectedIndex = connect(mapStateToProps, mapDispatchToProps)(Index)

export default connectedIndex;