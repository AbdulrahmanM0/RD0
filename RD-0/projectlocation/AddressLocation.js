import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Input } from "reactstrap"

import axios from "axios"
import { useHistory } from "react-router-dom"
const AddressLocation = props => {
  const history = useHistory()

  const [currentlocation, setCurrentlocation] = useState({})
  const [projectAddress, setprojectAddress] = useState("")
  
  useEffect(() => {
    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      ProjectID: props.projectID,
    }
    axios
      .post("https://test.cpvarabia.com/api/ProjectLocationsView", formData)
      .then(res => {
        if (res.data.error === true && res.data.message === "Access denied!") {
          history.push("/logout")
        }

        let data = Object.entries(res.data)
        setprojectAddress(data[0][1].ProjectAddress)
        initMapScript().then(() => {
          initMap(data[0][1].ProjectAddress)
        })
      })
}, [])

  const apiKey = process.env.REACT_APP_GOOGlE_APIKEY
  const mapApiJs = "https://maps.googleapis.com/maps/api/js"

  //***************** start of center coordinates *******************
  let map
  let service
  let infowindow

  function initMap(projectAddress) {
        const sydney = new google.maps.LatLng(0, 0)
    infowindow = new google.maps.InfoWindow()
    map = new google.maps.Map(document.getElementById(props.divID), {
      center: sydney,
      zoom: 15,
    })

    const request = {
      query: projectAddress,
      fields: ["name", "geometry"],
    }
    
    service = new google.maps.places.PlacesService(map)
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i])
        }
        map.setCenter(results[0].geometry.location)
      }
    })
  }

  function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return
    
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    })
    var latitude = place.geometry.location.lat()
    var longitude = place.geometry.location.lng()
    setCurrentlocation({ lat: latitude, lng: longitude })
    google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent(place.name || "")
      infowindow.open(map)
    })
  }
  //************* end of InitAutocomplete *********************
  function loadAsyncScript(src) {
    return new Promise(resolve => {
      const script = document.createElement("script")
      Object.assign(script, {
        type: "text/javascript",
        async: true,
        src,
      })
      script.addEventListener("load", () => resolve(script))
      document.head.appendChild(script)
    })
  }

  const initMapScript = () => {
    // if script already loaded
    if (window.google) {
      return Promise.resolve()
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`
    return loadAsyncScript(src)
  }
  // load map script after mounted

  // **********************************
  return (
    <Col lg={6}>
      <Card>
        <CardBody>
          <h5 className="text-center ">{props.title}</h5>
          <div
            className="border rounded bg-light"
            style={{ height: "250px" }}
            id={props.divID}
          ></div>

          <div className="d-flex mt-2 justify-content-around flex-wrap">
            <Input
              type="text"
              className="text-center"
              value={`${projectAddress}`}
              readOnly
            />
            <div>
              <label forhtml={props.divID + "Accurate"}>
                <input
                  type="radio"
                  id={props.divID + "Accurate"}
                  className="me-1 mt-1"
                  name="Accuratelocation"
                  onChange={props.props.handleChange}
                  value={JSON.stringify(currentlocation)}
                  defaultChecked={props.getAccurateLocation && JSON.parse(props.getAccurateLocation) == currentlocation}
                />
                  Accurate loaction
              </label>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

export default AddressLocation
