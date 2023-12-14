import React, { useEffect, useState } from "react"
import { Col, FormGroup, Input } from "reactstrap"
import AddARemove from "./AddARemove"
import MultiSelectInspection from "./MultiSelectInspectionrd0"
import axios from "axios"
import CommentOtherMultiSelect from "./CommentOtherMultiSelect"
import { useHistory } from "react-router-dom"

const OtherMultiSelect = ({ props, Qitem, dataAnswers, answers, setAuth }) => {
  const history = useHistory()
  const [answerIds, setAnswerIds] = useState([1]) //for creation answers ID

  let numberofIds = []
  // answers &&
  useEffect(() => {
    answers &&
      (answers.map((answer, index) => numberofIds.push(index + 1)),
      setAnswerIds(numberofIds))
  }, [answers])

  const [TRSelectIds, setTRSelectIds] = useState([])
  let fourComment = ["1", "2", "5"]

  const [degreeValue, setDegreeValue] = useState()
  const [degreeList, setDegreeListValue] = useState([])
  const [transferList, setTransferListValue] = useState([])
  const [transferValue, setTransferValue] = useState()

  useEffect(() => {
    let RDIssuer = { ResourceID: "201", Name: "Inspection" }
    axios
      .post("https://test.cpvarabia.com/api/inspection/DegreeList.php", {
        PerToken: localStorage.getItem("token"),
        PerUserID: localStorage.getItem("id"),
        PerRoleID: localStorage.getItem("userRoleID"),
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

        let resData = res.data
        let data = Object.entries(resData).filter(item => {
          if (item[0] !== "4") return Number(item[0])
        })

        setDegreeListValue(data)
      })

    axios
      .post("https://test.cpvarabia.com/api/inspection/TransferToList.php", {
        PerToken: localStorage.getItem("token"),
        PerUserID: localStorage.getItem("id"),
        PerRoleID: localStorage.getItem("userRoleID"),
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

        let resData = res.data
        resData[200] = RDIssuer
        let data = Object.entries(resData).filter(item => {
          return Number(item[0])
        })
        setTransferListValue(data)
      })
  }, [dataAnswers])



  return (
    <div>
      {answerIds.map((id, index) => (
        <div key={index} className="d-flex mb-2 flex-column col-12">
          <div
            key={id}
            id={id}
            className="d-flex col-12 justify-content-between mt-1"
          >
            {props.values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`] ? (
              <div id={"TR" + id} className="col-7">
                {/* <FormGroup row> */}
                {
                  <CommentOtherMultiSelect
                    userSelect={true}
                    commentsNumber={
                      fourComment.includes(
                        props.values[
                          `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`
                        ]
                      )
                        ? 4
                        : 2
                    }
                    AnswerType={Qitem.AnswerType}
                    QID={Qitem.QID}
                    classNameDiv="d-flex  mb-2  mt-2"
                    className=" d-flex col-6 me-3 mb-1  form-control"
                    props={props}
                    name={"comments"}
                    // placeholder={
                    //   degreeValue.Name ? degreeValue.Name : degreeValue
                    // }
                    id={id}
                  />
                }
                {/* </Col> */}

                {/* ******************* error handling ******************** */}
                {props.errors[`${Qitem.AnswerType}${Qitem.QID}-Term${id}`] ? (
                  <div
                    className="error col-10 mx-2 rounded"
                    style={{
                      marginInlineStart: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {props.errors[`${Qitem.AnswerType}${Qitem.QID}-Term${id}`]}
                  </div>
                ) : null}
                {/* </FormGroup> */}
              </div>
            ) : (
              <div className="col-7">
                <Input
                  type="textarea"
                  className="form-control  "
                  name={`${Qitem.AnswerType}${Qitem.QID}-Answer${id}`}
                  value={
                    props.values[`${Qitem.AnswerType}${Qitem.QID}-Answer${id}`]
                  }
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />

                {/* ******************* error handling ******************** */}
                {props.errors[`${Qitem.AnswerType}${Qitem.QID}-Answer${id}`] ? (
                  <div
                    className="error col-12 mx-2 rounded"
                    style={{
                      marginInlineStart: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {
                      props.errors[
                        `${Qitem.AnswerType}${Qitem.QID}-Answer${id}`
                      ]
                    }
                  </div>
                ) : null}
              </div>
            )}
            <div className="ms-4">
              <div
                className="  d-flex flex-column align-items-center "
                disabled={
                  props.values[
                    `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`
                  ] && true
                }
              >
                <MultiSelectInspection
                  props={props}
                  id={id}
                  data={degreeList}
                  name={`${Qitem.AnswerType}${Qitem.QID}-RSelect`}
                  title={"Degree"}
                  setValue={setDegreeValue}
                  className={"me-1"}
                  disabled={
                    props.values[
                      `${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`
                    ] && true
                  }
                />

                {/* ******************* error handling ******************** */}
                {props.errors[
                  `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`
                ] ? (
                  <div
                    className="error col-12 mx-2 rounded"
                    style={{
                      marginInlineStart: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {
                      props.errors[
                        `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`
                      ]
                    }
                  </div>
                ) : null}
              </div>

              <div className=" d-flex flex-column align-items-center ">
                <MultiSelectInspection
                  props={props}
                  id={id}
                  data={transferList}
                  setValue={setTransferValue}
                  name={`${Qitem.AnswerType}${Qitem.QID}-CSelect`}
                  title={"Transfer"}
                  className={"me-1 "}
                  disabled={
                    props.values[
                      `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`
                    ] && true
                  }
                />

                {/* ******************* error handling ******************** */}
                {props.errors[
                  `${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`
                ] ? (
                  <div
                    className="error col-12 mx-2 rounded"
                    style={{
                      marginInlineStart: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {
                      props.errors[
                        `${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`
                      ]
                    }
                  </div>
                ) : null}
              </div>
            </div>
            <div className="d-flex col-3 mt-1">
              <AddARemove
                answerIds={answerIds}
                setAnswerIds={setAnswerIds}
                id={id}
                name={[
                  `${Qitem.AnswerType}${Qitem.QID}-Answer${id}`,
                  `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`,
                  `${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`,
                  `${Qitem.AnswerType}${Qitem.QID}-Term${id}`,
                ]}
                props={props}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OtherMultiSelect
