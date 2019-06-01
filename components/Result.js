import ProductDisplay from './productDisplay'

class Result extends React.Component {

  render() {
    const { result } = this.props

    return (
       <div className="result" >
        {result.product && <ProductDisplay index={this.props.index} product={result.product} description={result.paragraph}/>}
       </div>
    )
    };
}

export default Result;