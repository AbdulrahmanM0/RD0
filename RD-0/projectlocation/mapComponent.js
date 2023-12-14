import React, { useEffect, useState } from "react"
import { Col, Card, CardBody, Input, Button } from "reactstrap"

import axios from "axios"
import { useHistory } from "react-router-dom"
import AccurateLocation from "./AccurateLocation";
const MapComponent = props => {
  const history = useHistory()
  const [currentlocation, setCurrentlocation] = useState({});

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
        center = { lat, lng, }
        switchedCenter = { lat: lng, lng: lat }

        initMapScript().then(() => {
          props.switch == false ? initMap(switchedCenter) : initMap(center)
        })
        data[0][1].ProjectLocation && props.setAccurateLocation(JSON.stringify({lat:Number(data[0][1].AccurateLocation.split(",")[0]),lng:Number(data[0][1].AccurateLocation.split(",")[1])}))
      })
  }, [])

  const apiKey = process.env.REACT_APP_GOOGLE_APIKEY;
  const mapApiJs = "https://maps.googleapis.com/maps/api/js";

  function initMap(center) {
    props.switch === false
      ? setCurrentlocation(switchedCenter)
      : setCurrentlocation(center);

    const map = new window.google.maps.Map(
      document.getElementById(props.divID),
      {
        zoom: 15,
        center: center,
      }
    );

    const marker =
      props.switch === false
        ? new window.google.maps.Marker({
            position: {
              lat: lng,
              lng: lat,
            },
            map: map,
          })
        : new window.google.maps.Marker({
            position: {
              lat: lat,
              lng: lng,
            },
            map: map,
          });
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

          <div className="d-flex mt-2 justify-content-around flex-wrap col-12">
            <div className="col-10">
              <Input
                type="text"
                className="text-center"
                value={`latitude : ${currentlocation.lat} & longitude : ${currentlocation.lng}`}
                readOnly
              />
            </div>
            {props.switch && (
              <Button
                onClick={() => {
                  props.setChangeLatLong(true)
                }}
                className="col-1"
                style={{ padding: "0px" }}
              >
                switch
              </Button>
            )}
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
                Accurate location
              </label>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MapComponent;