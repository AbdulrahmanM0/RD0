import React, { useState, useEffect } from "react"
import { Col, Container, Input, Label, Row } from "reactstrap"
import AddARemove from "./AddARemove"
import { convertPermission } from "permissionUtils"

function AddTicketManual({ props, Qitem, dataAnswers, answers, setAuth }) {
  let numberofIds = []
  useEffect(() => {
    answers &&
      (answers.map((answer, index) => numberofIds.push(index + 1)),
      setAnswerIds(numberofIds))
  }, [answers])
  const [answerIds, setAnswerIds] = useState([1])
  const userPermissions = convertPermission(
    JSON.parse(localStorage.getItem("roles"))
  )
  return (
    <React.Fragment>
      {answerIds.map((id, index) => (
        <Container key={index} className="d-flex mt-5">
          <div className=" col-12">
            <div className="d-flex col-12">
              <Label className="d-flex ms-5 align-items-center col-2">
                Date :{" "}
              </Label>
              <Col sm={4} className="mb-2 me-5">
                <Input
                  value={
                    props.values[`${Qitem.AnswerType}${Qitem.QID}-Answer${id}`]
                  }
                  type="date"
                  max="2050-12-31"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  name={`${Qitem.AnswerType}${Qitem.QID}-Answer${id}`}
                />
                {props.errors[`${Qitem.AnswerType}${Qitem.QID}-Answer${id}`] ? (
                  <div className="error mb-2">
                    {
                      props.errors[
                        `${Qitem.AnswerType}${Qitem.QID}-Answer${id}`
                      ]
                    }
                  </div>
                ) : null}
              </Col>

              {(userPermissions.R4.P === "1" ||
                userPermissions.R4.P === "2" ||
                userPermissions.R4.P === "3" ||
                userPermissions.R4.P === "4" ||
                userPermissions.R4.G === "1") && (
                <Col sm={3}>
                  <Label className="d-flex col-12">
                    <Col sm={4}>visit type :</Col>
                    <Input
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      type="select"
                      name={`${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`}
                      value={
                        props.values[
                          `${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`
                        ]
                      }
                      className="mb-2 ms-5  p-1  form-control"
                    >
                      <option></option>
                      <option value={"Foundation"}>{"Foundation"}</option>
                      <option value={"Columns"}>{"Columns"}</option>
                      <option value={"Slab"}>{"Slab"}</option>
                      <option value={"Waterproofing"}>{"Waterproofing"}</option>
                      <option value={"Additionalvisit"}>
                        {"Additional visit"}
                      </option>
                      <option value={"Final Visit"}>{"Final Visit"}</option>
                      <option value={"RD7"}>{"RD7"}</option>
                    </Input>
                  </Label>
                  {props.errors[
                    `${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`
                  ] ? (
                    <Row className="error mb-2">
                      {
                        props.errors[
                          `${Qitem.AnswerType}${Qitem.QID}-CSelect${id}`
                        ]
                      }
                    </Row>
                  ) : null}
                </Col>
              )}
            </div>

            <div className="d-flex col-12 ">
              <Label className="d-flex  align-items-center ms-5  col-2">
                concept :
              </Label>

              <Col sm={4} className="me-5">
                <Input
                  name={`${Qitem.AnswerType}${Qitem.QID}-Term${id}`}
                  type="textarea"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={
                    props.values[`${Qitem.AnswerType}${Qitem.QID}-Term${id}`]
                  }
                />
                {props.errors[`${Qitem.AnswerType}${Qitem.QID}-Term${id}`] ? (
                  <div className="error mb-2">
                    {props.errors[`${Qitem.AnswerType}${Qitem.QID}-Term${id}`]}
                  </div>
                ) : null}
              </Col>

              <Col sm={8} className="d-flex">
                <Col sm={2}>
                  <Label>Ticket Status:</Label>
                </Col>
                <Col sm={2}>
                  <Input
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    type="select"
                    name={`${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`}
                    value={
                      props.values[
                        `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`
                      ]
                    }
                    className="mb-2 ms-5  p-1 form-control"
                  >
                    <option></option>
                    <option value={"closed"}>{"closed"}</option>
                    <option value={"open"}>{"open"}</option>
                  </Input>
                </Col>
                {props.errors[
                  `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`
                ] ? (
                  <div className="error mb-2">
                    {
                      props.errors[
                        `${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`
                      ]
                    }
                  </div>
                ) : null}
              </Col>
            </div>

            {props.values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${id}`] ==
              "closed" && (
              <Col>
                <Label className="col-12 d-flex align-items-center ms-4">
                  <Col sm={2}>closing certificate : </Col>
                  <Col sm={6} className=" mt-1">
                    <Input
                      name={`${Qitem.AnswerType}${Qitem.QID}-AnswerAR${id}`}
                      value={
                        props.values[
                          `${Qitem.AnswerType}${Qitem.QID}-AnswerAR${id}`
                        ]
                      }
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      type="textarea"
                    />
                    {props.errors[
                      `${Qitem.AnswerType}${Qitem.QID}-AnswerAR${id}`
                    ] ? (
                      <div className="error mb-2">
                        {
                          props.errors[
                            `${Qitem.AnswerType}${Qitem.QID}-AnswerAR${id}`
                          ]
                        }
                      </div>
                    ) : null}
                  </Col>
                </Label>
              </Col>
            )}
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
        </Container>
      ))}
    </React.Fragment>
  )
}

export default AddTicketManual
