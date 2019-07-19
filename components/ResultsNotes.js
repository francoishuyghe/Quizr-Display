import { saveNotes } from '../store'
import { connect } from 'react-redux'

class ResultsNotes extends React.Component {

    constructor( props ) {
        super( props );

        this.state = {
            notes: ''
        }

        this.updateState = this.updateState.bind(this)
    }

  
    render() {
        const { isSaving } = this.props
        const { notes } = this.state
  
      return <form>
        <textarea 
            type="text" 
            name="notes" 
            placeholder="Notes"
            onChange={this.updateState}
            value={notes}
        />
            {isSaving
                ? <a className="btn">Saving...</a>
                : <a onClick={() => this.props.saveNotes(this.state.notes)} className="btn">Save Notes</a>
            }
      </form>
    }

    updateState(e) { 
        const value = e.target.value
        this.setState({
            notes: value
        })
    }
  }
  
//Connect Redux
const mapStateToProps = (state) => {
    return {
        isSaving: state.isSaving
    }
  }
  const mapDispatchToProps = { saveNotes }

  const connectedResultsNotes = connect(mapStateToProps, mapDispatchToProps)(ResultsNotes)
  
  export default connectedResultsNotes;