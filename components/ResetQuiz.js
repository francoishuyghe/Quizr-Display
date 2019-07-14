import { Router } from '../routes'
import { resetQuiz } from '../store'
import { connect } from 'react-redux'

class ResetQuiz extends React.Component {

    constructor( props ) {
        super( props );
        this.resetQuiz = this.resetQuiz.bind(this)
    }
  
    render() {
        return <div className="resetQuiz">
            <a onClick={this.resetQuiz}>Reset</a>
            </div>
    }

    resetQuiz() {
        Router.pushRoute('/')
        this.props.resetQuiz()
    }
  }
  
  //Connect Redux
const mapDispatchToProps = { resetQuiz }

const connectedResetQuiz = connect(null, mapDispatchToProps)(ResetQuiz)

export default connectedResetQuiz;