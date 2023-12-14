import React, { createRef, useEffect, useRef, useState } from "react"
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  FormGroup,
} from "reactstrap"
import axios from "axios"
import RDZero from "./RD-0"
import ProjectHeader from "../ProjectHeader"
import { useHistory } from "react-router-dom"
import UnAuthorizedComponent from "common/UnAuthorizedComponent"
import { convertPermission } from "permissionUtils"
import RD6RelatedTickets from "./tickets/RD0RelatedTickets"

const AnswerPage = props => {
  const history = useHistory()
  let projectId = props.match.params.id

  // **************** Permissions ******************************
  const userPermissions = convertPermission(
    JSON.parse(localStorage.getItem("roles"))
  )

  // **************** Authorization ******************************
  const [auth, setAuth] = useState(false)

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
  //--
  const [allValues, setAllValues] = useState([])

  const [activeTab, setActiveTab] = useState("1")
  const [data, setData] = useState([])

  useEffect(() => {
    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      StageID: "10",
      ProjectID: projectId,
    }

    axios
      .post("https://test.cpvarabia.com/api/Sections/View", formData)
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
        setData(array)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const [submittedReports, setSubmittedReports] = useState([])

  // previous function
  const isLastTab = activeTab == data.length 
  const PreviousFunc = () => {
    if (activeTab > 1) {
      setActiveTab((activeTab - 1).toString())
    }
  }
  const Previous = activeTab > 1

  const formRef = useRef()
  const formRefs = useRef([])
  formRefs.current = data.map((item, i) => formRefs.current[i] ?? createRef())

  // Access denied !!
  if (auth) {
    return <UnAuthorizedComponent />
  }

  return (
    <div className="page-content">
      <ProjectHeader projectID={project.ProjectID} />

      <h4 className="mb-3">RD-0 Report Answer</h4>
      <Nav tabs fill style={{ width: "80%" }}>
        {data.map((item, key) => {
          return (
            <NavItem key={key}>
              <NavLink
                className={activeTab == key + 1 ? "active" : ""}
                //////////////////////////////////////////////////////////////////////////////////////////////////////////
                onClick={() => setActiveTab((key + 1).toString())}
              >
                {item[1].SectionName}
              </NavLink>
            </NavItem>
          )
        })}
        {/* <NavItem>
          <NavLink>Tickets</NavLink>
        </NavItem> */}
      </Nav>
      <TabContent activeTab={activeTab}>
        {data.map((item, key) => {
          return (
            <TabPane tabId={(key + 1).toString()} key={key}>
              <RDZero
                id={item[1].SectionID}
                projectId={projectId}
                submittedReports={submittedReports}
                setSubmittedReports={setSubmittedReports}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                submittedKey={key + 1}
                tabsLength={data.length}
                allValues={allValues}
                setAllValues={setAllValues}
                setAuth={setAuth}
                SpecialSystem={SpecialSystem}
                userPermissions={userPermissions}
                refAP={formRefs.current[key]}
                formRef={formRef}
              />
            </TabPane>
          )
        })}
        {/* <TabPane tabId={(data.length + 1).toString()}>
        <RD6RelatedTickets projectId={projectId} />
        </TabPane> */}
      </TabContent>
      <FormGroup className="d-flex ms-auto col-3 mt-5 justify-content-around">
        {isLastTab ? (
          <div>
            <Button onClick={PreviousFunc} className="bg-primary me-2">
              {"< previous"}
            </Button>
            <Button
              type="submit"
              className="bg-primary"
              onClick={() =>
                formRefs.current[activeTab - 2].current["props"] &&
                formRefs.current[activeTab - 2].current.props.onSubmit()
              }
            >
              Submit
            </Button>
          </div>
        ) : (
          <div>
            {Previous && (
              <Button onClick={PreviousFunc} className="bg-primary me-2">
                {"< previous"}
              </Button>
            )}
            <Button
              type="submit"
              className="bg-primary"
              onClick={() =>
                formRefs.current[activeTab - 1].current["props"] &&
                formRefs.current[activeTab - 1].current.props.onSubmit()
              }
              // formRefs.current[0]&&console.log("formRef",formRefs.current[0].current.props)
            >
              {"Next >"}
            </Button>
          </div>
        )}
      </FormGroup>
    </div>
  )
}

export default AnswerPage
