import React, {Component} from 'react';
import {HashRouter, Link} from 'react-router-dom';
import './App.css';


class NavLink extends Component {
  render(){
    return (
      <HashRouter>
        <Link to={this.props.name}> <p className={this.props.className}>{this.props.text}</p> </Link>
      </HashRouter>
    )
  }
}

export default NavLink;
