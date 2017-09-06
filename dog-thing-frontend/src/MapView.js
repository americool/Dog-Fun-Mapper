import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Modal from 'react-modal';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import filter from 'lodash/filter';
import ModalStyle from './ModalStyle.css';
import ModalDetails from './ModalDetails';
import AddLocation from './AddLocation';
import Location from './Location';
import Login from './Login';
import './App.css';

const API_KEY = process.env.GOOGLE_MAP_KEY

const potentialFilters = ["Pet-Store", "Groomer", "Natural-Park", "Offleash Dog Area", "Dog-Friendly Business", "Dog-Friendly-Water"]

class MapView extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      modalIsOpen: false,
      tempProps: {},
      filters: [],
      toggles: [false,false,false,false,false,false],
      addNew: false,
      userName: null,
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.buttonFilter = this.buttonFilter.bind(this);
  }

  componentDidMount(){
    this.setState({userName: localStorage.getItem('userName')})
    this.getData();
  }
  getData(){
    axios.get('http://localhost:4000/locations').then((res) => {
      this.setState({data: res.data, isLoading: false})
    })
  }
  static defaultProps = {
    center: {lat: 40.447044, lng: -80.013936},
    zoom: 5
  };
  markLoggedOut() {
    this.setState({userName:false})
  }
  openModal() {
   this.setState({modalIsOpen: true})
 }

 afterOpenModal() {
   // references are now sync'd and can be accessed.
  //  this.subtitle.style.color = '#f00';
 }

 closeModal() {
  this.setState({modalIsOpen: false})
 }

 onChildClick = (key, childProps) => {
    this.setState({tempProps: childProps});
    this.openModal();
  }
  onMapClick = ({lat, lng, event}) => {
    event.preventDefault();
    if (this.state.addNew){
      console.log(lat, lng)
      this.setState({tempProps: {lat, lng}});
      this.openModal();
    }
  }
  locationAdded() {
    this.closeModal();
    this.setState({addNew: false});
    this.getData();
  }
  conditionalModalData = () => {
    if (this.state.addNew) {
      return <AddLocation modalData={this.state.tempProps} submitted={this.locationAdded.bind(this)} />
    }
    else {
      return <ModalDetails modalData={this.state.tempProps}/>
    }
  }
  filterData(filters) {
    const {data} = this.state;
    let newData = filter(data, function(location){
      if (!filters.includes(location.category)){
        return location.category
      }
    })
    return newData;
  }

  dataRender = () => {
    const {filters} = this.state
    const filteredData = this.filterData(filters);
    // console.log(data)
    // console.log(filteredData)
    return (
      filteredData.length > 0 && filteredData.map((location) => (
          <Location
           lat={location.lat}
           lng={location.lng}
           data={location}
           key={location.id}
          />
      ))
    )
  }
  renderAddButton = () => {
    if (!this.state.addNew) {
      if (this.state.userName){
        return(
          <Button className="addButton" onClick={() => this.setState({addNew:true})}> ADD NEW? </Button>
        )
      }
      else {
        return (
          <strong>LOG IN TO ADD YOUR OWN DOGGO LOCATIONS</strong>
        )
      }
    }
    else {
      return(
        <Button className="addButton" onClick={() => this.setState({addNew:false})}> CANCEL? </Button>
      )
    }
  }
  renderButtons = () => {
    if (!this.state.addNew){
      const {toggles} = this.state
      return (

        potentialFilters.map((filter, index) => (
          <Button key={index} className={toggles[index]? "clicked" : "unClicked"} bsSize="large" onClick={() =>  this.buttonFilter(filter, index)}> {filter} </Button>
        ))
      )
    }
    else {
      return (
        <p> Click on the map to Add your Doggo Location! </p>
      )
    }
  }
  buttonFilter(category, ref) {
    let {toggles} = this.state
    toggles.splice(ref,1,!toggles[ref])
    this.setState(toggles: toggles)
    let filters = this.state.filters
    if (filters.includes(category)){
      const index = filters.indexOf(category);
      filters.splice(index, 1);
      this.setState(filters: filters);
    }
    else{
      filters.push(category)
      this.setState(filters: filters);
    }
  }

  render() {
    return (
      <div className="App">
        <Modal
           isOpen={this.state.modalIsOpen}
           onAfterOpen={this.afterOpenModal}
           onRequestClose={this.closeModal}
           style={ModalStyle}
           contentLabel="Example Modal"
        >
          <Button className="close" bsSize="small" bsStyle="danger" onClick={() => this.closeModal()}> X </Button>
          {this.conditionalModalData()}
        </Modal>


        <Login logOut={this.markLoggedOut.bind(this)}/>

        <div className="Filter-Buttons">
          <h3> Filter Locations: </h3>
          <hr/>
          {this.renderButtons()}
          <hr/>
          {this.renderAddButton()}
        </div>

        <div id="map">
          <GoogleMapReact
          bootstrapURLKeys={{
            key: API_KEY
          }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onChildClick={this.onChildClick}
          onClick={this.onMapClick}
          >
          {this.dataRender()}
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}

export default MapView;
