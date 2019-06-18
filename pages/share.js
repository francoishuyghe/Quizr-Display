import {Router} from '../routes'
import QuizContainer from '../components/QuizContainer'
import { saveEmail, calculateAnswer} from '../store'
import { connect } from 'react-redux'

class Share extends React.Component{
    constructor( props ) {
        super( props );

        this.state = {
            email: '',
            error: ''
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
        const { settings, coupons, isSaving, savingError } = this.props

        return <QuizContainer name="share">
            <header>
                <h1>Almost there!</h1>
            </header>

            <div className="content">
                <p>{ settings.shareParagraph }</p>
                <form>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Your email address"
                    onChange={(e) => this.setState({email: e.target.value})}
                    value={this.state.email}
                /><br/>
                { this.state.error && 
                        <div className="alert">{this.state.error}</div>}
                { savingError && 
                        <div className="alert">{savingError}</div>}
                    {isSaving
                        ? <a className="btn">Saving...</a>
                        : <a onClick={this.sendEmail} className="btn">Send my Results{coupons._id && !coupons.discountPaused && coupons.discountCodes.length > 0 && " + Discount code"}</a>
                    }
                </form>
            </div>

            <footer>
                <a className="greyed" onClick={() => Router.pushRoute('results').then(() => window.scrollTo(0, 0))}>No thanks, take me to my results</a>
            </footer>
        </QuizContainer>
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    sendEmail(){
        const {email} = this.state
        //Verify email
        if (email) {
            if (this.validateEmail(email)){
                // Send contact to Zoho
                //TODO

                //Check if email has already been used
                //this.props.checkEmail(email)
                
                //Send email to contact
                this.props.saveEmail(email)

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
        redirect: state.redirect
    }
  }
  const mapDispatchToProps = { saveEmail, calculateAnswer }

  const connectedShare = connect(mapStateToProps, mapDispatchToProps)(Share)
  
  export default connectedShare;