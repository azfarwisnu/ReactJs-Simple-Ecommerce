import React from "react";
import "../assets/styles/product_card.css";
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import Axios from "axios"
import { API_URL } from "../constants/API" 
import { getCartData } from "../redux/actions/cart"

class ProductCard extends React.Component {

addToCartHandler = () => {
    // Check apakah user sudah memiliki barang tsb di cart
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.userGlobal.id,
        productId: this.props.productData.id,
      }
    })
    .then((result) => {
      if (result.data.length) { // Barangnya sudah ada di cart user
        Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
          quantity: result.data[0].quantity + 1
        })
        .then(() => {
          alert("Berhasil menambahkan barang")
          this.props.getCartData(this.props.userGlobal.id)
        })
        .catch(() => {
          alert("Terjadi kesalahan di server")
        })

      } else { // Barangnya belum ada di cart user
        Axios.post(`${API_URL}/carts`, {
          userId: this.props.userGlobal.id,
          productId: this.props.productData.id,
          price: this.props.productData.price,
          productName: this.props.productData.productName,
          productImage: this.props.productData.productImage,
          quantity: 1,
        })
        .then(() => {
          alert("Berhasil menambahkan barang")
          this.props.getCartData(this.props.userGlobal.id)
        })
        .catch(() => {
          alert("Terjadi kesalahan di server")
        })
      }
    })
  }



  render() {
    return (
      <div className="card product-card">
        <img
          src={this.props.productData.productImage}
          alt=""
        />
        <div className="mt-2">
          <div>
            <Link to={`/product-detail/${this.props.productData.id}`} style={{ textDecoration: "none", color: "inherit"}}>
              <h6>{this.props.productData.productName}</h6>
            </Link>
            <span className="text-muted">Rp. {this.props.productData.price}</span>
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button className="btn btn-primary mt-4 " onClick={this.addToCartHandler}>Add to cart</button>
            <div className="jarak">
              <Link to={`/product-detail/${this.props.productData.id}`} style={{ textDecoration: "none"}}>
                <button className="btn btn-success mt-4">View Product</button>
             </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mappropsToProps = props => {
  return{
    userGlobal: props.user,
  }
}

const mapDisPatchToProps = {
  getCartData,
}

export default connect(mappropsToProps, mapDisPatchToProps)(ProductCard);