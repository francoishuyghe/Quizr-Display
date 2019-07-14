import {Router} from '../routes'
import QuizContainer from '../components/QuizContainer'
import ShareForm from '../components/ShareForm'
import ShareFormTradeshow from '../components/ShareFormTradeshow'
import { saveUser, calculateAnswer} from '../store'
import { connect } from 'react-redux'

class Share extends React.Component{
    constructor( props ) {
        super( props );
        this.sendEmail = this.sendEmail.bind(this)
    }

    componentWillMount(){
        this.props.calculateAnswer()
    }

    componentWillReceiveProps(nextProps) { 
        if (nextProps.redirect) { 
            // Route to results
            Router.pushRoute('results')
        }
    }

    render() {
        const { settings, tradeshow } = this.props

        return <QuizContainer name="share">
            <header>
                <h1>Almost there!</h1>
            </header>

            <div className="content">
                <p>{settings.shareParagraph}</p>
                {tradeshow
                    ? <ShareFormTradeshow {...this.props} sendEmail={this.sendEmail} />
                    : <ShareForm {...this.props} sendEmail={this.sendEmail}/>}
            </div>

            <footer>
                <a className="greyed" onClick={() => this.toResults()}>No thanks, take me to my results</a>
            </footer>
        </QuizContainer>
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    toResults() { 
        this.props.saveUser()
        Router.pushRoute('results').then(() => window.scrollTo(0, 0))
    }

    sendEmail(data) {
        const {email} = data
        //Verify email
        if (email) {
            if (this.validateEmail(email)){
                //Send email to contact
                this.props.saveUser(data)

            } else {
                this.setState({
                    error: 'Please enter a valid email address'
                })    
            }
        } else {
            this.setState({
                error: 'Please enter an email address'
            })
        }
    }
}

//Connect Redux
const mapStateToProps = (state) => {
    return {
        settings: state.settings,
        coupons: state.coupons,
        isSaving: state.isSaving,
        savingError: state.savingError,
        redirect: state.redirect,
        tradeshow: state.tradeshow
    }
  }
  const mapDispatchToProps = { saveUser, calculateAnswer }

  const connectedShare = connect(mapStateToProps, mapDispatchToProps)(Share)
  
  export default connectedShare;