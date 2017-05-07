import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ModalDetails extends Component {

  render () {
    console.log(this.props.modalData)
    const {title, lat, lng, category, address, verified} = this.props.modalData.data
    return (
      <div>
        <p className = "Title"> {title} </p><br/>
        <p className = "Category"> {category} </p><br/>
        <p className = "Address"> {address} </p><br/>
        <p className = "Verified"> Verified: {verified.toString()} </p><br/>
      </div>
    )
  }
}
ModalDetails.propTypes = {
  text: PropTypes.string,
  category: PropTypes.string,
  address: PropTypes.string,
  verified: PropTypes.bool

}
export default ModalDetails;
