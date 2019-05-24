import QuizContainer from '../components/QuizContainer'
import { connect } from 'react-redux'

class Shared extends React.Component{

    static async getInitialProps ({query}) {
        return {query}
      }

    render() {

        const settings = this.props.settings ? this.props.settings : {}

        return <QuizContainer name="shared">
            <h1>{ settings.thankYouTitle }</h1>
            <p>{ settings.thankYouText }</p>
            <a href="https://savemefrom.com/shop" target="_parent" className="btn">Shop Now</a>
        </QuizContainer>
    }
}

//Connect Redux
const mapStateToProps = (state) => {
  return {
    settings: state.settings
  }
}

const connectedShared = connect(mapStateToProps)(Shared)

export default connectedShared;