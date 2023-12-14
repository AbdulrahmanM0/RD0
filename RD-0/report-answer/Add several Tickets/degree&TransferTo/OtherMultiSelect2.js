import React, { useEffect, useState } from "react"
import { FormGroup, Input } from "reactstrap"
import AddARemove from "./AddARemove"

const OtherMultiSelect = ({ props, Qitem, dataAnswers }) => {
  // console.log("dataAnswers", dataAnswers)
  const [answerIds, setAnswerIds] = useState([1]) //for creation answers ID
  const [TRSelectIds, setTRSelectIds] = useState([])

  useEffect(() => {
    if (dataAnswers?.length > 0) {
      setAnswerIds(dataAnswers.map((answer, i) => i + 1))

      dataAnswers.map((answer, i) => {
        if (
          answer === "Risk leads to Technical Reservation" ||
          answer == "Risk leads to RD5"
        ) {
          setTRSelectIds([...TRSelectIds, i + 1])
        }
      })
    }
  }, [dataAnswers])

  // console.log("answerIds", answerIds)
  // console.log("TRSelectIds", TRSelectIds)

  return (
    <div>
      {answerIds.map((id, index) => (
        <div key={index} className="d-flex flex-column col-12">
          <div
            key={id}
            id={id}
            className="d-flex col-12 justify-content-between mt-1"
          >
            <div className="col-8">
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
                  {props.errors[`${Qitem.AnswerType}${Qitem.QID}-Answer${id}`]}
                </div>
              ) : null}
            </div>
            <div className="col-2  mx-2 d-flex flex-column align-items-center ">
              <select
                className=" col-12  rounded"
                style={{ height: "35px" }}
                name={`${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`}
                value={
                  props.values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`]
                }
                onChange={e => {
                  props.handleChange(
                    `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`
                  )(e.target.value)
                  if (
                    e.target.value === "Risk leads to Technical Reservation" ||
                    e.target.value === "Risk leads to RD5"
                  ) {
                    TRSelectIds.push(id)
                  } else {
                    setTRSelectIds(
                      TRSelectIds.filter(selectId => selectId != id)
                    )
                  }
                }}
                onBlur={props.handleBlur}
              >
                <option disabled selected>
                  ...
                </option>
                <option value="Normal Risk">Normal Risk</option>
                <option value="Risk leads to Note">Risk leads to Note</option>
                <option value="Risk leads to Technical Reservation">
                  Risk leads to Technical Reservation
                </option>
                <option value="Risk leads to RD5">Risk leads to RD5</option>
              </select>

              {/* ******************* error handling ******************** */}
              {props.errors[`${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`] ? (
                <div
                  className="error col-12 mx-2 rounded"
                  style={{
                    marginInlineStart: "5px",
                    fontSize: "12px",
                  }}
                >
                  {props.errors[`${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`]}
                </div>
              ) : null}
            </div>

            <div className="col-2  mx-2 d-flex flex-column align-items-center ">
              <select
                className=" col-12  rounded"
                style={{ height: "35px" }}
                name={`${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`}
                value={
                  props.values[`${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`]
                }
                onChange={props.handleChange}
                onBlur={props.handleBlur}
              >
                <option selected>...</option>
                <option value="RD6">RD6</option>
                <option value="Inspection Engineer">Inspection Engineer</option>
                <option value="Design Review Specialist">
                  Design Review Specialist
                </option>
                <option value="Soil Specialist">Soil Specialist</option>
                <option value="Innovated Material Specialist">
                  Innovated Material Specialist
                </option>
              </select>
              {/* ******************* error handling ******************** */}
              {props.errors[`${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`] ? (
                <div
                  className="error col-12 mx-2 rounded"
                  style={{
                    marginInlineStart: "5px",
                    fontSize: "12px",
                  }}
                >
                  {props.errors[`${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`]}
                </div>
              ) : null}
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
          <div className="col-12">
            {TRSelectIds.includes(id) && (
              <div id={"TR" + id} className="col-12">
                <FormGroup row>
                  <label className="col-12 d-flex align-items-center me-5">
                    The Corrective Action Required :
                  </label>
                  <div className="col-12">
                    <Input
                      type="textarea"
                      className="ms-5"
                      bsSize="md"
                      name={`${Qitem.AnswerType}${Qitem.QID}-Term${id}`}
                      value={
                        props.values[
                          `${Qitem.AnswerType}${Qitem.QID}-Term${id}`
                        ]
                      }
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {/* ******************* error handling ******************** */}
                  {props.errors[`${Qitem.AnswerType}${Qitem.QID}-Term${id}`] ? (
                    <div
                      className="error col-10 mx-2 rounded"
                      style={{
                        marginInlineStart: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {
                        props.errors[
                          `${Qitem.AnswerType}${Qitem.QID}-Term${id}`
                        ]
                      }
                    </div>
                  ) : null}
                </FormGroup>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OtherMultiSelect
