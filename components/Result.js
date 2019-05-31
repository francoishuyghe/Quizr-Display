import ProductDisplay from './productDisplay'

class Result extends React.Component {

  render() {
    const { result } = this.props

    return (
       <div className="result" >
        {result.product && <ProductDisplay product={result.product} description={result.paragraph}/>}
       </div>
    )
    };
}

export default Result;