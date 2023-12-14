import React, { useEffect, useState } from "react"
import {
  Col,
  Container,
  Row,
  Table,
  Label,
  Input,
  UncontrolledTooltip,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
} from "reactstrap"

import { useHistory } from "react-router-dom"
import Breadcrumbs from "components/Common/Breadcrumb"
import axios from "axios"

import { convertPermission } from "permissionUtils"
import UnAuthorizedComponent from "common/UnAuthorizedComponent"
// import RD6TicketControl from "./RD6TicketControl"
import RD6DataFileView from "./RD0DataFileView"
import RD6TicketHistory from "./RD0TicketHistory"
import ViewTicket from "./ViewTicket"
import NewTicketModal from "common/NewTicket/NewTicketModal"
import ConfirmingAction from "common/ConfirmingAction"

const RD0RelatedTickets = props => {
  const ProjectID = props.location.ProjectID
  const history = useHistory()

  //**********new ticket modal********************
  const [newTicketModal, setNewTicketModal] = useState(false)
  const newTicketToggle = () => {
    setNewTicketModal(!newTicketModal)
  }
  // **********confirm New Ticket Action action***************
  const [ConfirmNewTicketModel, setConfirmNewTicketModel] = useState(false)
  const ConfirmeNewTickettoggle = () => {
    setConfirmNewTicketModel(!ConfirmNewTicketModel)
  }

  const confirmFunc = () => {
    newTicketToggle()
    ConfirmeNewTickettoggle()
  }

  const [tickets, setTickets] = useState(props.location.state.tickets)
  const [editing, setEditing] = useState(false)

  // **************** Permissions ******************************
  const userPermissions = convertPermission(
    JSON.parse(localStorage.getItem("roles"))
  )
  // **************** Authorization ******************************
  const [auth, setAuth] = useState(false)

  // **********Ticket History *********************
  const [historyModal, setHistoryModal] = useState(false)
  const historyToggle = () => {
    setHistoryModal(!historyModal)
  }

  // **********Ticket Data and File *********************
  const [selectedFile, setSelectedFile] = useState()
  const [dataFileModal, setDataFileModal] = useState(false)
  const dataFileToggle = () => {
    setDataFileModal(!dataFileModal)
  }

  // ********************** Fetching Data with filters ***************************
  // useEffect(() => {
  //   const formData = {
  //     PerToken: localStorage.getItem("token"),
  //     PerUserID: localStorage.getItem("id"),
  //     PerRoleID: localStorage.getItem("userRoleID"),
  //     ProjectID: ProjectID,
  //   }
  //   axios
  //     .post(
  //       "https://test.cpvarabia.com/api/Rd0TicketsList.php",
  //       formData
  //     )
  //     .then(res => {
  //       if (res.data.error === true && res.data.message === "Access denied!") {
  //         setAuth(true)
  //         setTimeout(() => {
  //           history.push("/logout")
  //           setTimeout(() => {
  //             history.push("/login")
  //           }, 1000)
  //         }, 4000)
  //       }

  //       if (res.data.error === false) {
  //         // console.log("res", res)
  //         let array = Object.values(res.data)
  //         array.splice(-1)
  //         setTickets(array)
  //       }
  //     })
  //     .catch(err => console.log(err))
  // }, [editing])

  const [isHovering, setIsHovering] = useState(false)
  const [hoveringTicket, setHoveringTicket] = useState(null)

  const updatePermission = item => {
    if (!item.TransferTo) {
      return item.CreatorID === localStorage.getItem("id")
    } else if (
      item.TransferTo === "16" ||
      item.TransferTo === "17" ||
      item.TransferTo === "18"
    ) {
      return (
        userPermissions[`R${item.TransferTo}`]?.P === "1" ||
        userPermissions[`R${item.TransferTo}`]?.P === "2" ||
        userPermissions[`R${item.TransferTo}`]?.P === "3" ||
        userPermissions[`R${item.TransferTo}`]?.P === "4"
      )
      // for RD0 Issuer
    } else if (item.TransferTo === "200") {
      return item.CreatorID === localStorage.getItem("id")
    } else {
      return true
    }
  }

  // **********Ticket Control *********************
  const [ticketControlled, setTicketControlled] = useState()

  const [viewTicketModal, setViewTicketModal] = useState(false)
  const ToggleviewTicket = () => {
    setViewTicketModal(!viewTicketModal)
  }

  // ********view New Ticket Modal**************
  const [viewNewTicketModal, setViewNewTicketModal] = useState(false)
  const ToggleviewNewTicket = () => {
    setViewNewTicketModal(!viewNewTicketModal)
  }
  const [newTicketData, setNewTicketData] = useState([])
  // Access denied !!
  if (auth) {
    return <UnAuthorizedComponent />
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="RD-0" breadcrumbItem="RD-0 Tickets" />

          <Row>
            {/* <Button
                onClick={ConfirmeNewTickettoggle}
                className=" d-flex ms-auto col-1 justify-content-end font-size-11 fw-bold color-primary "
              >
                + New Ticket
              </Button> */}
            <Col lg="12">
              <div className="">
                <div className="table-responsive">
                  {/******************* table section**************************/}
                  <Table className="project-list-table table-nowrap text-center align-middle table-borderless">
                    {/***********table body *****************/}
                    <tbody>
                      {tickets.map((item, key) => (
                        <tr key={key} style={{ position: "relative" }}>
                          <td>{item.TicketID}</td>
                          <td>
                            <span>
                              <i
                                id={`category-${item.TicketID}`}
                                className={
                                  item.StageCategory === "Design"
                                    ? "fas fa-pencil-ruler"
                                    : "fas fa-map-marked-alt"
                                }
                              />

                              <UncontrolledTooltip
                                // autohide={true}
                                placement="bottom"
                                target={`category-${item.TicketID}`}
                              >
                                {item.StageCategory}
                              </UncontrolledTooltip>
                            </span>
                          </td>

                          <td style={{ position: "relative" }}>
                            <span
                              onMouseOver={() => {
                                setIsHovering(true)
                                setHoveringTicket(item.TicketID)
                              }}
                              onMouseOut={() => {
                                setIsHovering(false)
                                setHoveringTicket(null)
                              }}
                              style={{ cursor: "pointer" }}
                              className="my-auto"
                            >
                              {item.Description?.slice(0, 9)}
                              {item.Description?.length > 9 && " ..."}
                            </span>
                          </td>
                          <td>{item.Code}</td>
                          <td>{item.ReferenceNo}</td>
                          <td>{item.CreatorName}</td>
                          <td>{item.UpdaterName}</td>
                          <td>{item.DegreeName}</td>

                          <td>
                            {item.LastUpdate?.split(" ")[0] ||
                              item.CreatedAt?.split(" ")[0]}
                          </td>
                          <td>
                            <UncontrolledDropdown className="btn-group bg-primary">
                              <button
                                onClick={() => {
                                  setTicketControlled(item)
                                  ToggleviewTicket()
                                }}
                                className="btn btn-primary btn-sm dropdown-toggle"
                              >
                                Update
                              </button>
                              <DropdownToggle
                                tag="a"
                                to="#"
                                className="card-drop"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="mdi mdi-dots-horizontal font-size-18 text-light me-1"></i>
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem
                                  onClick={() => {
                                    setTicketControlled(item)
                                    historyToggle()
                                  }}
                                >
                                  View Ticket History
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>

                          {isHovering &&
                            hoveringTicket === item.TicketID &&
                            item.Description?.length > 9 && (
                              <p
                                style={{
                                  position: "absolute",
                                  top: "70%",
                                  left: "15%",
                                  zIndex: "10",
                                  backgroundColor: "#fbfcd4",
                                  border: "1px solid black",
                                  borderRadius: "5px",
                                  padding: "0 5px",
                                }}
                              >
                                {item.Description}
                              </p>
                            )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
            <Button
              onClick={() => history.push("/Reports")}
              className="d-flex ms-auto col-3  justify-content-center font-size-12 fw-bold mt-3  "
            >
              RD0 Reports Page
            </Button>
          </Row>

          {/* *********NewTicketModal******** */}
          {newTicketModal && (
            <NewTicketModal
              newTicketToggle={newTicketToggle}
              newTicketModal={newTicketModal}
              editing={editing}
              setEditing={setEditing}
              type={"RD2"}
              ProjectID={ProjectID}
            />
          )}
          {/* *********confirm New Ticket Action action******** */}
          {ConfirmNewTicketModel && (
            <ConfirmingAction
              confirmFunc={confirmFunc}
              action={"warning"}
              Confirmetoggle={ConfirmeNewTickettoggle}
              ConfirmeModel={ConfirmNewTicketModel}
              massege={
                "Are you sure that you want to add ticket and send it to the client immediately ?"
              }
            />
          )}

          {/*****************view Ticket***********************/}
          {viewTicketModal && (
            <ViewTicket
              ToggleviewTicket={ToggleviewTicket}
              viewTicketModal={viewTicketModal}
              setViewTicketModal={setViewTicketModal}
              ticketControlled={ticketControlled}
              editing={editing}
              setEditing={setEditing}
              updatePermission={updatePermission}
              setAuth={setAuth}
              setNewTicketData={setNewTicketData}
              ToggleviewNewTicket={ToggleviewNewTicket}
              viewNewTicketModal={viewNewTicketModal}
            />
          )}

          {/***************viewNewTicket*****************/}
          {viewNewTicketModal && (
            <ViewTicket
              ToggleviewTicket={ToggleviewNewTicket}
              viewTicketModal={viewNewTicketModal}
              ticketControlled={newTicketData}
              editing={editing}
              setEditing={setEditing}
              updatePermission={updatePermission}
              setAuth={setAuth}
              setNewTicketData={setNewTicketData}
              ToggleviewNewTicket={ToggleviewNewTicket}
              viewNewTicketModal={viewNewTicketModal}
              ProjectID={ProjectID}
            />
          )}

          {/**************** Ticket History ****************/}
          {historyModal && (
            <RD6TicketHistory
              historyToggle={historyToggle}
              ticketControlled={ticketControlled}
              dataFileToggle={dataFileToggle}
              setSelectedFile={setSelectedFile}
              setAuth={setAuth}
            />
          )}

          {/**************** Data and File View ****************/}
          {dataFileModal && (
            <RD6DataFileView
              dataFileToggle={dataFileToggle}
              ticketControlled={ticketControlled}
              selectedFile={selectedFile}
              editing={editing}
              setEditing={setEditing}
              setAuth={setAuth}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default RD0RelatedTickets
