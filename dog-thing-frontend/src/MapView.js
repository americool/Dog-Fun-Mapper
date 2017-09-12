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
import paw from './paw.png';
import question from './qmark.png';
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
      center: {lat: 40.447044, lng: -80.013936},
      zoom: 0,
      searchLocation:'',
      tempPin: false,
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.buttonFilter = this.buttonFilter.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.addByAddress = this.addByAddress.bind(this);
  }
  // static propTypes = {
  //   onCenterChange: PropTypes.func,
  //   onZoomChange: PropTypes.func,
  // }
  componentDidMount(){
    this.setState({userName: localStorage.getItem('userName')})
    this.getData();
  }

  // static defaultProps = {
  //   center: {lat: 40.447044, lng: -80.013936},
  //   zoom: 5,
  // };

  handleChange(key) {
    return function (e) {
      let state = {};
      state[key] = e.target.value;
      this.setState(state);
    }.bind(this);
  }

  getData(){
    axios.get('http://localhost:4000/locations').then((res) => {
      this.setState({data: res.data, tempPin: false})
    })
  }

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
   if(!this.state.addNew){
     this.setState({tempProps: childProps});
     this.openModal();
    }
  }
  onMapClick = ({lat, lng, event}) => {
    event.preventDefault();
    if (this.state.addNew){
      axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' +lat+','+lng+'&key='+API_KEY).then((res) => {
        const address = res.data.results[0].formatted_address;
        console.log(address)
        console.log(lat, lng)
        this.setState({tempProps: {lat, lng, address}});
        this.openModal();
      }).catch((error) => {
        console.log(error);
      })
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
           img={paw}
          />
      ))
    )
  }

  centerMap(event) {
    event.preventDefault();
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.searchLocation+'&key='+API_KEY).then((res) => {
      const center = res.data.results[0].geometry.location
      console.log(center)
      this.setState({center, zoom:17})
      if(this.state.addNew){
        this.addByAddress();
      }
    }).catch((err) => {
      console.log(err)
      alert("Couldn't Find it");
    })
  }

  tempPin = () => {
    if (this.state.tempPin){
      return(
        <Location lat={this.state.center.lat} lng={this.state.center.lng} key={"temp"} img={question}/>
      )
    }
  }
  addByAddress(event) {

    //Drops temporary Pin? Currently won't rerender map
    this.setState({tempPin:true});
    const confirming = () => {
      if(confirm("Is this the right spot?")){
        this.setState({tempProps: {lat: this.state.center.lat, lng: this.state.center.lng, address: this.state.searchLocation}})
        this.openModal();
      }
    }
    setTimeout(confirming, 500)
  }
  searchForm() {
      return(
        <div>
          <form onSubmit={this.centerMap}>
            <input type="text" value={this.state.searchLocation} onChange={this.handleChange('searchLocation')} />
            <input type="submit" value="Submit" />
          </form>
        </div>
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
        <Button className="addButton" onClick={() => this.setState({addNew:false, tempPin:false})}> CANCEL? </Button>
      )
    }
  }
  renderButtons = () => {
      const {toggles} = this.state
      return (
        <div>
          <h3> Filter Locations: </h3>
          {potentialFilters.map((filter, index) => (
            <Button key={index} className={toggles[index]? "clicked" : "unClicked"} bsSize="large" onClick={() =>  this.buttonFilter(filter, index)}> {filter} </Button>
          ))}
        </div>
      )
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

        <div className="notTheMap">
          <Login logOut={this.markLoggedOut.bind(this)}/>

          <div className="Filter-Buttons">
            <hr/>
            {this.state.addNew ? "Click on the map to Add your Doggo Location!" : this.renderButtons()}
            <hr/>
            {this.state.addNew ? "Or Search a Location" : "Center Map on Address"}
            {this.searchForm()}
            {this.renderAddButton()}
          </div>
        </div>

        <div id="map">
          <GoogleMapReact
          bootstrapURLKeys={{
            key: API_KEY
          }}
          center={this.state.center}
          defaultZoom={5}
          zoom={this.state.zoom}
          onChildClick={this.onChildClick}
          onClick={this.onMapClick}
          onChange={this.onChange}
          >
          {this.dataRender()}
          {this.tempPin()}
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}

export default MapView;
