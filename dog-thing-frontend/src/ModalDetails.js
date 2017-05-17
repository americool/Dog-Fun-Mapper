import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class ModalDetails extends Component {
  constructor(){
    super();
    this.state = {
      comments: [],
      users: {},
    }
  }
  componentDidMount(){
    const {id} = this.props.modalData.data;

    axios.get('http://localhost:4000/locations/' + id).then((res) => {
      console.log(res.data)
      this.setState({comments: res.data.comments, users: res.data.users})
    })
  }
  renderComments = () =>{
    const {comments, users} = this.state;
    return (
      comments.map((comment, index) => (
        <div>
          <span className="UserName">{users[comment.user_id]}</span>
          <span>: {comment.body} </span>
          <br/><br/>
        </div>
      ))
    )
  }
  render () {

    // console.log(this.props.modalData)
    const {title, category, address, verified} = this.props.modalData.data
    return (
      <div>
        <div className="details">
          <p className="Title"> {title} </p><br/>
          <p className="Category"> {category} </p><br/>
          <p className="Address"> {address} </p><br/>
          <p className="Verified"> Verified: {verified.toString()} </p><br/>
          <h3>Comments:</h3>
        </div>
        <div className="Scrollable">
          {this.renderComments()}
        </div>
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
