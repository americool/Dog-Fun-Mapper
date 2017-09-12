import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


class AddLocation extends Component {
  constructor() {
    super();
    this.state = {
      name:'',
      category:null,
      address:''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({address:this.props.modalData.address});
  }
  handleChange(key) {
    return function (e) {
      let state = {};
      state[key] = e.target.value;
      this.setState(state);
    }.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault()
    if (!this.state.category || this.state.name===''){
      alert("Please Pick a Category and Name!")
    }
    else {
      console.log(this.state);
      console.log("SUBMITTED");
      axios.post('http://localhost:4000/locations/', {
        location: {
          title: this.state.name,
          category: this.state.category,
          address: this.state.address,
          lat: this.props.modalData.lat,
          lng: this.props.modalData.lng,
          verified: false,
          user_id: parseInt(localStorage.getItem('userID'), 10)
        }
      }).then((res) => {
        alert("Added!");
        console.log(res)
        this.props.submitted();
      }).catch((error) => {
        console.log(error)
        alert(error)
      })
    }
  }

  setCategory(event) {
    this.setState({category: event.target.value})
  }
  render(){
    return (
      <div>
        <h3> NEW DOGGO LOCATION </h3>
        <form onSubmit={this.handleSubmit}>
          <label> Name:
          <input type="text" value={this.state.name} onChange={this.handleChange('name')} />
          </label><br/>
          <div onChange={this.setCategory.bind(this)}>
            Category: <br/>
            <input type="radio" name="category" value="Offleash Dog Area" /> Offleash Dog Area <br/>
            <input type="radio" name="category" value="Natural-Park" /> Natural-Park <br/>
            <input type="radio" name="category" value="Pet-Store" /> Pet-Store <br/>
            <input type="radio" name="category" value="Groomer" /> Groomer <br/>
            <input type="radio" name="category" value="Dog-Friendly Business" /> Dog-Friendly Business <br/>
            <input type="radio" name="category" value="Dog-Friendly Water" /> Dog-Friendly Water <br/>
          </div>
          <label> Address:
          <input type="text" value={this.state.address} onChange={this.handleChange('address')} />
          </label><br/>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}
export default AddLocation;
