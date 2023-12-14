import axios from "axios"
import React, { useEffect, useState } from "react"
import {
  Button,
  Col,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

const RD6TicketHistory = ({
  historyToggle,
  ticketControlled,
  dataFileToggle,
  setSelectedFile,
  setAuth,
}) => {
  //   console.log("ticketControlled========>", ticketControlled)
  const [modal, setModal] = useState(true)
  const toggle = () => {
    historyToggle()
  }

  const onClose = () => {
    historyToggle()
  }

  const [ticketHistory, setTicketHistory] = useState([])
  //   console.log("ticketHistory---------->", ticketHistory)

  const [emailHistory, setEmailHistory] = useState([])
  //   console.log("emailHistory", emailHistory)

  const [fileHistory, setFileHistory] = useState([])
  //   console.log("fileHistory", fileHistory)

  const formData = {
    PerToken: localStorage.getItem("token"),
    PerUserID: localStorage.getItem("id"),
    PerRoleID: localStorage.getItem("userRoleID"),
    TicketID: ticketControlled.TicketID,
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
        array = [
          ...array,
          { ResourceID: "200", Name: "RD0 Issuer" },
          { ResourceID: "201", Name: "Inspection" },
        ]
        // console.log("array", array)
        setTransferToOptions(array)
      })
      .catch(err => console.log(err))

    axios
      .post("https://test.cpvarabia.com/api/TicketHistory", formData)
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

        // console.log("res", res.data)
        if (res.data.error === false) {
          let array = Object.values(res.data)
          array.splice(-1)
          setTicketHistory(array)
        }
      })
      .catch(err => console.log(err))

    axios
      .post("https://test.cpvarabia.com/api/TicketEmailHistory", formData)
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

        // console.log("res", res.data)
        if (res.data.error === false) {
          let array = Object.values(res.data)
          array.splice(-1)
          setEmailHistory(array)
        }
      })
      .catch(err => console.log(err))

    axios
      .post("https://test.cpvarabia.com/api/TicketHistory", {
        ...formData,
        ShowFiles: true,
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

        // console.log("res", res.data)
        if (res.data.error === false) {
          let array = Object.values(res.data)
          array.splice(-1)
          setFileHistory(array)
        }
      })
      .catch(err => console.log(err))
  }, [])

  const transferToName = value => {
    const result = transferToOptions.filter(item => item.ResourceID === value)
    return result[0]?.Name
  }

  const style = {
    table: {
      width: "100%",
      display: "table",
      borderSpacing: 0,
      borderCollapse: "separate",
    },
    th: {
      top: 0,
      left: 0,
      zIndex: 2,
      position: "sticky",
      backgroundColor: "#fff",
    },
  }
  const TicketLogs = () => {
    if (ticketHistory.length === 0) {
      return (
        <h5 className="text-center mt-5 py-2 px-5 bg-danger">No logs yet !!</h5>
      )
    }
    return (
      <div style={{ maxHeight: "350px", overflowY: "scroll" }}>
        <Table className="text-center">
          <thead>
            <tr>
              <th style={style.th}>#</th>
              <th style={style.th}>Updater</th>
              <th style={style.th}>Degree</th>
              <th style={style.th}>Transfer To</th>
              <th style={style.th}>Action</th>
              <th style={style.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {ticketHistory.map((item, i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>{item.UpdaterName}</td>
                <td>{item.DegreeName || "-"}</td>
                <td>{transferToName(item.TransferTo) || "-"}</td>
                <td>{item.Action || "-"}</td>
                <td>{item.CreatedAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }

  const EmailLogs = () => {
    const emailActionHandler = action => {
      if (action === "1") return "RD0 Completion"
      else if (action === "2") return "First Reminder"
      else if (action === "3") return "RD5 Issued"
      else if (action === "4") return "Useless Data"
      else if (action === "5") return "Sxx Compltion"
      else if (action === "6") return "RD5 WI"
      else if (action === "7") return "RD5 MS"
      else if (action === "8") return "TR Reminder"
      else return ""
    }
    if (emailHistory.length === 0) {
      return (
        <h5 className="text-center mt-5 py-2 px-5 bg-danger">No logs yet !!</h5>
      )
    }
    return (
      <div style={{ maxHeight: "350px", overflowY: "scroll" }}>
        <Table className="text-center">
          <thead>
            <tr>
              <th style={style.th}>#</th>
              <th style={style.th}>Updater</th>
              <th style={style.th}>Action</th>
              <th style={style.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {emailHistory.map((item, i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>{item.UserName}</td>
                <td>{emailActionHandler(item.Action)}</td>
                <td>{item.CreatedAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }

  const FileLogs = () => {
    if (fileHistory.length === 0) {
      return (
        <h5 className="text-center mt-5 py-2 px-5 bg-danger">No logs yet !!</h5>
      )
    }
    return (
      <div style={{ maxHeight: "350px", overflowY: "scroll" }}>
        <Table className="text-center">
          <thead>
            <tr>
              <th style={style.th}>#</th>
              <th style={style.th}>Updater</th>
              <th style={style.th}>Date</th>
              <th style={style.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {fileHistory.map((item, i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>{item.UpdaterName}</td>
                <td>{item.CreatedAt}</td>
                <td>
                  <div
                    onClick={() => toggle()}
                    className="btn btn-primary btn-sm dropdown-toggle"
                  >
                    View
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }

  return (
    <Modal className="modal-lg" isOpen={modal} toggle={toggle}>
      <ModalHeader>
        Ticket History
        <button
          type="button"
          className="btn-close position-absolute end-0 top-0 m-3"
          onClick={onClose}
        />
      </ModalHeader>
      <ModalBody>
        <div>
          <Tabs id="justify-tab-example" className="mb-3" justify fill>
            <Tab eventKey="ticket" title="Ticket Logs">
              <TicketLogs />
            </Tab>
            <Tab eventKey="emails" title="Emails Logs">
              <EmailLogs />
            </Tab>
            <Tab eventKey="files" title="Files Logs">
              {/* <FileLogs /> */}

              {fileHistory.length === 0 ? (
                <h5 className="text-center mt-5 py-2 px-5 bg-danger">
                  No logs yet !!
                </h5>
              ) : (
                <div style={{ maxHeight: "350px", overflowY: "scroll" }}>
                  <Table className="text-center">
                    <thead>
                      <tr>
                        <th style={style.th}>#</th>
                        <th style={style.th}>Updater</th>
                        <th style={style.th}>Date</th>
                        <th style={style.th}>Type</th>
                        <th style={style.th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fileHistory.map((item, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{item.UpdaterName}</td>
                          <td>{item.CreatedAt}</td>
                          <td>
                            <span
                              className={
                                item.Type === "1"
                                  ? "badge bg-success"
                                  : item.Type === "2"
                                  ? "badge bg-info"
                                  : "badge bg-danger"
                              }
                            >
                              {item.Type === "1"
                                ? "Solving Data"
                                : item.Type === "2"
                                ? "Additional Data"
                                : item.Type === "3"
                                ? "Useless Data"
                                : ""}
                            </span>
                          </td>
                          <td>
                            <UncontrolledDropdown className="btn-group bg-primary">
                              <button
                                onClick={() => {
                                  setSelectedFile(item)
                                  onClose()
                                  dataFileToggle()
                                }}
                                className="btn btn-primary btn-sm dropdown-toggle"
                              >
                                View
                              </button>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Tab>
          </Tabs>
        </div>

        <FormGroup className="d-flex ms-auto col-2 mt-5 justify-content-end">
          <Button
            onClick={() => {
              onClose()
            }}
            className="bg-primary"
          >
            Close
          </Button>
          {/* <Button className="bg-primary">Submit</Button> */}
        </FormGroup>
      </ModalBody>
    </Modal>
  )
}

export default RD6TicketHistory
