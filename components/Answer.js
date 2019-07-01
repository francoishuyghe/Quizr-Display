class Answer extends React.Component {

  render() {
    const { answer, ordered } = this.props

    return (
       <div className={this.props.selected ? "answer selected" : "answer"} 
        onClick={() => this.props.clicked(answer)}>
        {answer.text}
        { ordered >= 0 && <div className="order">{ordered + 1}</div>}
       </div>
    )
    };
}

export default Answer;