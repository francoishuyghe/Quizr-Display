class ProductDisplay extends React.Component {
  
    render() {
      const { product } = this.props
  
      return <div className="productBlock">
              <div className="productImage">
                <img src={product.image} />
              </div>
              <div className="productText">
                <h3>{product.title}</h3>
                <div className="description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                <a className="btn" href={product.url}>Shop Now</a>
              </div>
            </div>
    }
  }
  
  export default ProductDisplay;