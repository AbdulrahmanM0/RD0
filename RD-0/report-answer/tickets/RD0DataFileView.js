import axios from "axios"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap"

const RD6DataFileView = ({
  dataFileToggle,
  ticketControlled,
  selectedFile,
  editing,
  setEditing,
  setAuth,
}) => {
  // console.log("ticketControlled========>", ticketControlled)
  // console.log("selectedFile========>", selectedFile)

  const history = useHistory()

  const [modal, setModal] = useState(true)
  const toggle = () => {
    dataFileToggle()
  }

  const onClose = () => {
    dataFileToggle()
  }

  const formData = {
    PerToken: localStorage.getItem("token"),
    PerUserID: localStorage.getItem("id"),
    PerRoleID: localStorage.getItem("userRoleID"),
  }

  const [degreeList, setDegreeList] = useState([])
  // console.log("degreeList", degreeList)
  useEffect(() => {
    axios
      .post("https://test.cpvarabia.com/api/inspection/DegreeList.php", {
        ...formData,
        Category: "Design",
      })
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

        let array = Object.values(res.data)
        array.splice(-1)
        setDegreeList(
          array
            .map(item => ({ value: item.DegreeID, label: item.Name }))
            .filter(degree => {
              if (ticketControlled.DegreeID === "5") {
                return degree.value * 1 > 1 && degree.value * 1 < 5
              } else {
                return (
                  degree.value * 1 > ticketControlled.DegreeID * 1 &&
                  degree.value * 1 < 5
                )
              }
            })
        )
      })
      .catch(err => console.log(err))
  }, [])

  const validateHandler = values => {
    console.log("values", values)
  }

  const submitHandler = values => {
    // console.log("submitted values", values)

    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      UpdaterID: localStorage.getItem("id"),
      TicketID: ticketControlled.TicketID,
      THID: selectedFile.THID,
    }

    if (values.helpful === "no") formData.Type = "3"

    if (values.helpful === "yes") {
      formData.DegreeID = values.degree
      formData.Type = values.degree === "4" ? "1" : "2"
    }

    // console.log("formData", formData)

    axios
      .post("https://test.cpvarabia.com/api/UpdateTicketStatus", formData)
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

        // console.log("res", res)
        setEditing(!editing)
      })
      .catch(err => console.log(err))
    onClose()
  }

  return (
    <Modal className="modal-md" isOpen={modal} toggle={toggle}>
      <ModalHeader>
        File and Data Received
        <button
          type="button"
          className="btn-close position-absolute end-0 top-0 m-3"
          onClick={onClose}
        />
      </ModalHeader>
      <ModalBody>
        <Formik
          enableReinitialize={true}
          initialValues={{ helpful: "" }}
          validate={validateHandler}
          onSubmit={submitHandler}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
              <div>
                <h5>Data Received:</h5>
                <p
                  style={{
                    border: "1px solid lightgray",
                    borderRadius: "5px",
                    padding: "5px",
                  }}
                >
                  {selectedFile.Data || (
                    <span className="error">No Data Received</span>
                  )}
                </p>
              </div>

              <FormGroup>
                <h5>Is this data helpful?</h5>
                <Input
                  type="select"
                  name="helpful"
                  id="helpful"
                  onChange={props.handleChange}
                  disabled={ticketControlled.DegreeID === "4"}
                >
                  <option value="">Select ...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Input>
              </FormGroup>

              {props.values.helpful === "yes" && (
                <FormGroup>
                  <h5>Update Ticket Degree</h5>
                  <Input
                    type="select"
                    name="degree"
                    id="degree"
                    onChange={props.handleChange}
                    disabled={ticketControlled.DegreeID === "4"}
                  >
                    <option value="">Select Degree ...</option>
                    {degreeList.map((item, i) => (
                      <option key={i} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              )}

              <FormGroup className="d-flex ms-auto  mt-5 justify-content-between">
                {selectedFile.File ? (
                  <a
                    href={selectedFile.File}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    View File Received
                  </a>
                ) : (
                  <p className="error">No File Received</p>
                )}
                <div className="col-4 d-flex ms-auto justify-content-between">
                  <Button className="bg-primary" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    className="bg-primary"
                    type="submit"
                    disabled={ticketControlled.DegreeID === "4"}
                  >
                    Submit
                  </Button>
                </div>
              </FormGroup>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  )
}

export default RD6DataFileView
