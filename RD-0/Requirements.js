import React, { useEffect, useRef, useState } from "react"
import {
  Button,
  Form,
  FormGroup,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Input,
  Label,
} from "reactstrap"
import { useHistory } from "react-router-dom"
import { Formik } from "formik"
import axios from "axios"
import { Link } from "react-router-dom"
import ProjectHeader from "./ProjectHeader"
import { convertPermission } from "permissionUtils"
import UnAuthorizedComponent from "common/UnAuthorizedComponent"
// import Select, { components } from "react-select"
// import Icons from "pages/Stages/QuestionList/Design/QuestionBuilder/Icons"
import CCEmails from "./CCEmails"

const RDZeroRequirements = props => {
  const formRef = useRef()

  let history = useHistory()
  const [CCSendedEmails, setCCSendedEmails] = useState([])

  // **************** Permissions ******************************
  const userPermissions = convertPermission(
    JSON.parse(localStorage.getItem("roles"))
  )

  // **************** Authorization ******************************
  const [auth, setAuth] = useState(false)

  // ------------
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

  const [requiredReports, setRequiredReports] = useState([])
  let [accurate, setAccurate] = useState(null)

  const id = localStorage.getItem("id")
  let projectID = props.match.params.id

  //*************** pop up ********//
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }
  const [sendMailReport, setsendMailReport] = useState([])
  sendMailReport.forEach(getName)
  function getName(item, index, arr) {
    let missName
    if (Number(item)) {
      missName = requiredReports.filter(required => {
        return required.RD0RID == item
      })
      return (arr[index] = missName[0])
    } else {
      return (arr[index] = item)
    }
  }

  const [MissingReportData, setMissingReportData] = useState([])
  const sendData = () => {
    formRef.current.props.onSubmit()

    function editdata(item, index, arr) {
      if (item.RD0RID) {
        return (arr[index] = item.RD0RID)
      } else {
        return (arr[index] = item)
      }
    }
    MissingReportData.MissingReports.forEach(editdata)

    // const formData = {
    //   PerToken: localStorage.getItem("token"),
    //   PerUserID: localStorage.getItem("id"),
    //   PerRoleID: localStorage.getItem("userRoleID"),
    //   ...MissingReportData,
    //   CCEmails: CCSendedEmails,
    // }

    // CCSendedEmails.length > 0 && console.log("formData", formData)

    // // axios
    // //   .post("https://test.cpvarabia.com/api/RD0Requirements", formData)
    // //   .then(res => {
    // //     if (res.data.error === true && res.data.message === "Access denied!") {
    // //       setAuth(true)
    // //       setTimeout(() => {
    // //         history.push("/logout")
    // //         setTimeout(() => {
    // //           history.push("/login")
    // //         }, 1000)
    // //       }, 4000)
    // //     }

    // //     localStorage.setItem("PStageID", res.data.PStageID)
    // //     let path = `/`
    // //     history.push(path)
    // //   })
    // //   .catch(err => {
    // //     console.log(err)
    // //   })
  }

  //****** Other section **************//
  const [other, setOther] = useState(true)
  const [reportIds, setReportIds] = useState([1]) //for creation reports ID

  const addReport = () => {
    let lastId = reportIds[reportIds.length - 1]
    let temp = lastId + 1
    setReportIds([...reportIds, temp])
  }
  const removeReport = itemId => {
    const index = reportIds.indexOf(itemId)

    let tempReportIds = [...reportIds]
    tempReportIds.splice(index, 1)
    setReportIds(tempReportIds)
  }

  useEffect(() => {
    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
    }
    axios
      .post(
        "https://test.cpvarabia.com/api/ProjectMissingReportsView",
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

        let array = Object.values(res.data)
        array.splice(-1)
        setRequiredReports(array)
      })
      .catch(error => console.log(error))

    axios
      .post("https://test.cpvarabia.com/api/ProjectLocationsView", {
        ...formData,
        ProjectID: projectID,
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

        let data = Object.entries(res.data)
        setAccurate(data[0][1].AccurateLocation)
      })
      .catch(error => console.log(error))
  }, [])

  // CC Email
  // const [Emails, setEmails] = useState([])
  // const [emailIds, setEmailIds] = useState([1])
  // useEffect(() => {
  //   let formData = {
  //     PerToken: localStorage.getItem("token"),
  //     PerUserID: localStorage.getItem("id"),
  //     PerRoleID: localStorage.getItem("userRoleID"),
  //   }
  //   axios
  //     .post("https://test.cpvarabia.com/api/Users/View", formData)
  //     .then(res => {
  //       let array = Object.entries(res.data)
  //       // setTotalPages(res.data.TotalPages)
  //       array.splice(-4)
  //       let emails = []
  //       array.forEach(item => {
  //         // console.log(item);
  //         emails.push({
  //           label: item[1].FirstName + item[1].LastName,
  //           value: item[1].Email,
  //         })
  //         setEmails(emails)
  //       })
  //     })
  //     .catch(err => console.log(err))
  // }, [])
  // const colourOptions = [
  //   { value: "blue", label: "Blue", color: "#0052CC" },
  //   { value: "yellow", label: "Yellow", color: "#FFC400" },
  // ]

  // const groupedOptions = [
  //   {
  //     label: 'Group 1',
  //     options: [
  //       { value: 'option1', label: 'Option 1' },
  //       { value: 'option2', label: 'Option 2' },
  //     ],
  //   },
  //   {
  //     label: 'Group 2',
  //     options: [
  //       { value: 'option3', label: 'Option 3' },
  //       { value: 'option4', label: 'Option 4' },
  //     ],
  //   },
  // ];

  // const CollapsibleGroup = ({ label, options, ...props }) => {
  //   const [isCollapsed, setIsCollapsed] = useState(false);

  //   const handleToggleCollapse = () => {
  //     setIsCollapsed(!isCollapsed);
  //   };

  //   return (
  //     <div>
  //       <div onClick={handleToggleCollapse} style={{ cursor: 'pointer' }}>
  //         {isCollapsed ? '▶' : '▼'} {label}
  //       </div>
  //       {!isCollapsed && options.map(option => <components.Option key={option.value} {...props} {...option} />)}
  //     </div>
  //   );
  // };
  // const CustomOption = props => (
  //   <div>
  //     {/* Custom styling or content for options */}
  //     <components.Option {...props} />
  //   </div>
  // );

  // Access denied !!
  if (auth) {
    return <UnAuthorizedComponent />
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <ProjectHeader projectID={project.ProjectID} />
        <Formik
          initialValues={{ CCEmails: [] }}
          onSubmit={(values, actions) => {
            actions.setSubmitting(false)

            // emailIds.forEach(id => {
            //   values.CCEmails.push(values[`OtherEmail${id}`])
            // })
            // setCCSendedEmails(values.CCEmails)

            let otherObject = {}
            if (values["other1"]) {
              reportIds.forEach(i => {
                otherObject["otherMissing" + i] = {
                  EN: values["other" + i],
                  AR: values["otherAR" + i],
                }
              })
            }
            let selectedreport = {}
            Object.entries(values).forEach(value => {
              requiredReports.forEach(report => {
                value[1] == report.RD0RID &&
                  (selectedreport[`${report.ReportName}`] = report.RD0RID)
              })
            })
            let allValues = { ...otherObject, ...selectedreport }
            let reports = []
            Object.entries(allValues).forEach(value => reports.push(value[1]))
            let missReports = []
            missReports = reports.flat()
            setsendMailReport(missReports)
            let data = {
              MissingReports: missReports,
              ProjectID: props.match.params.id,
              UserID: id,
            }
            setMissingReportData(data)
            if (
              (missReports[0] == "" && missReports.length == 1) ||
              missReports.length == 0
            ) {
              // if (!accruate) {
              let path = `/Project-Location/ProjectID=${projectID}`
              history.push(path, { SpecialSystem, project })
              // } else {
              // let path = `/RD-0/ProjectID=${projectID}`
              // history.push(path, { SpecialSystem, project })
              // }
            } else {
              toggle()
            }
          }}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
              {/* Emails */}
              {/* <Col
                sm={8}
                className="mb-3"
                style={{ position: "relative", bottom: "20px" }}
              >
                <Label
                  forhtml={`other${id}`}
                  className="me-1 d-flex align-items-center"
                >
                  <Col
                    sm={2}
                    className="position-relative"
                    style={{ left: "35px" }}
                  >
                    CC Emails :
                  </Col>
                  <Col sm={8}>
                    <Select
                      // value={selectedGroup}
                      name={"CCEmails"}
                      options={groupedOptions}
                      className="select2-selection  p-0  ms-3 "
                      id="LinkedAnswer"
                      onChange={e => {
                        props.setFieldValue(
                          "CCEmails",
                          e ? e.map(item => item.value) : []
                        )
                      }}
                      components={{ Option: CustomOption, Group: CollapsibleGroup }}
                      onBlur={props.handleBlur}                  
                      isMulti
                    />
                  </Col>
                  <Col sm={4}>
                    <div className="ms-5">
                      <label forhtml="others">
                        <input
                          type="Checkbox"
                          id="others"
                          onClick={e => {
                            setOtherEmail(!otherEmail)
                          }}
                          // checked={!otherEmail}
                          className="me-1 "
                        />
                        other Emails
                      </label>
                    </div>
                  </Col>
                </Label>
              </Col> */}
              {/* Other cc emails */}
              {/* {otherEmail &&
                emailIds.map((id, index) => (
                  <Col
                    sm={5}
                    key={index}
                    className="position-relative"
                    style={{ left: "60px", bottom: "20px" }}
                  >
                    <Label
                      forhtml={`other${id}`}
                      className="me-1 d-flex align-items-center"
                    >
                      <Col sm={2}>Email {index + 1} :</Col>
                      <Input
                        onChange={props.handleChange}
                        type="email"
                        // value={props.values["other" + id]}
                        id={`other${id}`}
                        name={`OtherEmail${index + 1}`}
                        className="ms-2 "
                        style={{ height: "25px" }}
                      />

                      <Col
                        sm={4}
                        className="position-relative"
                        style={{ top: "5px" }}
                      >
                        <Icons
                          answerIds={emailIds}
                          props={props}
                          setAnswerIds={setEmailIds}
                          inputType={""}
                          defaultInput={false}
                          id={id}
                        />
                      </Col>
                    </Label>
                  </Col>
                ))} */}

              <div className="d-flex">
                <h5 className="mb-4 me-5">
                  RD0 Missing data that will stop the project :
                </h5>
              </div>
              <div className="ms-5">
                {requiredReports.map((requiredReport, key) => (
                  <FormGroup key={key}>
                    <label forhtml={requiredReport.ReportName}>
                      <input
                        className="me-1"
                        onChange={props.handleChange}
                        type="checkbox"
                        id={requiredReport.ReportName}
                        name={requiredReport.ReportName}
                        value={requiredReport.RD0RID}
                      />
                      {requiredReport.ReportName}
                    </label>
                  </FormGroup>
                ))}

                <FormGroup className="d-flex">
                  <h5 className="mb-4 me-5">Others :</h5>
                  <div className="ms-5">
                    <label forhtml="others">
                      <input
                        type="Checkbox"
                        id="others"
                        onClick={e => {
                          setOther(false)
                        }}
                        checked={!other}
                        className="me-1 "
                      />
                      other Report
                    </label>
                  </div>
                </FormGroup>
                {reportIds.map((id, index) => (
                  <Row key={index} id="otherMissingReport">
                    <Col sm={5}>
                      <Label
                        forhtml={`other${id}`}
                        className="me-1 d-flex align-items-center"
                      >
                        <Col sm={2}>Report EN {index + 1} :</Col>
                        <Input
                          onChange={props.handleChange}
                          type="textarea"
                          value={props.values["other" + id]}
                          id={`other${id}`}
                          name={`other${index + 1}`}
                          disabled={other}
                          className="ms-2"
                          style={{ height: "25px" }}
                        />
                      </Label>
                      <Label
                        forhtml={`otherAR${id}`}
                        className="me-1 d-flex align-items-center"
                      >
                        <Col sm={2}>Report AR {index + 1} :</Col>
                        <Input
                          onChange={props.handleChange}
                          type="textarea"
                          value={props.values["otherAR" + id]}
                          id={`otherAR${id}`}
                          name={`otherAR${index + 1}`}
                          disabled={other}
                          className="ms-2"
                          style={{ height: "25px" }}
                        />
                      </Label>
                    </Col>
                    <Col sm={2} className="d-flex  align-items-center">
                      <FormGroup className="justify-content-between">
                        <Link
                          to="#"
                          onClick={() => {
                            let lastId = reportIds[reportIds.length - 1]
                            props.values[`other${lastId + 1}`] = ""
                            props.values[`otherAR${lastId + 1}`] = ""
                            addReport()
                          }}
                          className="p-0 me-5"
                        >
                          <i
                            className="mdi mdi-plus font-size-14"
                            id="edittooltip"
                          />
                        </Link>
                        <Link
                          to="#"
                          onClick={e => {
                            if (reportIds.length > 1) {
                              removeReport(id)
                              delete props.values[`other${index + 1}`]
                              delete props.values[`otherAR${index + 1}`]
                            }
                          }}
                          className="p-1 py-0"
                        >
                          <i
                            className="mdi mdi-minus font-size-8"
                            id="edittooltip"
                          />
                        </Link>
                      </FormGroup>
                    </Col>
                  </Row>
                ))}
              </div>
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
        <Modal isOpen={modal} toggle={toggle} className="modal-lg">
          <ModalHeader className="text-danger">
            <i className="bx bx-confused"></i>missing Data !
          </ModalHeader>
          <ModalBody>
            <div>
              {
                <div>
                  <p>
                    <b>Unfortunately,</b>you can’t complete the RD0 report right
                    now{" "}
                    <b>
                      <i className="bx bx-confused"></i>
                    </b>
                  </p>
                  <ul>
                    <h6 style={{ fontWeight: "650" }}>
                      An email will be sent immediately to the client,
                      contractor and Malath regarding the following
                      <b className="text-danger "> missing </b>documents :
                    </h6>
                    {sendMailReport.map((item, key) => {
                      if (item.ReportName) {
                        return (
                          <li key={key} className="ms-2 mb-1 ">
                            {key + 1 + "-" + item.ReportName}
                          </li>
                        )
                      } else if (item.EN) {
                        return (
                          <li key={key} className="ms-2 mb-1">
                            {key + 1 + "-" + item.EN}/{item.AR}
                          </li>
                        )
                      }
                    })}
                  </ul>
                </div>
              }
            </div>
            <div className="">
              <CCEmails
                formRef={formRef}
                MissingReportData={MissingReportData}
              />
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
            <Button
              type="submit"
              className="bg-primary"
              onClick={sendData}
              disabled={
                userPermissions.R3.P !== "2" &&
                userPermissions.R3.P !== "3" &&
                userPermissions.R3.P !== "4"
              }
            >
              send
            </Button>
          </FormGroup>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default RDZeroRequirements
