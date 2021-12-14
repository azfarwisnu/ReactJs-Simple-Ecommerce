import React from 'react'
import { connect } from "react-redux"
import { API_URL } from "../constants/API"
import Axios from "axios"
import { getCartData } from "../redux/actions/cart"

class Cart extends React.Component {

  state = {
    isCheckOutMode: false,
    receiptName: "",
    receiptAddress: "",
    payment: 0,

  }

deleteCartHandler = (cartId) => {
  Axios.delete(`${API_URL}/carts/${cartId}`)
  .then(() => {
    alert("Data berhasil dihapus")
    this.props.getCartData(this.props.userGlobal.id)
  })
  .catch(() => {
    alert("terjadi kesalahan pada server")
  })
}

renderSubTotal = () => {
  let subTotal = 0;
  let batas = this.props.cartGlobal.cartList.length;
  for(let i = 0; i < batas; i++){
    subTotal += this.props.cartGlobal.cartList[i].price * this.props.cartGlobal.cartList[i].quantity;
  }

  return subTotal;
}

renderTax = () => {
  return parseFloat(this.renderSubTotal() * 0.05);
}

renderTotalFee = () => {
  return this.renderTax() + this.renderSubTotal();
}

checkOutModeToogle = () => {
  this.setState({isCheckOutMode: !this.state.isCheckOutMode})
}

inputHandler = (event) => {
  const { name, value}  = event.target

  this.setState({ [name] : value })
}

payBtnHandler = () => {

  if(this.state.payment < this.renderTotalFee()){
    alert(`Uang anda kurang ${this.renderTotalFee() - this.state.payment}`)
    return;
  }


  if(this.state.payment > this.renderTotalFee()){
     alert(`Pembayaran berhasil kembalian anda ${this.state.payment-this.renderTotalFee()}`)
  }else if(this.state.payment === this.renderTotalFee()){
      alert('uang anda pass pembayaran berhasil')
  }


  const d = new Date()

  Axios.post(`${API_URL}/transactions`,{
    userId: this.props.userGlobal.id,
    address: this.state.receiptAddress,
    receiptName: this.state.receiptName,
    totalPrice: parseInt(this.renderTotalFee()),
    totalPayment: parseInt(this.state.payment),
    transactionDate: `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`,
    transactionItems: this.props.cartGlobal.cartList,
  }).then((result) => {
    alert("Pembayaran berhasil")
    result.data.transactionItems.forEach((val) => {
      this.deleteCartHandler(val.id)
    })
  })
  .catch(() => {
    alert("Terjadi kesalahan pada server")
  })
}

renderCart = () => {
  console.log(this.state.receiptName, this.state.receiptAddress, this.state.payment);
  this.renderSubTotal()
  return this.props.cartGlobal.cartList.map((val) => {
    return(
        <tr>
          <td clasName="align-midle">{val.productName}</td>
          <td clasName="align-midle">{val.price}</td>
          <td clasName="align-midle"><img src={val.productImage} style={{width: "100px"}} alt={val.productName}/></td>
          <td clasName="align-midle">{val.quantity}</td>
          <td clasName="align-midle">{val.quantity * val.price}</td>
          <td clasName="align-midle">
            <button className="btn btn-danger" onClick={() => this.deleteCartHandler(val.id)}>Delete</button>
          </td>
        </tr>
      )
  })
}

  render() {
    return (
      <div className="p-5">
        <h1 className="text-center font-weight-bold mb-5">Cart</h1>
        <div className="row">
          <div className="col-9 text-center">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <td clasName="align-midle">Name</td>
                  <td clasName="align-midle">Price</td>
                  <td clasName="align-midle">Image</td>
                  <td clasName="align-midle">Quantity</td>
                  <td clasName="align-midle">Total Price</td>
                  <td clasName="align-midle">Action</td>
                </tr>
              </thead>
              <tbody>
                {this.renderCart()}
              </tbody>
              <tfoot className="bg-light">
                <tr>
                  <td colSpan="6">
                    <button className="btn btn-success"  onClick={this.checkOutModeToogle}>
                      Checkout
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          { 

              this.state.isCheckOutMode ?

              <div className="col-3"> 
            <div className="card">
              <div className="card-header">
                <strong>Order Summary</strong>
              </div>
              <div className="card-body">
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <span className="font-weight-bold">Subtotal Price</span>
                  <span>Rp {this.renderSubTotal()}</span>
                </div>

                <div className="d-flex flex-row justify-content-between align-items-center">
                  <span className="font-weight-bold">Tax Price (5%)</span>
                  <span>Rp {this.renderTax()}</span>
                </div>

                <hr></hr>

                <div className="d-flex flex-row justify-content-between align-items-center">
                  <span className="font-weight-bold">Total Price</span>
                  <span>Rp {this.renderTotalFee()}</span>
                </div>
              </div>

              <div className="card-body border-top">
                <label htmlFor="receiptName">Receipt Name</label>
                <input onChange={this.inputHandler} type="text" className="form-control mb-3" name="receiptName"></input>

                <label htmlFor="address">Address</label>
                <input onChange={this.inputHandler} type="text" className="form-control" name="receiptAddress"></input>
              </div>

              <div className="card-footer">
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <input className="form-control mx-1" type="number" name="payment" onChange={this.inputHandler}></input>
                    <button  onClick={this.payBtnHandler} className="btn btn-success mx2">Pay</button>                  
                </div>
              </div>

            </div>
          </div>
            : null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
      cartGlobal: state.cart,
      userGlobal: state.user,
    }
}

const mapDisPatchToProps = {
  getCartData,
}

export default connect(mapStateToProps,mapDisPatchToProps)(Cart);