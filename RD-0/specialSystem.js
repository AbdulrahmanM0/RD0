import React, { useEffect, useState } from "react"
import {
  Button,
  Form,
  FormGroup,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"
import { useHistory } from "react-router-dom"
import { Formik } from "formik"
import axios from "axios"
import { Link } from "react-router-dom"
import ProjectHeader from "./ProjectHeader"
import { convertPermission } from "permissionUtils"

const SpecialSystem = props => {
  const data = props.location.state?.data

  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  // **************** Permissions ******************************
  const userPermissions = convertPermission(
    JSON.parse(localStorage.getItem("roles"))
  )

  const history = useHistory()
  const id = localStorage.getItem("id")
  let projectID = props.match.params.id
  const [SpecialSystem, setSpecialSystem] = useState({})

  //
  const [dataBaseAnswers, setDataBaseAnswers] = useState([])

  useEffect(() => {
    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      ProjectID: projectID,
    }
    axios
      .post("https://test.cpvarabia.com/api/RD0AllQAnswersView", formData)
      .then(res => {
        if (res.data.error === true && res.data.message === "Access denied!") {
          setAuth(true)
          setTimeout(() => {
            history.push("/logout")
            setTimeout(() => {
              history.push("/login")
            }, 1000)
          }, 4000)
        }

        let array = Object.entries(res.data)

        array.splice(-1)
        let answers = array.filter(answer => {
          // console.log("array",answer[1].QID );
          return answer[1].QID == "238"
        })
        setDataBaseAnswers(answers)
      })

      .catch(err => console.log(err))
  }, [])

  let SPSAnswers = [
    { label: "Piles", id: "437" },
    { label: " Post Tension", id: "438" },
    { label: "Hollowcore Slab", id: "439" },
    { label: "Precast Concrete", id: "440" },
    { label: "Steel Structure", id: "441" },
    { label: "Innovative Material", id: "442" },
    { label: "Timber", id: "443" },
    { label: "More than one code table", id: "444" },
  ]

  let initialSPSvalues = {}

  SPSAnswers.forEach(answerObject => {
    dataBaseAnswers[0] &&
    dataBaseAnswers[0][1].OptionIDs.includes(answerObject.id) &&
    (initialSPSvalues[answerObject.label] = answerObject.id)
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <ProjectHeader projectID={data.ProjectID} />

        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initialSPSvalues,
          }}
          onSubmit={(values, actions) => {
            // actions.setSubmitting(true)
            console.log("values", Object.values(values).flat())

            let data = {
              SpecialSystem: Object.values(values).flat(),
              ProjectID: props.match.params.id,
              UserID: id,
            }
            setSpecialSystem(data)

            if (values.SPS && values.SPS.includes("444")) {
              toggle()
            } else {
              let path = `/RDZeroRequirements/ProjectID=${projectID}`
              history.push(path, { SpecialSystem: data, project: data })
            }
          }}
          validate={values => {
            console.log("values", values)
          }}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
              <div className="ms-2">
                <h5 className=" me-5 mt-4  ">
                  Is there any special system in the data?
                </h5>
                <h6 className="text-warning mb-4">
                  *You can choose more than one choice
                </h6>
              </div>
              <div className="ms-5">
                {SPSAnswers.map((item, key) => (
                  <FormGroup key={key}>
                    <label forhtml={"SPS"}>
                      <input
                        className="me-1"
                        onClick={e => {
                          e.target.checked
                            ? props.setFieldValue(item.label, e.target.value)
                            : props.setFieldValue(item.label, "")
                        }}
                        onChange={props.handleChange}
                        defaultChecked={
                          dataBaseAnswers[0] &&
                          dataBaseAnswers[0][1].OptionIDs.includes(item.id)
                        }
                        type="checkbox"
                        id={"SPS"}
                        name={item.label}
                        value={item.id}
                      />
                      {item.label}
                    </label>
                  </FormGroup>
                ))}
              </div>
              <FormGroup>
                {props.errors.SPS ? (
                  <div className="error  d-flex ms-auto col-3  justify-content-around">
                    {props.errors.SPS}
                  </div>
                ) : null}
              </FormGroup>
              <FormGroup className="d-flex ms-auto col-3 mt-5 justify-content-around">
                <Button
                  type="submit"
                  className="bg-primary"
                  disabled={
                    userPermissions.R3.P !== "2" &&
                    userPermissions.R3.P !== "3" &&
                    userPermissions.R3.P !== "4"
                  }
                >
                  Submit
                </Button>
              </FormGroup>
            </Form>
          )}
        </Formik>

        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader className="text-danger">
            {" "}
            <i className="bx bx-confused"></i>More than one building
          </ModalHeader>
          <ModalBody>
            <div>
              {/* <label htmlFor="sectionName">missing Data !!!</label> */}
              {
                <div className="mt-4">
                  <p>
                    <b>Unfortunately,</b>You can’t complete the RD0 report right
                    now you can do it Manualy
                    <b>
                      <i className="bx bx-confused"></i>
                    </b>
                  </p>
                </div>
              }
            </div>
          </ModalBody>
          <FormGroup className="d-flex ms-auto col-3  justify-content-around me-3">
            <Button
              onClick={() => {
                toggle()
              }}
              className="bg-secondary me-2"
            >
              Cancel
            </Button>
          </FormGroup>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default SpecialSystem
