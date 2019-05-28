import {Router} from '../routes'
import QuizContainer from '../components/QuizContainer'
import { sendEmail } from '../store'
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

    render() {
        const { settings } = this.props

        return <QuizContainer name="share">
            <header>
                <h1>Share</h1>
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
                    <div className="alert">{ this.state.error }</div>}
                <a onClick={this.sendEmail} className="btn">Send my Results</a>
                </form>
            </div>

            <footer>
                <a className="greyed" onClick={() => Router.pushRoute('results')}>Not thanks, take me to my results</a>
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
                
                //Send email to contact
                this.props.sendEmail(email, this.props.answers)

                // Route to a thank you message
                Router.pushRoute('shared')
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
      answers: state.answers
    }
  }
  const mapDispatchToProps = { sendEmail }

  const connectedShare = connect(mapStateToProps, mapDispatchToProps)(Share)
  
  export default connectedShare;