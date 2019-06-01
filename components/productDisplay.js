class ProductDisplay extends React.Component {
  
    render() {
      const { product } = this.props

      const imageURL = this.props.index == 1
        ? product.secondaryImage
        : product.image
  
      return <div className="productBlock">
              <div className="productImage">
                <img src={imageURL} />
              </div>
              <div className="productText">
                <h3>{product.title}</h3>
          <div className="description">{ this.props.description }</div>
                <a className="btn" href={product.url}>Shop Now</a>
              </div>
            </div>
    }
  }
  
  export default ProductDisplay;