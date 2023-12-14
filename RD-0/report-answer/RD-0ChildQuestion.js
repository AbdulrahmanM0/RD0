import React, { useEffect, useState } from "react"
import { Formik } from "formik"
import {
  Button,
  Form,
  FormGroup,
  Card,
  CardTitle,
  CardText,
  Modal,
  Input,
} from "reactstrap"
import HelpComponent from "./Report Helpers/Questionhelp"
import OtherChoice from "./Report Helpers/Other"
import OtherMultiSelect from "./Add several Tickets/OtherMultiSelect"
import ImageUploadAPreview from "./Image & File Upload/ImageUploadAPreview"
import ImagePreview from "./Image & File Upload/ImagePreview"
import MultiImages from "./Image & File Upload/MultiImages"

const ChildQuestion = ({
  childData,
  props,
  missData,
  setMissData,
  defaultArray,
  setAuth,
  dataBaseAnswers,
  dataValues,
}) => {
  const [childQuestionData, setChildQuestionData] = useState([...childData])
  useEffect(() => {
    setChildQuestionData(childData)
  }, [childData])
  const [level3Children, setLevel3Children] = useState([])

  //****** missing Data ******
  let missObject = {}
  childQuestionData
    .filter(Q => Q.MissingData)
    .map(item => {
      missObject[`${item.AnswerType}${item.QID}`] = React.createRef()
    })

  useEffect(() => {
    let missDataQuestions = Object.entries(missObject)
    missDataQuestions.map(question => {
      if (question[1]?.current?.checked) {
        let missID = question[1].current.id.slice(8)
        let childNodes = document
          .getElementById(`answerOfQ${missID}`)
          .getElementsByTagName("*")
        for (var node of childNodes) {
          node.disabled = true
          node.checked = false
          node.value = null
        }
      }
    })
  })

  const missingData = (target, values, errors) => {
    let questionId = target.id.slice(8)
    let clickedQuestion = childQuestionData.filter(
      item => item.QID === questionId
    )[0]

    let tempQuestionData = [...childQuestionData]

    tempQuestionData = tempQuestionData.map(item => {
      if (item.childrenLevel3) {
        if (item.QID === questionId) {
          item.childrenLevel3.forEach(item => {
            delete values[`${item.AnswerType}${item.QID}`]
          })
          item.childrenLevel3 = []
        }
      }
      return item
    })

    setChildQuestionData(tempQuestionData)

    if (target.checked == true) {
      missData.push(questionId)
    } else {
      let tempAnswerIds = [...missData]
      tempAnswerIds.splice(missData.indexOf(questionId), 1)
      setMissData(tempAnswerIds)
    }
    let childNodes = document
      .getElementById(`answerOfQ${questionId}`)
      .getElementsByTagName("*")

    if (target.checked == true) {
      delete errors[`${clickedQuestion.AnswerType}${clickedQuestion.QID}`]
      for (var node of childNodes) {
        node.disabled = true
        node.checked = false
        node.value = null
      }
    } else {
      errors[`${clickedQuestion.AnswerType}${clickedQuestion.QID}`] = "Required"
      for (var node of childNodes) {
        node.disabled = false
        delete values[`${clickedQuestion.AnswerType}${clickedQuestion.QID}`]
        delete dataValues[`${clickedQuestion.AnswerType}${clickedQuestion.QID}`]
      }
    }
  }

  // get childern helper functions
  function trasferoperator(answer, value) {
    let targetValue = Number(value)
    let answerValue = Number(answer.value)
    switch (answer.operator) {
      case "NQ":
        return targetValue != answerValue
      case "EQ":
        return targetValue == answerValue
      case "GT":
        return targetValue > answerValue
      case "LT":
        return targetValue < answerValue
      case "LQ":
        return targetValue <= answerValue
      case "GQ":
        return targetValue >= answerValue
      case "FT":
        let FT = answer.value.split("|")
        return targetValue > Number(FT[0]) && targetValue < Number(FT[1])
      default:
        break
    }
  }

  const condtionFunction = (Qitem, value) => {
    let Array = []
    Qitem.Answers.forEach(item => {
      Array.push({ condtion: trasferoperator(item, value), answer: item })
    })
    return Array
  }
  // get childern function
  const getChildren = (
    props,
    answerId,
    question,
    index,
    isChecked,
    initialCheck,
    allAnswers,
    firstload
  ) => {
    // answerId.checked = true
    let level3 = []
    let tobeAdded = []
    let searchForLevel3 = false

    if (question.AnswerType == "Integer") {
      // delete previous answers values
      question.childrenLevel3.forEach(childern => {
        props.values[`${childern.AnswerType}${childern.QID}`] = ""
      })
      condtionFunction(question, answerId).forEach(item => {
        if (item.condtion) {
          tobeAdded = question.allLevel3.filter(
            cQ => item.answer.id == cQ.ParentAID
          )
          level3 = [...level3, ...tobeAdded]
        }
      })
    } else if (question.AnswerType == "CheckBox" && isChecked === false) {
      // delete previous answers values
      // question.childrenLevel3.forEach(childern => {
      //   props.values[`${childern.AnswerType}${childern.QID}`] = ""
      // })
      level3 = question.allLevel3.filter(Q => Q.ParentAID !== answerId)
    } else if (question.AnswerType == "CheckBox" && isChecked === true) {
      tobeAdded = question.allLevel3.filter(cQ => answerId === cQ.ParentAID)
      level3 = [...question.childrenLevel3, ...tobeAdded]
    } else {
      // delete previous answers values
      !firstload &&
        question.allLevel3.forEach(childern => {
          props.values[`${childern.AnswerType}${childern.QID}`] = ""
        })
      level3 = question.allLevel3.filter(cQ => {
        return answerId == cQ.ParentAID
      })
    }
    // first load
    if (
      (initialCheck &&
        !childQuestionData[index].AnswersCheckedlevel3.includes(answerId)) ||
      level3.length > 0
    ) {
      childQuestionData[index].AnswersCheckedlevel3.push(answerId)
      if (question.AnswerType == "CheckBox") {
        if (
          childQuestionData[index].AnswersCheckedlevel3.length ==
          allAnswers.length
        ) {
          childQuestionData[index].initialChildrenCheck = true
        }
      } else {
        childQuestionData[index].initialChildrenCheck = true
      }
    }

    initialCheck && childQuestionData[index].AnswersCheckedlevel3.push(answerId)

    childQuestionData[index].childrenLevel3 = level3
    // initialCheck && (setFirst(false))
  }

  const [viewImages, setViewImages] = useState(false)
  const toggleViewImages = () => {
    setViewImages(!viewImages)
  }
  const [Images, setImages] = useState([])
  const [name, setName] = useState()
  const [imageprops, setProps] = useState()
  const [multiImages, setMultiImages] = useState()
  function imagesPreview(images, name, props, multi) {
    setImages(images)
    setProps(props)
    setName(name)
    setMultiImages(multi)
    toggleViewImages()
  }
  return (
    <React.Fragment>
      {childQuestionData.map(
        //**** child Question ****//
        (Qitem, index) => {
          return (
            props.values[`${Qitem.AnswerType}${Qitem.QID}`] &&
              Qitem.AnswerType !== "CheckBox" &&
              getChildren(
                props,
                props.values[`${Qitem.AnswerType}${Qitem.QID}`],
                Qitem,
                index,
                true,
                true,
                false,
                true
              ),
            (
              <ul key={Qitem.QID} className="mt-2">
                <div className="d-flex  col-12 mb-0">
                  <h4
                    style={{ fontSize: "14px" }}
                    className="col-6"
                    onClick={() => {
                      console.log(
                        "Qitem-child ===============================>",
                        Qitem
                      )
                      console.log(
                        "Qitem-value ===============================>",
                        props.values[`${Qitem.AnswerType}${Qitem.QID}`]
                      )
                    }}
                  >
                    {Qitem.QTitle}
                  </h4>

                  {Qitem.QHelp && (
                    <div id="Help" className="col-2 ms-5">
                      <HelpComponent id={Qitem.QID} Title={Qitem.QHelp} />
                    </div>
                  )}

                  <div className="col-4">
                    {Qitem.MissingData && (
                      <label
                        forhtml={"missingdata" + Qitem.QID}
                        className="ms-2 "
                      >
                        <input
                          className="ms-5 mb-2 me-1 "
                          type="checkbox"
                          id={"missData" + Qitem.QID}
                          value="MD"
                          // onClick={e => {
                          //   missingData(e.target, props.values)
                          // }}
                          ref={missObject[`${Qitem.AnswerType}${Qitem.QID}`]}
                          defaultChecked={
                            props.values[`${Qitem.AnswerType}${Qitem.QID}`] &&
                            props.values[
                              `${Qitem.AnswerType}${Qitem.QID}`
                            ].includes("MD")
                          }
                          onClick={e => {
                            missingData(e.target, props.values, props.errors)
                          }}
                        />
                        {Qitem.MissingData}
                      </label>
                    )}
                  </div>
                  <div className="col-3 ms-5">
                    {props.errors[`${Qitem.AnswerType}${Qitem.QID}`] ? (
                      <div className="error col-12" style={{}}>
                        {props.errors[`${Qitem.AnswerType}${Qitem.QID}`]}
                      </div>
                    ) : null}
                  </div>
                  <div className="col-2 ms-5">
                    {props.errors[`${Qitem.AnswerType}${Qitem.QID}`] ? (
                      <div className="error col-12" style={{}}>
                        {props.errors[`${Qitem.AnswerType}${Qitem.QID}`]}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>
                  {Qitem.QHint && (
                    <div className="text-warning mb-2 d-block">
                      <h6 className="d-inline"> *{Qitem.QHint}</h6>
                    </div>
                  )}
                </div>

                <FormGroup id={"answerOfQ" + Qitem.QID}>
                  {/*******  Answers show ******/}
                  {Qitem.AnswerType == "Radio" ||
                  Qitem.AnswerType == "CheckBox" ||
                  Qitem.AnswerType == "Boolean" ? (
                    <>
                      {Qitem.Answers.map((Aitem, key) => {
                        Aitem.default == 1 &&
                          defaultArray.push({
                            answer: Aitem.id,
                            question: `${Qitem.AnswerType}${Qitem.QID}`,
                          })
                        return (
                          <CardText
                            className="d-flex"
                            style={{ marginBottom: "0px" }}
                            key={key + "F"}
                          >
                            <label className="ms-1 col-6" forhtml={Aitem.id}>
                              {Qitem.AnswerType == "Boolean" ||
                              Qitem.AnswerType == "Radio" ? (
                                <input
                                  onChange={props.handleChange}
                                  type="radio"
                                  name={`${Qitem.AnswerType}${Qitem.QID}`}
                                  value={Aitem.id}
                                  checked={
                                    props.values[
                                      `${Qitem.AnswerType}${Qitem.QID}`
                                    ] === Aitem.id || Aitem.default == 1
                                  }
                                  onClick={e => {
                                    getChildren(
                                      props,
                                      e.target.value,
                                      Qitem,
                                      index,
                                      Aitem,
                                      e.target.checked,
                                      false,
                                      false
                                    )
                                    props.setFieldValue(
                                      `${Qitem.AnswerType}${Qitem.QID}`,
                                      Aitem.id
                                    )
                                  }}
                                  id={Aitem.id}
                                  className="me-1"
                                />
                              ) : (
                                (dataBaseAnswers.length > 0 &&
                                  props.values[
                                    `${Qitem.AnswerType}${Qitem.QID}`
                                  ] &&
                                  props.values[
                                    `${Qitem.AnswerType}${Qitem.QID}`
                                  ].includes(Aitem.id) &&
                                  !Qitem.initialChildrenCheck &&
                                  getChildren(
                                    props,
                                    Aitem.id,
                                    Qitem,
                                    index,
                                    true,
                                    true,
                                    props.values[
                                      `${Qitem.AnswerType}${Qitem.QID}`
                                    ]
                                  ),
                                (
                                  <input
                                    onChange={props.handleChange}
                                    type="checkbox"
                                    name={`${Qitem.AnswerType}${Qitem.QID}`}
                                    value={Aitem.id}
                                    checked={
                                      (props.values[
                                        `${Qitem.AnswerType}${Qitem.QID}`
                                      ] &&
                                        props.values[
                                          `${Qitem.AnswerType}${Qitem.QID}`
                                        ].includes(Aitem.id)) ||
                                      Aitem.default == 1
                                    }
                                    onClick={e => {
                                      getChildren(
                                        props,
                                        e.target.value,
                                        Qitem,
                                        index,
                                        !e.target.checked,
                                        e.target.value,
                                        false
                                      )
                                      if (
                                        props.values[
                                          `${Qitem.AnswerType}${Qitem.QID}`
                                        ]
                                      ) {
                                        if (
                                          props.values[
                                            `${Qitem.AnswerType}${Qitem.QID}`
                                          ].includes(Aitem.id)
                                        ) {
                                          props.setFieldValue(
                                            `${Qitem.AnswerType}${Qitem.QID}`,
                                            [
                                              ...props.values[
                                                `${Qitem.AnswerType}${Qitem.QID}`
                                              ].filter(
                                                checkAnswer =>
                                                  checkAnswer !== Aitem.id
                                              ),
                                            ]
                                          )
                                        } else {
                                          props.setFieldValue(
                                            `${Qitem.AnswerType}${Qitem.QID}`,
                                            [
                                              ...props.values[
                                                `${Qitem.AnswerType}${Qitem.QID}`
                                              ],
                                              Aitem.id,
                                            ]
                                          )
                                        }
                                      } else {
                                        props.setFieldValue(
                                          `${Qitem.AnswerType}${Qitem.QID}`,
                                          [Aitem.id]
                                        )
                                      }
                                    }}
                                    id={Aitem.id}
                                    className="me-1"
                                  />
                                ))
                              )}

                              {Aitem.value}
                            </label>

                            {Aitem.Hint && (
                              <div className=" mb-2 d-flex ">
                                <h6 className="d-inline fw-bolder">
                                  {Aitem.Hint}
                                </h6>
                              </div>
                            )}
                          </CardText>
                        )
                      })}
                      {/* other answer checkbox and radio */}
                      {Qitem.AnswerType === "Radio" && (
                        <>
                          {(Qitem.Other || Qitem.Other != null) && (
                            <div>
                              <CardText style={{ marginBottom: "0px" }}>
                                <label
                                  className="ms-1"
                                  forhtml={`other${Qitem.QID}`}
                                >
                                  <input
                                    onChange={props.handleChange}
                                    type="radio"
                                    name={`${Qitem.AnswerType}${Qitem.QID}`}
                                    value="other"
                                    id={`other${Qitem.QID}`}
                                    className="me-1"
                                  />
                                  {Qitem.Other}
                                </label>
                              </CardText>

                              <FormGroup className="d-flex">
                                <input
                                  onChange={props.handleChange}
                                  type="text"
                                  id={`otherChoice${Qitem.QID}`}
                                  name={`other${Qitem.AnswerType}${Qitem.QID}`}
                                  style={{ height: "24px" }}
                                  disabled={
                                    !Boolean(
                                      props.values[
                                        `${Qitem.AnswerType}${Qitem.QID}`
                                      ] == "other"
                                    )
                                  }
                                />
                              </FormGroup>
                            </div>
                          )}
                        </>
                      )}
                      {Qitem.AnswerType === "CheckBox" &&
                        (Qitem.Other || Qitem.Other != null) && (
                          <OtherChoice
                            props={props}
                            name={`other${Qitem.AnswerType}${Qitem.QID}`}
                            label={Qitem.Other}
                          />
                        )}
                    </>
                  ) : Qitem.AnswerType == "Dropdown" &&
                    Qitem.SingleDropdown == "0" ? (
                    <CardText
                      className="d-flex"
                      style={{ marginBottom: "0px" }}
                    >
                      <div className="d-flex flex-column col-8 justify-content-between">
                        {/* Adding other info like TR */}
                        <OtherMultiSelect props={props} Qitem={Qitem} />
                      </div>
                      {Qitem.Answers.map(
                        (Aitem, key) =>
                          Aitem.Hint && (
                            <div className=" mb-2 d-flex " key={key + "hint"}>
                              <h6 className="d-inline fw-bolder">
                                {Aitem.Hint}
                              </h6>
                            </div>
                          )
                      )}
                    </CardText>
                  ) : Qitem.AnswerType == "Dropdown" &&
                    Qitem.SingleDropdown == "1" ? (
                    <CardText
                      className="d-flex"
                      style={{ marginBottom: "0px" }}
                    >
                      <div className="d-flex flex-column col-8 justify-content-between">
                        <Input
                          name={`${Qitem.AnswerType}${Qitem.QID}`}
                          type="select"
                          onChange={props.handleChange}
                        >
                          <option selected disabled>
                            -- Choose one Option --
                          </option>
                          {Qitem.Answers.map((Aitem, key) => (
                            <option
                              key={key}
                              value={Aitem.id}
                              selected={
                                props.values[
                                  `${Qitem.AnswerType}${Qitem.QID}`
                                ] === Aitem.id
                              }
                            >
                              {Aitem.value}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </CardText>
                  ) : Qitem.AnswerType == "Integer" ? (
                    <CardText
                      className="d-flex"
                      style={{ marginBottom: "0px" }}
                    >
                      {Qitem.Answers.map((Aitem, key) => {
                        // console.log(
                        //   `${Qitem.AnswerType}${Qitem.QID}`,
                        //   props.values[
                        //         `${Qitem.AnswerType}${Qitem.QID}`
                        //       ]
                        // )
                        if (key == 0)
                          return (
                            <div className="d-flex col-12 me-5">
                              <div className="d-flex flex-column col-2 justify-content-between">
                                <Input
                                  key={key + "Int"}
                                  name={`${Qitem.AnswerType}${Qitem.QID}`}
                                  defaultValue={
                                    props.values[
                                      `${Qitem.AnswerType}${Qitem.QID}`
                                    ] || ""
                                  }
                                  // value={
                                  //   props.values[
                                  //     `${Qitem.AnswerType}${Qitem.QID}`
                                  //   ] || ""
                                  // }
                                  onChange={e => {
                                    console.log("OnChange", e.target.value)
                                    props.setFieldValue(
                                      `${Qitem.AnswerType}${Qitem.QID}`,
                                      e.target.value
                                    )

                                    getChildren(
                                      props,
                                      e.target.value,
                                      Qitem,
                                      index,
                                      true
                                    )
                                  }}
                                  type="number"
                                  step="0.0001"
                                  className="d-flex"
                                  onWheel={e => e.target.blur()}
                                />
                              </div>
                              {Aitem.Hint && (
                                <div
                                  className=" mt-2 d-flex ms-5 "
                                  key={key + "hint"}
                                >
                                  <h6 className="d-inline fw-bolder">
                                    {Aitem.Hint}
                                  </h6>
                                </div>
                              )}
                            </div>
                          )
                      })}
                    </CardText>
                  ) : Qitem.AnswerType == "Text" ? (
                    Qitem.Answers.map((Aitem, key) => {
                      defaultArray.push({
                        answer: Aitem.value,
                        question: `${Qitem.AnswerType}${Qitem.QID}`,
                      })
                      return (
                        <CardText
                          className="d-flex"
                          style={{ marginBottom: "0px" }}
                          key={key + "F"}
                        >
                          <div className="d-flex col-12">
                            <div className="d-flex col-8">
                              <Input
                                onChange={props.handleChange}
                                type="textarea"
                                name={`${Qitem.AnswerType}${Qitem.QID}`}
                                defaultValue={Aitem.value ? Aitem.value : ""}
                                value={
                                  props.values[
                                    `${Qitem.AnswerType}${Qitem.QID}`
                                  ]
                                }
                                id={Aitem.id}
                                className="me-1"
                              />
                            </div>
                            {Aitem.Hint && (
                              <div
                                className=" mt-2 d-flex ms-2 "
                                key={key + "hint"}
                              >
                                <h6 className="d-inline fw-bolder">
                                  {Aitem.Hint}
                                </h6>
                              </div>
                            )}
                          </div>
                        </CardText>
                      )
                    })
                  ) : Qitem.AnswerType == "File" ? (
                    <div className="d-flex ">
                      {Qitem.Answers.map((Aitem, key) => {
                        return (
                          <CardText
                            className="d-flex"
                            style={{ marginBottom: "0px" }}
                            key={key + "F"}
                          >
                            <div className="d-flex col-12">
                              <div className="d-flex col-10">
                                {Aitem.value == "pdf" ? (
                                  <div className="d-flex">
                                    <ImageUploadAPreview
                                      name={`${Qitem.AnswerType}${Qitem.QID}`}
                                      value={`${Qitem.AnswerType}${Qitem.QID}`}
                                      props={props}
                                      setAuth={setAuth}
                                    />

                                    {props.values[
                                      `${Qitem.AnswerType}${Qitem.QID}`
                                    ] && (
                                      <div>
                                        <Button
                                          onClick={() =>
                                            imagesPreview(
                                              props.values[
                                                `${Qitem.AnswerType}${Qitem.QID}`
                                              ],
                                              `${Qitem.AnswerType}${Qitem.QID}`,
                                              props
                                            )
                                          }
                                        >
                                          preview
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ) : Aitem.value == "multi" ? (
                                  <div className="d-flex">
                                    <MultiImages
                                      name={`${Qitem.AnswerType}${Qitem.QID}`}
                                      value={`${Qitem.AnswerType}${Qitem.QID}`}
                                      props={props}
                                      setAuth={setAuth}
                                    />

                                    {props.values[
                                      `${Qitem.AnswerType}${Qitem.QID}`
                                    ] && (
                                      <div>
                                        <Button
                                          onClick={() =>
                                            imagesPreview(
                                              props.values[
                                                `${Qitem.AnswerType}${Qitem.QID}`
                                              ],
                                              `${Qitem.AnswerType}${Qitem.QID}`,
                                              props,
                                              " multi"
                                            )
                                          }
                                        >
                                          preview
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="d-flex">
                                    <Input
                                      onChange={e =>
                                        props.setFieldValue(
                                          `${Qitem.AnswerType}${Qitem.QID}`,
                                          e.target.files[0]
                                        )
                                      }
                                      type="file"
                                      name={`${Qitem.AnswerType}${Qitem.QID}`}
                                      id={Aitem.id}
                                      className="me-1"
                                      accept="image/*"
                                    />

                                    {props.values[
                                      `${Qitem.AnswerType}${Qitem.QID}`
                                    ] && (
                                      <Button
                                        onClick={() =>
                                          imagesPreview(
                                            props.values[
                                              `${Qitem.AnswerType}${Qitem.QID}`
                                            ],
                                            `${Qitem.AnswerType}${Qitem.QID}`,
                                            props,
                                            "single"
                                          )
                                        }
                                      >
                                        preview
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                              {Aitem.Hint && (
                                <div
                                  className="fw-bold mt-2 d-flex ms-2 "
                                  key={key + "hint"}
                                >
                                  <h6 className="d-inline fw-bolder">
                                    {Aitem.Hint}
                                  </h6>
                                </div>
                              )}
                            </div>
                          </CardText>
                        )
                      })}
                    </div>
                  ) : Qitem.AnswerType == "Date" ? (
                    Qitem.Answers.map((Aitem, key) => {
                      defaultArray.push({
                        answer: Aitem.value,
                        question: `${Qitem.AnswerType}${Qitem.QID}`,
                      })
                      return (
                        <CardText
                          className="d-flex"
                          style={{ marginBottom: "0px" }}
                          key={key + "F"}
                        >
                          <div className="d-flex col-12">
                            <div className="d-flex col-8">
                              <Input
                                onChange={props.handleChange}
                                type="date"
                                max="2050-12-31"
                                name={`${Qitem.AnswerType}${Qitem.QID}`}
                                defaultValue={
                                  Aitem.default === "1" ? Aitem.value : ""
                                }
                                value={
                                  props.values[
                                    `${Qitem.AnswerType}${Qitem.QID}`
                                  ]
                                }
                                id={Aitem.id}
                                className="me-1"
                              />
                            </div>
                            {Aitem.Hint && (
                              <div
                                className=" mt-2 d-flex ms-2 "
                                key={key + "hint"}
                              >
                                <h6 className="d-inline fw-bolder">
                                  {Aitem.Hint}
                                </h6>
                              </div>
                            )}
                          </div>
                        </CardText>
                      )
                    })
                  ) : (
                    <li id={"answerOfQ" + Qitem.QID}>
                      <input
                        onChange={props.handleChange}
                        type={Qitem.AnswerType}
                        name={`${Qitem.AnswerType}${Qitem.QID}`}
                        onClick={e => {
                          getChildren(props, e.target.value, Qitem, index, true)
                        }}
                      />
                    </li>
                  )}
                </FormGroup>
                <ChildQuestion
                  key={Qitem.childrenLevel3}
                  childData={Qitem.childrenLevel3}
                  props={props}
                  missData={missData}
                  setMissData={setMissData}
                  defaultArray={defaultArray}
                  setAuth={setAuth}
                />
              </ul>
            )
          )
        }
      )}
      <Modal isOpen={viewImages} toggle={toggleViewImages} className="modal-lg">
        <ImagePreview
          Images={Images}
          name={name}
          toggleViewImages={toggleViewImages}
          imageprops={imageprops}
          multiImages={multiImages}
          setAuth={setAuth}
        />
      </Modal>
    </React.Fragment>
  )
}

export default ChildQuestion
