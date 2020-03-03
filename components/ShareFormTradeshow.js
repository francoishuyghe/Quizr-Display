class ShareForm extends React.Component {

    constructor( props ) {
        super( props );

        this.state = {
            data: {
                tradeshow: true,
                firstName: '',
                lastName: '',
                email: '',
                company: ''
            }
        }

        this.updateState = this.updateState.bind(this)
    }

  
    render() {
        const { coupons, isSaving, error, settings } = this.props
        const { firstName, lastName, email, company, phone, address1, address2, city, state, zipcode } = this.state.data
  
        return <form>
            <input 
                type="text"
                name="firstName"
                placeholder="First Name"
                onChange={this.updateState}
                value={firstName}
                className={error.firstName ? 'error half' : 'half'}
            />

            <input 
                type="text" 
                name="lastName" 
                placeholder="Last Name"
                onChange={this.updateState}
                value={lastName}
                className={error.lastName ? 'error half' : 'half'}
            />

            <input 
                type="text" 
                name="company" 
                placeholder="Company"
                onChange={this.updateState}
                value={company}
                className={error.company ? 'error' : ''}
            />
            
            <input 
                type="email" 
                name="email" 
                placeholder="Email address"
                onChange={this.updateState}
                value={email}
                className={error.email ? 'error' : ''}
            />

            <input 
                type="text" 
                name="phone" 
                placeholder="Phone Number"
                onChange={this.updateState}
                value={phone}
                className={error.phone ? 'error' : ''}
            />

            <input 
                type="text" 
                name="address1" 
                placeholder="Address Line 1"
                onChange={this.updateState}
                value={address1}
            />

            <input 
                type="text" 
                name="address2"
                placeholder="Address Line 2"
                onChange={this.updateState}
                value={address2}
            />

            <input 
                type="text" 
                name="city"
                placeholder="City"
                onChange={this.updateState}
                value={city}
            />
            
            <input 
                type="text" 
                name="state"
                placeholder="State"
                onChange={this.updateState}
                value={state}
                className="half"
            />
            
            <input 
                type="text" 
                name="zipcode"
                placeholder="Zipcode"
                onChange={this.updateState}
                value={zipcode}
                className="half"
            />

            <br/>

        { error.general && 
                <div className="alert">{ error.general }</div>}
            {isSaving
                ? <a className="btn">Saving...</a>
                : <a onClick={() => this.props.sendEmail(this.state.data)} className="btn">Send my Results{coupons._id && settings.couponTradeshow && coupons.discountCodes.length > 0 && " + Discount code"}</a>
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