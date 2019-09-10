import {Router} from '../routes'
import QuizContainer from '../components/QuizContainer'
import ShareForm from '../components/ShareForm'
import ShareFormTradeshow from '../components/ShareFormTradeshow'
import { saveUser, calculateAnswer} from '../store'
import { connect } from 'react-redux'

class Share extends React.Component{
    constructor( props ) {
        super(props);
        this.state = {
            error: {
                general: ''
            }
        }
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

        return <QuizContainer name="share" tradeshow={tradeshow}>
            <header>
                <h1>Almost there!</h1>
            </header>

            <div className="content">
                <p>{this.props.tradeshow ? settings.shareParagraphTradeshow || settings.shareParagraph : settings.shareParagraph}</p>
                {tradeshow
                    ? <ShareFormTradeshow {...this.props} sendEmail={this.sendEmail} error={this.state.error}/>
                    : <ShareForm {...this.props} sendEmail={this.sendEmail} error={this.state.error}/>}
            </div>

            <footer>
                {/* {!this.props.tradeshow &&
                    <a className="greyed" onClick={() => this.toResults()}>No thanks, take me to my results</a>
                } */}
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
        let validated = true
        let error = this.state.error
        const requiredFields = this.props.tradeshow
            ? ['firstName', 'lastName', 'company', 'email', 'phone']
            : ['email']
        
        requiredFields.map(field => {
            if (!data[field]) {
                validated = false
                error[field] = true
            } else { 
                error[field] = false
            }
            console.log(field, error[field])
        })

        //Verify email
        if (validated) {
            if (this.validateEmail(data.email)) {
                //Send email to contact
                this.props.saveUser(data)
                error.general = ''
                this.setState({
                    error
                })

            } else {
                error.general = 'Please enter a valid email address'
                error.email = true
                this.setState({
                    error
                })
            }
        } else { 
            error.general = 'Please fill out the required fields.'
            this.setState({
                error
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