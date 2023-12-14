import React, { useEffect, useRef, useState } from "react"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"

import classnames from "classnames"
import axios from "axios"
import TicketControl from "./TicketControl"
import TicketNotes from "./TicketNotes"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

function ViewTicket({
  viewTicketModal,
  ToggleviewTicket,
  ticketControlled,
  editing,
  setEditing,
  updatePermission,
  setAuth,
  setViewTicketModal,
  setNewTicketData,
  ToggleviewNewTicket,
  viewNewTicketModal,
  ProjectID
}) {
 

  const [isdegree, setIsdegree] = useState()
  const [activeTab, setActiveTab] = useState("1")
  const formRef = useRef()
  const history = useHistory()
  const [submitANewTicket, setSubmitANewTicket] = useState()

  return (
    <React.Fragment>
      <Modal
        isOpen={viewTicketModal}
        toggle={ToggleviewTicket}
        className="modal-lg"
      >
        <ModalBody>
          <Nav
            fill
            tabs
            className="rounded nav-tabs-custom col-4"
            role="tablist"
          >
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === "1",
                })}
                onClick={() => setActiveTab((1).toString())}
              >
                Ticket Control
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === "2",
                })}
                onClick={() => setActiveTab((2).toString())}
              >
                Notes
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId={(1).toString()}>
              <TicketControl
                ticketControlled={ticketControlled}
                editing={editing}
                setEditing={setEditing}
                updatePermission={updatePermission}
                setAuth={setAuth}
                formRef={formRef}
                submitANewTicket={submitANewTicket}
                ToggleviewTicket={ToggleviewTicket}
                setIsdegree={setIsdegree}
                ToggleviewNewTicket={ToggleviewNewTicket}
                setNewTicketData={setNewTicketData}
                viewNewTicketModal={viewNewTicketModal}
                ProjectID={ProjectID}
              />
            </TabPane>
            <TabPane tabId={(2).toString()}>
              <TicketNotes ticketControlled={ticketControlled} />
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              ToggleviewTicket()
            }}
            className="bg-secondary"
          >
            Cancel
          </Button>
          {ticketControlled.TransferTo && !ticketControlled["Copy"]   && (
            <Button
              onClick={() => {
                setSubmitANewTicket("submitANewTicket")
                formRef.current.props.onSubmit()
              }}
              className="bg-primary"
              disabled={!isdegree}
            >
              Submit & Add NewTicket
            </Button>
          )}
       
          <Button
            type="submit"
            className="bg-primary"
            onClick={() => {
              setSubmitANewTicket("")
              formRef.current.props.onSubmit()
              setViewTicketModal(false)
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default ViewTicket
