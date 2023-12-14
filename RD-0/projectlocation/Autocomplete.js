import React, { useEffect, useState, originRef, useRef } from "react"
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap"

const Autocomplete = props => {
  const apiKey = process.env.REACT_APP_GOOGlE_APIKEY
  const mapApiJs = "https://maps.googleapis.com/maps/api/js"

  const [currentlocation, setCurrentlocation] = useState({})
  const [checked,setChecked]=useState()
  // const [searchResult, setsearchResult] = useState("")

  //***************** start of center coordinates *******************
  function InitAutocomplete() {
    const map = new google.maps.Map(document.getElementById(props.divID), {
      center: {
        lat: 24.711963,
        lng: 46.676081,
      },
      zoom: 10,
      mapTypeId: "roadmap",
    })
    // Create the search box and link it to the UI element.
    let input = document.getElementById(props.divID + "input")

    const searchBox = new google.maps.places.SearchBox(input)

    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(input)
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds())
    })

    let markers = []

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces()

      if (places.length == 0) {
        return
      }

      // Clear out the old markers.
      markers.forEach(marker => {
        marker.setMap(null)
      })
      markers = []

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds()

      places.forEach(place => {
        if (!place.geometry || !place.geometry.location) {
          return
        }

        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        }

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        )
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport)
        } else {
          bounds.extend(place.geometry.location)
        }

        let latitude = place.geometry.location.lat()
        let longitude = place.geometry.location.lng()
        let currentloca = { lat: latitude, lng: longitude }
        setCurrentlocation(currentloca)
        props.props.setFieldValue(props.divID, JSON.stringify(currentloca))
      })
      map.fitBounds(bounds)
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
  useEffect(() => {
    initMapScript().then(() => {
      InitAutocomplete()
    })
  }, [])

  useEffect(() => {
    checked &&
      props.props.setFieldValue(
        "Accuratelocation",
        props.props.values.InsertLoc
      )
  }, [props.props.values.InsertLoc])
  // **********************************
  useEffect(() => {
    checked &&
      props.props.setFieldValue(
        "Accuratelocation",
        props.props.values.InsertLoc
      )
  }, [props.props.values.InsertLoc])
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
          <div className="d-flex mt-2 justify-content-around">
            <input
              type="text"
              className="rounded d-flex col-7 mb-3"
              name={props.divID}
              id={props.divID + "input"}
              onChange={props.props.handleChange}
              disabled={props.read}
            />
            

            <div>
              <label forhtml={props.divID + "Accurate"}>
                <input
                  type="radio"
                  id={props.divID + "Accurate"}
                  className="me-1"
                  name="Accuratelocation"
                  onChange={props.props.handleChange}
                  value={JSON.stringify(currentlocation)}
                  onClick={e => {
                    setChecked(e.target.checked)
                  }}
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

export default Autocomplete
