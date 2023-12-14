import React, { useEffect, useState } from "react"
import { Col, Card, CardBody, Input, Button } from "reactstrap"

import axios from "axios"
import { useHistory } from "react-router-dom"
const AccurateLocation = props => {
  const history = useHistory()
  const [currentlocation, setCurrentlocation] = useState({})

  let ProjectLocation
  let lat = 24
  let lng = 26
  // const [center, setCenter] = useState({})
  let center
  let switchedCenter

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
        ProjectLocation = data[0][1].ProjectLocation.split(",")

        // if (props.switch) {
        lat =
          (props.divID == "IDICo" && Number(ProjectLocation[0])) ||
          ("IDICoSW" && Number(ProjectLocation[0]))
        lng =
          (props.divID == "IDICo" && Number(ProjectLocation[1])) ||
          ("IDICoSW" && Number(ProjectLocation[1]))
        // } else {
        //   lat = props.divID == "IDICo" && Number(ProjectLocation[1])
        //   lng = props.divID == "IDICo" && Number(ProjectLocation[0])
        // }

        // setCenter({ lat: lat, lng: lng })
        center = { lat: lat, lng: lng }
        switchedCenter = { lat: lng, lng: lat }

        initMapScript().then(() => {
          props.switch == false ? initMap(switchedCenter) : initMap(center)
        })
      })
  }, [])

  const apiKey = process.env.REACT_APP_GOOGlE_APIKEY
  const mapApiJs = "https://maps.googleapis.com/maps/api/js"

  //***************** start of center coordinates *******************
  function initMap(center) {
    props.switch == false
      ? setCurrentlocation(switchedCenter)
      : setCurrentlocation(center)

    // The map, centered at idicoord
    const map = new google.maps.Map(document.getElementById(props.divID), {
      zoom: 15,
      center: center,
    })
    // The marker, positioned at idicoord
    const marker =
      props.switch == false
        ? new google.maps.Marker({
            position: {
              lat: lng,
              lng: lat,
            },
            map: map,
          })
        : new google.maps.Marker({
            position: {
              lat: lat,
              lng: lng,
            },
            map: map,
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
      <Card className="border border-2 border-info">
        <CardBody>
          <h5 className="text-center ">{props.title}</h5>
          <div
            className="border rounded bg-light"
            style={{ height: "250px" }}
            id={props.divID}
          ></div>

          <div className="d-flex mt-2 justify-content-around flex-wrap col-12">
            <div className="col-10">
              <Input
                type="text"
                className="text-center"
                value={`latitude : ${currentlocation.lat} & longitude : ${currentlocation.lng}`}
                readOnly
              />
            </div>
            <div>
              <label forhtml={props.divID + "Accurate"}>
                <input
                  type="radio"
                  id={props.divID + "Accurate"}
                  className="me-1 mt-1"
                  name="Accuratelocation"
                  onChange={props.props.handleChange}
                  value={JSON.stringify(currentlocation)}
                  defaultChecked={true}
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

export default AccurateLocation
