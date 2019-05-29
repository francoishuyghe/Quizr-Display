import QuizContainer from '../components/QuizContainer'
import { connect } from 'react-redux'
import { Router } from '../routes'

class Shared extends React.Component{

    static async getInitialProps ({query}) {
        return {query}
      }

    render() {

        const settings = this.props.settings ? this.props.settings : {}

      return <QuizContainer name="shared">
        <header>
          <h1>{settings.thankYouTitle}</h1>
        </header>
        
          <div className="content">
          <p>{ settings.thankYouText }</p>
          <a href="https://savemefrom.com/shop" target="_parent" className="btn">Shop Now</a>
          </div>

          <footer>
            <a className="greyed" onClick={() => Router.pushRoute('/', { shop: this.props.shop, domain: this.props.domain })}>Take the quiz again</a>
          </footer>
        </QuizContainer>
    }
}

//Connect Redux
const mapStateToProps = (state) => {
  return {
    settings: state.settings, 
    shop: state.shop,
    domain: state.domain
  }
}

const connectedShared = connect(mapStateToProps)(Shared)

export default connectedShared;