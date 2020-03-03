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
        const { coupons, isSaving, savingError, error } = this.props
        const { email } = this.state.data
  
      return <form>
        <input 
            type="email" 
            name="email" 
            placeholder="Your email address"
            onChange={this.updateState}
              value={email}
              className={error.email ? 'error' : ''}
        />
        { error.general && 
                <div className="alert">{error.general}</div>}
            {isSaving
                ? <a className="btn">Saving...</a>
                : <a onClick={() => this.props.sendEmail(this.state.data)} className="btn">Send my Results{coupons._id && settings.couponGeneral && coupons.discountCodes.length > 0 && " + Discount code"}</a>
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