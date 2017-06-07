import React, {Component} from 'react';
import NavLink from './Navlink';
import './App.css';

class Header extends Component {
  render(){
    return (
        <div className="App-header">
            <NavLink className={"Signin-Link"} name={"/signup"} text={"Sign Up"} />
            <NavLink className={"Signup-Link"} name={"/signin"} text={"Sign In"} />
          <h2>THE DOGGO CARTOGRAPHER!</h2>
        </div>
    )
  }

}

export default Header;
