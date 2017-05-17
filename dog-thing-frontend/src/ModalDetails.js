import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class ModalDetails extends Component {
  constructor(){
    super();
    this.state = {
      comments: [],
    }
  }
  componentDidMount(){
    const {id} = this.props.modalData.data;

    axios.get('http://localhost:4000/locations/' + id).then((res) => {
      console.log(res.data)
      this.setState({comments: res.data})
    })
  }
  renderComments = () =>{
    const {comments} = this.state;
    return (
      comments.map((comment, index) => (
        <p> {index+1}): {comment.body} </p>
      ))
    )
  }
  render () {

    // console.log(this.props.modalData)
    const {title, lat, lng, category, address, verified} = this.props.modalData.data
    return (
      <div>
        <p className = "Title"> {title} </p><br/>
        <p className = "Category"> {category} </p><br/>
        <p className = "Address"> {address} </p><br/>
        <p className = "Verified"> Verified: {verified.toString()} </p><br/>
        <h3>Comments:</h3>
        {this.renderComments()}
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
