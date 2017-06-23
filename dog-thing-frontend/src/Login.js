import React, {Component} from 'react';
import NavLink from './Navlink';
import './App.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      jwt: localStorage.getItem('jwt'),
      userName: localStorage.getItem('userName'),
    }
    this.logOut = this.logOut.bind(this);

  }

  logOut(){
    this.setState({jwt: null, userName: "null"});
    localStorage.setItem('jwt', null);
    localStorage.setItem('userName', null);
    localStorage.setItem('userID', null);
  }

  render(){
    const userNotLoggedIn = (
      <div>
        <NavLink className={"Signup-Link"} name={"/signup"} text={"Sign Up"} />
        <NavLink className={"Signin-Link"} name={"/signin"} text={"Sign In"} />
      </div>
      )

    const userLoggedIn = (
      <div>
        <p className={"Signup-Link"}> {this.state.userName} </p>
        <button className={"Signin-Link"} onClick={this.logOut} > Sign Out </button>
      </div>
    )

    return(
      <div>
        { this.state.userName !== "null" ? userLoggedIn : userNotLoggedIn }
      </div>
    )
  }

}

export default Login;
