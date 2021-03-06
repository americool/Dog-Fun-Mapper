import React, { PropTypes, Component } from 'react';



class Location extends Component {
  // static propTypes = {
  // // GoogleMap pass $hover props to hovered components
  // // to detect hover it uses internal mechanism, explained in x_distance_hover example
  // $hover: PropTypes.bool,
  // data: PropTypes.object.isRequired,
  // };
  static defaultProps = {};

  onHover() {
    if (this.props.$hover === true){
      return(
        <p className="Location-Title">
          {this.props.data.title}
        </p>
      )
    }
  }

  render() {
    return (
      <div>
        <img src={this.props.img} className="Icon" alt="NO-IMAGE" />
        {this.onHover()}
      </div>
    )
  }
}
export default Location;
