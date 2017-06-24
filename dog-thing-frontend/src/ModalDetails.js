import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';



class ModalDetails extends Component {
  constructor(){
    super();
    this.state = {
      locationID: null,
      userName: localStorage.getItem('userName'),
      userID: localStorage.getItem('userID'),
      comments: [],
      newComment: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount(){
    const {id} = this.props.modalData.data;
    this.setState({locationID: id})
    this.getComments(id);
  }

  getComments(id){
    axios.get('http://localhost:4000/locations/' + id + '/show_comments').then((res) => {
      this.setState({comments: res.data.reverse()})
    })
  }

  handleChange(key) {
    return function (e) {
      let state = {};
      state[key] = e.target.value;
      this.setState(state);
    }.bind(this);
  }

  handleSubmit(event) {
    const { userName, userID, newComment, locationID } = this.state;
    axios.post('http://localhost:4000/comments', {
      comment: {
        body: newComment,
        location_id: locationID,
        user_id: userID,
        username: userName
      }
    }).then((res) => {
      this.setState({ newComment:"" });
      console.log(res);
      this.getComments(locationID);
    }).catch((error) => {
      alert('Comment Failed!');
      console.log(error);
    });
  }


  renderComments = () =>{
    const {comments} = this.state;
     return (
      comments.map((comment) => (
        <div>
          <span className="UserName">{comment.username}</span>
          <span>: {comment.body} </span>
          <br/><br/>
        </div>
      ))
    )
  }


  renderAddComment = () => {
    if (this.state.userName !== "null") {
      return (
        <form onSubmit={this.handleSubmit}>
          <label> Add a Comment:
          <textarea value={this.state.newComment} onChange={this.handleChange('newComment')}/>
          </label>
          <input type="submit" value="Submit" />
        </form>
      )
    }
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
          {this.renderAddComment()}
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
  verified: PropTypes.bool,
  modalData: PropTypes.object,

}
export default ModalDetails;
