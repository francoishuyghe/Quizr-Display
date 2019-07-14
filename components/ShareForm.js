class ShareForm extends React.Component {

    constructor( props ) {
        super( props );

        this.state = {
            data: {
                email: ''
            },
            error: ''
        }

        this.updateState = this.updateState.bind(this)
    }

  
    render() {
        const { coupons, isSaving, savingError } = this.props
        const { email } = this.state.data
  
      return <form>
        <input 
            type="email" 
            name="email" 
            placeholder="Your email address"
            onChange={this.updateState}
            value={email}
        /><br/>
        { this.state.error && 
                <div className="alert">{this.state.error}</div>}
        { savingError && 
                <div className="alert">{savingError}</div>}
            {isSaving
                ? <a className="btn">Saving...</a>
                : <a onClick={() => this.props.sendEmail(this.state.data)} className="btn">Send my Results{coupons._id && !coupons.discountPaused && coupons.discountCodes.length > 0 && " + Discount code"}</a>
            }
      </form>
    }

    updateState(e) { 
        const name = e.target.name
        const value = e.target.value
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                [name]: value
            }
        }))
    }
  }
  
export default ShareForm;