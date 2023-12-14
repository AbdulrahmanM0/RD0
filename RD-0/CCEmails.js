import React, { useEffect, useState } from "react"
import { Button, Form, FormGroup, Col, Input, Label, Row } from "reactstrap"
import { Formik } from "formik"
import Select, { components } from "react-select"
import Icons from "pages/Stages/QuestionList/Design/QuestionBuilder/Icons"
import axios from "axios"
import ImageDropzone from "common/ImageDropzone"
// import 'react-select/dist/react-select.css';
// window.onclick=function(event){
//   console.log("target",event.target);
// }

function CCEmails({ formRef, MissingReportData }) {
  const [selectedFiles, setselectedFiles] = useState([])
  const [otherEmail, setOtherEmail] = useState(false)
  const [emailIds, setEmailIds] = useState([1])

  // const [Emails, setEmails] = useState([])
  const [groupedOptions, setGroupOptions] = useState([])

  otherEmail === false && emailIds

  useEffect(() => {
    let formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
    }
    axios
      .post("https://test.cpvarabia.com/api/musers.php", formData)
      .then(res => {
        let array = Object.entries(res.data)
        // setTotalPages(res.data.TotalPages)
        array.splice(-4)
        let emails = []
        array.forEach(item => {
          // console.log(item);

          setGroupOptions(res.data.filter(item => item !== false))
        })
      })
      .catch(err => console.log(err))
  }, [])
  // const groupedOptions = [
  //   {
  //     label: "Group 1",
  //     options: [
  //       { value: "Email 1", label: "Name 1" },
  //       { value: "Email 2", label: "Name 2" },
  //     ],
  //   },
  //   {
  //     label: "Group 2",
  //     options: [
  //       { value: "option3", label: "Option 3" },
  //       { value: "option4", label: "Option 4" },
  //     ],
  //   },
  // ]

  const CollapsibleGroup = ({ label, options, ...props }) => {
    // console.log("props",props);

    const [isCollapsed, setIsCollapsed] = useState(false)

    const handleToggleCollapse = e => {
      setIsCollapsed(!isCollapsed)
    }

    return (
      <>
        <div
          onClick={e => handleToggleCollapse(e)}
          style={{ cursor: "pointer" }}
        >
          {isCollapsed ? "▶" : "▼"} {label}
        </div>

        {!isCollapsed && <components.Option {...props} {...options} />}
      </>
    )
  }

  const CustomOption = props => (
    <div>
      {/* Custom styling or content for options */}
      <components.Option {...props} />
    </div>
  )
  return (
    <Formik
      initialValues={{ CCEmails: [] }}
      validate={values => {
        otherEmail === false &&
          emailIds.forEach(emailId => {
            delete values["OtherEmail" + emailId]
          })
      }}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false)

        emailIds.forEach(id => {
          values.CCEmails.push(values[`OtherEmail${id}`])
        })
        // setCCSendedEmails(values.CCEmails)
        // console.log("CCSendedEmails after",CCSendedEmails);
        // const formData = {
        //   PerToken: localStorage.getItem("token"),
        //   PerUserID: localStorage.getItem("id"),
        //   PerRoleID: localStorage.getItem("userRoleID"),
        //   ...MissingReportData,
        //   CCEmails: values.CCEmails,
        // }
        let formData = new FormData()
        formData.append("PerToken", localStorage.getItem("token"))
        formData.append("PerUserID", localStorage.getItem("id"))
        formData.append("PerRoleID", localStorage.getItem("userRoleID"))
        formData.append("CCEmails", values.CCEmails)
        formData.append("MissingReports", MissingReportData.MissingReports)
        formData.append("ProjectID", MissingReportData.ProjectID)
        formData.append("UserID", MissingReportData.UserID)
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("file[]", selectedFiles[i])
        }

        console.log("formData", formData)

        axios
          .post("https://test.cpvarabia.com/api/RD0Requirements", formData)
          .then(res => {
            if (
              res.data.error === true &&
              res.data.message === "Access denied!"
            ) {
              setAuth(true)
              setTimeout(() => {
                history.push("/logout")
                setTimeout(() => {
                  history.push("/login")
                }, 1000)
              }, 4000)
            }

            localStorage.setItem("PStageID", res.data.PStageID)
            let path = `/`
            history.push(path)
          })
          .catch(err => {
            console.log(err)
          })
        console.log("values", values)
      }}
    >
      {props => (
        <Form onSubmit={props.handleSubmit} ref={formRef}>
          {/* Emails */}
          <Col sm={8} className="mb-3">
            <Label forhtml={`other`} className="me-1 d-flex align-items-center">
              <Col sm={2} className="position-relative">
                CC Emails :
              </Col>
              <Col sm={8}>
                <Select
                  // components={{ Option: CustomOption, Group: CollapsibleGroup }}
                  name={"CCEmails"}
                  onChange={e => {
                    props.setFieldValue(
                      "CCEmails",
                      e ? e.map(item => item.value) : []
                    )
                  }}
                  options={groupedOptions}
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
          </Col>
          {/* Other cc emails */}
          {otherEmail &&
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
            ))}

          <Col className="form-group d-flex">
            <Label className="col-8 align-items-center">
              <Col sm={2}>Attachs : </Col>
              <Col className="ms-4">
                <ImageDropzone
                  selectedFiles={selectedFiles}
                  setselectedFiles={setselectedFiles}
                />
              </Col>
            </Label>
            {/* {error && (
          <p className="error d-block">Please select a file less than 10MB.</p>
        )} */}
          </Col>
        </Form>
      )}
    </Formik>
  )
}

export default CCEmails
