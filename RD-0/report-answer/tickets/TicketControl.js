import { Hidden } from "@material-ui/core"
import axios from "axios"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Col, Container, Form, Input, Label, Row, Table } from "reactstrap"
import ViewTicket from "./ViewTicket"
import ConfirmingAction from "common/ConfirmingAction"

const TicketControl = ({
  // controlToggle,
  ticketControlled,
  editing,
  setEditing,
  updatePermission,
  setAuth,
  formRef,
  submitANewTicket,
  ToggleviewTicket,
  setIsdegree,
  viewNewTicketModal,
  ToggleviewNewTicket,
  setNewTicketData,
  ProjectID
}) => {
  //new ticket

  // const [newTicketData, setNewTicketData] = useState([])
  console.log("viewNewTicketModal", viewNewTicketModal)
  // console.log("ticketControlled========>", ticketControlled)
  const history = useHistory()

  const [modal, setModal] = useState(true)
  // const toggle = () => {
  //   controlToggle()
  // }

  // const onClose = () => {
  //   controlToggle()
  // }

  const formData = {
    PerToken: localStorage.getItem("token"),
    PerUserID: localStorage.getItem("id"),
    PerRoleID: localStorage.getItem("userRoleID"),
  }

  const [transferToOptions, setTransferToOptions] = useState([])
  useEffect(() => {
    axios
      .post(
        "https://test.cpvarabia.com/api/inspection/TransferToList.php",
        formData
      )
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

        // console.log(res.data)
        let array = Object.values(res.data)
        array.splice(-1)
        setTransferToOptions(array)
      })
      .catch(err => console.log(err))
  }, [])

  const [degreeList, setDegreeList] = useState([])
  const [betterDegreeList, setBetterDegreeList] = useState([])
  useEffect(() => {
    axios
      .post("https://test.cpvarabia.com/api/inspection/DegreeList.php", {
        ...formData,
        Category: "Design",
        ProjectID:ProjectID
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
          array.map(item => ({ value: item.DegreeID, label: item.Name }))
        )

        setBetterDegreeList(
          array
            .map(item => ({ value: item.DegreeID, label: item.Name }))
            .filter(degree => {
              // for leads to RD5 (inspection)
              if (ticketControlled.DegreeID === "5") {
                return degree.value * 1 > 1 && degree.value * 1 < 5
              } else {
                // for others degree
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

  const RD5Comments = [
    { label: "English Comment", name: "CommentEN" },
    { label: "Arabic Comment", name: "CommentAR" },
    { label: "English Corrective", name: "CorrectiveEN" },
    { label: "Arabic Corrective", name: "CorrectiveAR" },
  ]

  const validateHandler = values => {
    const errors = {}
    // console.log("values", values)
    setIsdegree(values.degree)

    if (values.degree && values.transferTo)
      errors.logic = "could not update degree and transfer it also!!"

    // Validate RD5, Inspection RD5 && TR Degree With TR Comments
    if (
      values.degree === "1" ||
      values.degree === "2" ||
      values.degree === "5"
    ) {
      if (!values.CommentEN) errors.CommentEN = "required"
      if (!values.CommentAR) errors.CommentAR = "required"
      if (!values.CorrectiveEN) errors.CorrectiveEN = "required"
      if (!values.CorrectiveAR) errors.CorrectiveAR = "required"
    }

    // Validate Note Degree With TR Comments
    if (values.degree === "3") {
      if (!values.CommentEN) errors.CommentEN = "required"
      if (!values.CommentAR) errors.CommentAR = "required"
    }

    if (
      (values.degree === "4" || values.receiveData[0] === "on") &&
      !values.file &&
      !values.data
    ) {
      errors.data = "required data or file"
    }

    if (submitANewTicket === "submitANewTicket" && !values.degree) {
      errors.sendData = "Kindly choose degree before submitting"
    } else if (!values.degree && !values.transferTo && !values.receiveData[0]) {
      errors.sendData = "Kindly update the ticket before submitting"
    }

    console.log("errors", errors)
    return errors
  }
  const newData = () => {
    const formData = new FormData()

    formData.append("PerToken", localStorage.getItem("token"))
    formData.append("PerUserID", localStorage.getItem("id"))
    formData.append("PerRoleID", localStorage.getItem("userRoleID"))
    formData.append("UpdaterID", localStorage.getItem("id"))
    // formData.append("TicketID", ticketControlled.TicketID)
    formData.append("Copy", "1")
    axios
      .post("https://test.cpvarabia.com/api/EditTicket", formData)
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
        // submitANewTicket === "submitANewTicket" && ToggleviewNewTicket()
        // ToggleviewTicket()
        console.log("res", res)
        setEditing(!editing)
      })
      .catch(err => console.log(err))
  }
  const submitHandler = values => {
    const formData = new FormData()

    formData.append("PerToken", localStorage.getItem("token"))
    formData.append("PerUserID", localStorage.getItem("id"))
    formData.append("PerRoleID", localStorage.getItem("userRoleID"))
    formData.append("UpdaterID", localStorage.getItem("id"))
    formData.append("TicketID", ticketControlled.TicketID)
    submitANewTicket === "submitANewTicket" && formData.append("Copy", "1")

    if (values.degree === "4") {
      formData.append("Type", "1")
    } else if (values.receiveData[0] && !values.solvedData[0]) {
      formData.append("Type", "2")
    }
    if (values.degree) formData.append("DegreeID", values.degree)
    formData.append("TransferTo", values.transferTo)
    formData.append("Data", values.data)
    formData.append("File", values.file)

    // for RD5, Inspection RD5 && TR Degree
    if (
      values.degree === "1" ||
      values.degree === "2" ||
      values.degree === "5"
    ) {
      formData.append("Description", values.CommentEN)
      formData.append("CommentAR", values.CommentAR)
      formData.append("CorrectiveEN", values.CorrectiveEN)
      formData.append("CorrectiveAR", values.CorrectiveAR)
    }

    // for Note Degree
    if (values.degree === "3") {
      formData.append("Description", values.CommentEN)
      formData.append("CommentAR", values.CommentAR)
    }

    // To revise
    if (
      // ticketControlled.DegreeEdited &&
      values.receiveData &&
      values.receiveData[0] === "on" &&
      values.betterDegree
    ) {
      formData.append("DegreeID", values.betterDegree)
      if (values.betterDegree === "4") formData.append("Type", "1")
    }

    axios
      .post("https://test.cpvarabia.com/api/EditTicket", formData)
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
        setEditing(!editing)
        // newData()
        if (submitANewTicket === "submitANewTicket") {
          setNewTicketData(res.data)
          ToggleviewTicket()
          ToggleviewNewTicket()
        } else {
          ToggleviewTicket()
          viewNewTicketModal === True && ToggleviewNewTicket()
        }
      })
      .catch(err => console.log(err))
    // onClose()
    // }
  }

  // **********confirm Delete Action***************
  const [ConfirmeModel, setConfirmeModel] = useState(false)
  const Confirmetoggle = () => {
    setConfirmeModel(!ConfirmeModel)
  }
  const [funcproperty, setFuncproperty] = useState("")
  const DeleteTicket = () => {
    let formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      TicketID: ticketControlled.TicketID,
      Type: "2",
    }
    axios
      .post(`https://test.cpvarabia.com/api/DeleteTicket.php`, formData)
      .then(response => {
        setEditing(!editing)
        ToggleviewTicket()
      })
      .catch(error => {
        console.log(err)
      })
  }

  // console.log("submitANewTicket",submitANewTicket);
  return (
    <div className="modal-lg" isOpen={modal}>
      <h5 className="my-4"></h5>
      <Container>
        <Formik
          enableReinitialize={true}
          initialValues={{
            degree: "",
            transferTo: "",
            data: "",
            file: null,
            receiveData: [],
            solvedData: [],
            CommentEN: ticketControlled.Description,
            betterDegree: "",
          }}
          validate={validateHandler}
          onSubmit={submitHandler}
        >
          {props => (
            <Form onSubmit={props.handleSubmit} ref={formRef}>
              <Table>
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Ticket Code</th>
                    <th>Reference No</th>
                    <th>Degree</th>
                    <th>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{ticketControlled.TicketID}</td>
                    <td>{ticketControlled.Code}</td>
                    <td>{ticketControlled.ReferenceNo}</td>
                    <td>{ticketControlled.DegreeName}</td>
                    <td>{ticketControlled.CreatorName}</td>
                  </tr>
                </tbody>
              </Table>
              <div>
                <h5>Description:</h5>
                <div className="d-flex">
                  <p
                    style={{
                      width: "70%",
                      border: "1px solid lightgray",
                      borderRadius: "5px",
                      padding: "5px",
                      overflowX: "scroll",
                    }}
                  >
                    {ticketControlled.Description || "Not Available"}
                  </p>
                  {(
                    ticketControlled.Deletable )&& (
                      <button
                        type="button"
                        className="d-flex ms-auto btn btn-danger p-1 h6"
                        onClick={() => Confirmetoggle()}
                        style={{ height: "30px" }}
                      >
                        Delete Ticket
                      </button>
                    )}
                </div>
              </div>
              <Row className="mt-5">
                <Col ms={4}>
                  <Input
                    type="select"
                    name="degree"
                    id="degree"
                    onChange={props.handleChange}
                    disabled={
                      ticketControlled.DegreeID ||
                      !updatePermission(ticketControlled)
                    }
                    value={
                      ticketControlled.DegreeID && ticketControlled.DegreeID
                    }
                  >
                    <option value="">Select Degree ...</option>

                    {degreeList.map((item, i) => (
                      <option key={i} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Input>
                </Col>

                <Col ms={4}>
                  <Input
                    type="select"
                    name="transferTo"
                    id="transferTo"
                    onChange={props.handleChange}
                    disabled={
                      ticketControlled.DegreeID ||
                      !updatePermission(ticketControlled)
                    }
                  >
                    <option value="">Transfer To...</option>
                    {transferToOptions.map((item, i) => (
                      <option key={i} value={item.ResourceID}>
                        {item.Name}
                      </option>
                    ))}
                    <option value="200">RD0 Issuer</option>
                    <option value="201">Inspection</option>
                  </Input>
                </Col>
                <Col
                  ms={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <Label>
                    <Input
                      type="checkbox"
                      className="mx-2"
                      name="receiveData"
                      id="receiveData"
                      onChange={props.handleChange}
                    />
                    Receiving Data
                  </Label>
                </Col>
              </Row>
              {props.errors.logic ? (
                <p className="error mx-2 d-flex ">{props.errors.logic}</p>
              ) : null}

              {(props.values.degree === "4" || props.values.receiveData[0]) && (
                <div className="mt-5">
                  <Row>
                    <h5>
                      {props.values.degree === "4"
                        ? "Data for solving:"
                        : "Received Data"}
                    </h5>
                  </Row>
                  <Row>
                    <Col sm={8}>
                      <Input
                        className="mb-3"
                        name="file"
                        type="file"
                        onChange={e =>
                          props.setFieldValue("file", e.target.files[0])
                        }
                        // accept=".pdf,.docx"
                      />
                      <Input
                        name="data"
                        id="data"
                        onChange={props.handleChange}
                        type="textarea"
                        placeholder="enter your data ..."
                      />
                      {props.errors.data ? (
                        <p className="error mx-2 d-flex justify-content-end">
                          {props.errors.data}
                        </p>
                      ) : null}
                    </Col>

                    {/* ********************** Better Degree ************************* */}
                    <Col className="d-flex justify-content-center align-items-start">
                      {ticketControlled.DegreeID &&
                        !ticketControlled.RD5Status &&
                        updatePermission(ticketControlled) && (
                          <Input
                            type="select"
                            name="betterDegree"
                            id="betterDegree"
                            onChange={props.handleChange}
                          >
                            <option value="">Select Degree ...</option>
                            {betterDegreeList.map((item, i) => (
                              <option key={i} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </Input>
                        )}
                    </Col>
                  </Row>
                </div>
              )}

              {/* *************************  RD5 and TR Comments ***************** */}
              {(props.values.degree === "1" ||
                ticketControlled.DegreeID === "1" ||
                props.values.degree === "2" ||
                ticketControlled.DegreeID === "2" ||
                props.values.degree === "3" ||
                ticketControlled.DegreeID === "3" ||
                props.values.degree === "13" ||
                ticketControlled.DegreeID === "13" ||
                props.values.degree === "5" ||
                ticketControlled.DegreeID === "5") && (
                <div className="my-5">
                  {RD5Comments.map((item, i) => {
                    console.log("ticketControlled.DegreeID",ticketControlled.DegreeID);
                    (props.values.degree !== "3" ||
                      ticketControlled.DegreeID !== "3")
                    if (
                      (
                        props.values.degree !== "3" &&
                      ticketControlled.DegreeID !== "3"&&
                        props.values.degree !== "13" &&
                      ticketControlled.DegreeID !== "13"
                      )
                       ||
                      ((
                        props.values.degree === "3" ||
                        ticketControlled.DegreeID === "3"||
                        props.values.degree === "13" ||
                        ticketControlled.DegreeID === "13"
                        ) &&
                        (item.name === "CommentEN" ||
                          item.name === "CommentAR"))
                    ) {
                      return (
                        <Row key={i} className="mb-3">
                          <Col sm={3}>
                            <Label htmlFor={item.name}>{item.label}</Label>
                          </Col>
                          <Col sm={8}>
                            <Input
                              disabled={ticketControlled.DegreeID}
                              type="text"
                              name={item.name}
                              id={item.name}
                              value={
                                props.values[`${item.name}`] ||
                                ticketControlled[`${item.name}`]
                              }
                              onChange={props.handleChange}
                            />
                            {props.errors[`${item.name}`] ? (
                              <span className="error mx-2 d-flex justify-content-end">
                                {props.errors[`${item.name}`]}
                              </span>
                            ) : null}
                          </Col>
                        </Row>
                      )
                    }
                  })}
                </div>
              )}

              <div className="mt-5 pt-3">
                {props.errors.sendData ? (
                  <p className="error mx-2 d-flex justify-content-end">
                    {props.errors.sendData}
                  </p>
                ) : null}
              </div>
            </Form>
          )}
        </Formik>
      </Container>
      {/* *********confirming Delete action******** */}
      {ConfirmeModel && (
        <ConfirmingAction
          confirmFunc={DeleteTicket}
          action={"delete"}
          Confirmetoggle={Confirmetoggle}
          ConfirmeModel={ConfirmeModel}
          massege={"Are you sure you want to delete this ticket ?"}
          funcproperty={funcproperty}
        />
      )}
    </div>
  )
}

export default TicketControl
