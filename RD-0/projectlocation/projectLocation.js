import React, { useEffect, useState } from "react"
import { Formik } from "formik"
import MapComponent from "./mapComponent"
import Autocomplete from "./Autocomplete"
import { Button, Form, FormGroup, Modal, Spinner } from "reactstrap"
import { useHistory } from "react-router-dom"
import axios from "axios"
import AddressLocation from "./AddressLocation"
import { getAddress } from "./GetAddress"
import AccurateLocation from "./AccurateLocation"

const ProjectLocation = props => {
  const [getAccurateLocation , setAccurateLocation] = useState()
    // -----------------
  // getAddress()
  // -----------------
  let SpecialSystem, project
  if (props.location.state) {
    localStorage.setItem(
      "SpecialSystem",
      JSON.stringify(props.location.state.SpecialSystem)
    )
    localStorage.setItem(
      "project",
      JSON.stringify(props.location.state.project)
    )
    SpecialSystem = props.location.state.SpecialSystem
    project = props.location.state.project
  } else {
    SpecialSystem = localStorage.getItem("SpecialSystem")
    if (SpecialSystem) SpecialSystem = JSON.parse(SpecialSystem)
    project = localStorage.getItem("project")
    if (project) project = JSON.parse(project)
  }
  //----------
  let projectID = props.match.params.id
  // let projectID = props.props.match.params.id
  const [response, setResponse] = useState(true)
  let history = useHistory()
  const [changLatLong, setChangeLatLong] = useState(false)

  const [error, setError] = useState({})
  const [projectCo, setProjectCo] = useState({})
  const [sensorCo, setSensorCo] = useState({})

  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={{
          Accuratelocation: getAccurateLocation ? getAccurateLocation : ''
        }}
        validate={values => {
          let errors = {}
          let lng = JSON.parse(values.Accuratelocation).lng
          let lat = JSON.parse(values.Accuratelocation).lat
          if( JSON.parse(values.Accuratelocation).lng === null || JSON.parse(values.Accuratelocation).lat === null){
            errors.Accuratelocation = "invalid Accurate Location"
            console.log(errors)
          }
          if (!values.Accuratelocation) {
            errors.Accuratelocation = "Accurate Location is required"
          }
          if (values.Accuratelocation == "{}") {
            errors.Accuratelocation = "invalid Accurate Location"
          }
          if ( lat < 16.5 || lat > 32.3||lng < 34  || lng > 55.6) {
            errors.Accuratelocation = "Location Out Of Zone"
          }
          setError(errors)
          return errors
        }}
        onSubmit={(values, actions) => {
          setResponse(false)

          actions.setSubmitting(false)
          if (Object.keys(error).length === 0) {
            let locationdata = {
              ...values,
              ProjectID: projectID,
              PStageID: localStorage.getItem("PStageID"),
            }
            const formData = {
              PerToken: localStorage.getItem("token"),
              PerUserID: localStorage.getItem("id"),
              PerRoleID: localStorage.getItem("userRoleID"),
              ...locationdata,
            }
            axios
              .post(
                "https://test.cpvarabia.com/api/AddProjectLocation",
                formData
              )
              .then(res => {
                if (
                  res.data.error === true &&
                  res.data.message === "Access denied!"
                ) {
                  history.push("/logout")
                }

                setResponse(res)
                let path = `/RD-0/ProjectID=${props.match.params.id}`
                history.push(path, { SpecialSystem, project })
              })
              .catch(err => {
                console.log(err)
              })
          }
        }}
      >
        {props => (
          <Form onSubmit={props.handleSubmit}>
            <div className="page-content">
              <h5>Location</h5>
              <div className="d-flex row">
                <MapComponent
                  getAccurateLocation = {getAccurateLocation}
                  setAccurateLocation={setAccurateLocation}
                  title={"IDI Coordinates"}
                  divID={"IDICo"}
                  props={props}
                  read={true}
                  className="d-flex col-6"
                  projectID={projectID}
                  savedCo={projectCo}
                  changLatLong={changLatLong}
                  setChangeLatLong={setChangeLatLong}
                  switch={true}
                ></MapComponent>
                <AddressLocation
                  getAccurateLocation = {getAccurateLocation}
                  title={"IDI Address"}
                  divID={"IDIAd"}
                  props={props}
                  read={true}
                  projectID={projectID}
                  className="d-flex col-6"
                  savedCo={sensorCo}
                ></AddressLocation>
              </div>
              <div className="d-flex row">
              {changLatLong && (
                  <MapComponent
                    title={"Switched IDI Coordinates"}
                    divID={"IDICoSW"}
                    props={props}
                    read={true}
                    className="d-flex col-6"
                    projectID={projectID}
                    switch={false}
                  ></MapComponent>
              )}
                <Autocomplete
                  title={"Inserted Location"}
                  divID={"InsertLoc"}
                  props={props}
                  read={false}
                ></Autocomplete>
              {getAccurateLocation &&
                <AccurateLocation
                  title={"Accurate Location"}
                  divID={"IDICoA"}
                  props={props}
                  read={true}
                  className="d-flex col-6"
                  projectID={projectID}
                  savedCo={projectCo}
                  switch={true}
                ></AccurateLocation> 
              }
              </div>
              {/* <div className="d-flex row">
                <Autocomplete
                title={"Soil Report Boreholes"}
                divID={"SoilBor"}
                props={props}
                read={false}
                  className="me-3"
                ></Autocomplete>
                <Autocomplete
                  title={"Soil Report Address"}
                  divID={"SoilAd"}
                  props={props}
                  read={false}
                ></Autocomplete>
              </div> */}
            </div>

            <FormGroup>
              {props.errors.Accuratelocation ? (
                <div className="error  d-flex ms-auto col-3  justify-content-around">
                  {props.errors.Accuratelocation}
                </div>
              ) : null}
            </FormGroup>
            <FormGroup
              className="d-flex ms-auto col-3 mb-5 justify-content-around"
              style={{ marginBottom: "500px" }}
            >
              <Button type="submit" className="bg-primary mb-5">
                Submit
              </Button>
            </FormGroup>
          </Form>
        )}
      </Formik>
      {!response && (
        <Modal isOpen={open} className="bg-transparent">
          <div className="d-flex my-2 mx-2 ms-3 ">
            {" "}
            <h5 className="">Loading</h5>
            <div className="mt-1">
              <Spinner
                type="grow"
                className="ms-2 "
                size="sm"
                color="secondary"
              />
              <Spinner
                type="grow"
                className="ms-2"
                size="sm"
                color="secondary"
              />
              <Spinner
                type="grow"
                className="ms-2 "
                size="sm"
                color="secondary"
              />
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  )
}

export default ProjectLocation