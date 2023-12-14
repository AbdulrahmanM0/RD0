import React, { useEffect, useState } from "react"
import { Formik } from "formik"
import ChildQuestion from "./RD-0ChildQuestion"
import OtherChoice from "./Report Helpers/Other"
import OtherMultiSelect from "./Add several Tickets/OtherMultiSelect"
import HelpComponent from "./Report Helpers/Questionhelp"
import { onSubmitHandler, validationSchema } from "./Report Helpers/RD-0Helper"
import LoadingComponent from "common/LoadingComponent"
import ImagePreview from "./Image & File Upload/ImagePreview"
import ImageUploadAPreview from "./Image & File Upload/ImageUploadAPreview"
import MultiImages from "./Image & File Upload/MultiImages"
import AddTicketManual from "./Add several Tickets/AddTicketManual"
import Ticks from "./Add several Tickets/Ticks"
import {
  Button,
  Form,
  FormGroup,
  Row,
  Card,
  CardTitle,
  CardText,
  CardBody,
  Input,
  Modal,
  Col,
  Label,
  Container,
} from "reactstrap"
import axios from "axios"

function RDReportHTML({
  dataValues,
  QuestionData,
  childQuestionArray,
  childQuestionArrayLevel3,
  props,
  error,
  SpecialSystem,
  userId,
  projectid,
  setResponse,
  setLoading,
  history,
  setAuth,
  missData,
  defaultArray,
  setError,
  transferoperator,
  missingData,
  setMissData,
  Boolean,
  dataBaseAnswers,
  PreviousFunc,
  LengthOfotherCheckbox,
  loading,
  missObject,
  ticketanswers,
  ticketRD6,
  ticketmultitext,
  childQuestion,
  setQuestionData,
  refAP,
}) {
 

  let QISO = []
  for (let i = 2004; i < 2043; i++) {
    QISO.push(i.toString())
  }

  let QISOOptions = [
    "RD5",
    "RD5-Ins",
    "TR",
    "Note",
    "AR",
    "N/A",
    "Trans-to-Spec",
  ]
  let QISOQuestionData = QuestionData.filter(questionData =>
    QISO.includes(questionData.QID)
  )

  const handleKeypress = e => {
    if ((e.code === "Enter" || e.code === "NumpadEnter") && !e.shiftKey) {
      e.preventDefault()
    }
  }

  //****************************** get Childern Questions  ****************************//

  // Helper Functions for getting child
  function transferoperator(answer, value) {
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
        return targetValue >= Number(FT[0]) && targetValue <= Number(FT[1])
      default:
        break
    }
  }

  const condtionFunction = (Qitem, value) => {
    let conditionsArray = []
    Qitem.Answers.forEach(item => {
      conditionsArray.push({
        condtion: transferoperator(item, value),
        answer: item,
      })
    })
    return conditionsArray
  }

  const OR_AND = (childernQuestionsArray, answersArray, AnswerID) => {
    let addedChildernArray = childernQuestionsArray.filer(childern => {
      return !childern.operator
    })

    let OperatorsChildernArray = childernQuestionsArray.filer(childern => {
      return childern.operator
    }) //

    OperatorsChildernArray.forEach(childern => {
      childern.ConditionalAnswers.forEach(conditionAnswerObject => {
        if (childern.Operator === "ADD") {
          conditionAnswerObject.PAIDS.every(item => answersArray.includes(item))
            ? (conditionAnswerObject["conditionResult"] = true)
            : (conditionAnswerObject["conditionResult"] = false)
        } else if (childern.Operator === "OR") {
          conditionAnswerObject.PAIDS.some(item => answersArray.includes(item))
            ? (conditionAnswerObject["conditionResult"] = true)
            : (conditionAnswerObject["conditionResult"] = false)
        }
      })
      // childern.ParentAID.forEach(parentAID => {
      //   if (parentAID !== AnswerID) {
      // if (childern.Operator === "ADD") {
      //   childern.ParentAID.every(item => answersArray.includes(item))
      //     ? addedChildernArray.push(childern)
      //     : ""

      //   //  &&
      //   //   addedChildernArray.push(childern)
      // } else if (childern.Operator === "OR") {
      //   !childern.ParentAID.every(item => answersArray.includes(item)) &&
      //     addedChildernArray.push(childern)
      // }
      //   }
      // })
      let condtionarray = []
      ConditionalQuestions.OperantsArray.forEach((element, index) => {
        let childern = ConditionalAnswers.filer(
          conditionAnswerObject => conditionAnswerObject == element
        )
        condtionarray.push(childern.childernResult)
        condtionarray.push(element.OperatorsArray[index])
      })
    })
    questioncondition = condtionarray.join("")
    eval(questioncondition) && addedChildernArray.push(childern)

    return addedChildernArray
  }

  // main Function
  const getChild = (
    answerID,
    index,
    IntegerValue,
    Question,
    isChecked,
    firstload,
    props
  ) => {
    // console.log("Answers", Object.values(Answers).flat())
    let temp = [...QuestionData]
    let childdata = []
    let searchForLevel3 = false
    let tobeAdded = []
    if (firstload && Question.initialChildrenCheck) return

    if (Question.AnswerType == "Integer") {
      // // delete previous childern answers
      Question.children.forEach(childern => {
        props.values[`${childern.AnswerType}${childern.QID}`] = ""
      })
      condtionFunction(Question, IntegerValue).forEach(item => {
        if (item.condtion) {
          tobeAdded = childQuestion.filter(cQ => item.answer.id == cQ.ParentAID)
          childdata = [...childdata, ...tobeAdded]
          searchForLevel3 = true
        }
      })
    } else if (Question.AnswerType == "CheckBox" && isChecked == false) {
      // delete previous childern answers
      Question.children.forEach(childern => {
        childern.ParentAID == answerID &&
          (props.values[`${childern.AnswerType}${childern.QID}`] = "")
      })
      //we should change type of ParentAID to array
      childdata = Question.children.filter(Q => Q.ParentAID != answerID)
    } else if (Question.AnswerType == "CheckBox" && isChecked == true) {
      tobeAdded = childQuestion.filter(cQ => answerID == cQ.ParentAID)
      childdata = [...Question.children, ...tobeAdded]
      searchForLevel3 = true
    } else {
      // delete previous childern answers
      Question.children.forEach(childern => {
        return (props.values[`${childern.AnswerType}${childern.QID}`] = "")
      })
      childdata = childQuestion.filter(cQ => answerID == cQ.ParentAID)
      searchForLevel3 = true
    }

    if (searchForLevel3) {
      // level 3
      childdata.forEach(Q => {
        Q.allLevel3 = childQuestion.filter(cQ => Q.QID == cQ.ParentQID)
      })
    }
    // first load
    if (
      (firstload && !Question.AnswersChecked.includes(answerID)) ||
      childdata.length > 0
    ) {
      temp[index].AnswersChecked.push(answerID)
      if (Question.AnswerType == "CheckBox") {
        if (temp[index].AnswersChecked.length == IntegerValue.length) {
          temp[index].initialChildrenCheck = true
        }
      } else {
        temp[index].initialChildrenCheck = true
      }
    }
    temp[index].children = childdata
    setQuestionData(temp)
  }

  // ******* Image preview ******
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
      <Formik
        enableReinitialize={true}
        initialValues={{ ...dataValues }}
        validate={values => {
          let errors = {}
          errors = validationSchema(
            values,
            errors,
            QuestionData,
            childQuestionArray,
            childQuestionArrayLevel3,
            missData,
            defaultArray,
            setError,
            transferoperator,
            QISOQuestionData,
            QISO
          )

          return errors
        }}
        onSubmit={async (values, actions) => {
          await onSubmitHandler(
            values,
            actions,
            QuestionData,
            props,
            error,
            SpecialSystem,
            userId,
            projectid,
            setResponse,
            setLoading,
            history,
            setAuth,
            missData,
      
          )
        }}
      >
        {props => (
          <Form
            className="ms-1"
            ref={refAP}
            onSubmit={props.handleSubmit}
            onKeyPress={e => handleKeypress(e)}
          >
            <div>
              <Row className="ms-2 me-3  ">
                {/* Parent Question show */}
                {QuestionData.map(
                  (Qitem, index) =>
                    !QISO.includes(Qitem.QID) &&
                    !Qitem.ParentAID &&
                    (props.values[`${Qitem.AnswerType}${Qitem.QID}`] &&
                      !Qitem.initialChildrenCheck &&
                      Qitem.AnswerType !== "CheckBox" &&
                      getChild(
                        props.values[`${Qitem.AnswerType}${Qitem.QID}`],
                        index,
                        props.values[`${Qitem.AnswerType}${Qitem.QID}`],
                        QuestionData[index],
                        true,
                        true,
                        props
                      ),
                    (
                      <Card
                        id={Qitem.QID}
                        key={index + "PQ"}
                        style={{ marginBottom: "12px" }}
                        className="border border-light "
                        onClick={() => {
                          console.log(
                            "Qitem ===============================>",
                          //   Qitem
                          //   // QuestionData[index].children
                          )
                          // console.log(
                          //   "Qitem-value ===============================>",
                          //   props.values[`${Qitem.AnswerType}${Qitem.QID}`]
                          //   // QuestionData[index].children
                          // )
                        }}
                      >
                        <CardBody className="ms-5 ">
                          <div className="d-flex  col-12 mb-0">
                            <div className="col-6">
                              <CardTitle
                                style={{ fontSize: "14px" }}
                                className="col-12"
                              >
                                {Qitem.QTitle}
                              </CardTitle>
                            </div>
                            {/* Help */}
                            {Qitem.QHelp && (
                              <div id="Help" className="col-2 ms-5">
                                <HelpComponent
                                  id={Qitem.QID}
                                  Title={Qitem.QHelp}
                                />
                              </div>
                            )}
                            {/* Missing Data  */}
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
                                    ref={
                                      missObject[
                                        `${Qitem.AnswerType}${Qitem.QID}`
                                      ]
                                    }
                                    defaultChecked={
                                      props.values[
                                        `${Qitem.AnswerType}${Qitem.QID}`
                                      ] &&
                                      props.values[
                                        `${Qitem.AnswerType}${Qitem.QID}`
                                      ].includes("MD")
                                    }
                                    onClick={e => {
                                      missingData(
                                        e.target,
                                        props.values,
                                        props.errors
                                      )
                                    }}
                                  />
                                  {Qitem.MissingData}
                                </label>
                              )}
                            </div>
                            <div className="col-3 ms-5">
                              {props.errors[
                                `${Qitem.AnswerType}${Qitem.QID}`
                              ] ? (
                                <div className="error col-12" style={{}}>
                                  {
                                    props.errors[
                                      `${Qitem.AnswerType}${Qitem.QID}`
                                    ]
                                  }
                                </div>
                              ) : null}
                              {/* {props.errors[
                                `${Qitem.AnswerType}${Qitem.QID}`
                              ] ? (
                                <div className="error col-12" style={{}}>
                                  {
                                    props.errors[
                                      `${Qitem.AnswerType}${Qitem.QID}`
                                    ]
                                  }
                                </div>
                              ) : null} */}
                            </div>
                            {/* Error */}
                            <div className="col-2 ms-5">
                              {props.errors[
                                `${Qitem.AnswerType}${Qitem.QID}`
                              ] ? (
                                <div className="error col-12" style={{}}>
                                  {
                                    props.errors[
                                      `${Qitem.AnswerType}${Qitem.QID}`
                                    ]
                                  }
                                </div>
                              ) : null}
                            </div>
                          </div>
                          {/* Hint */}
                          <div>
                            {Qitem.QHint && (
                              <div className="text-warning mb-2 d-block">
                                <h6 className="d-inline"> *{Qitem.QHint}</h6>
                              </div>
                            )}
                          </div>

                          <div id={"answerOfQ" + Qitem.QID} className="ms-2">
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
                                      {Qitem.AnswerType == "Boolean" ||
                                      Qitem.AnswerType == "Radio" ? (
                                        <label
                                          className="ms-1 "
                                          forhtml={Aitem.id}
                                        >
                                          <input
                                            onChange={props.handleChange}
                                            type="radio"
                                            name={`${Qitem.AnswerType}${Qitem.QID}`}
                                            value={Aitem.id}
                                            defaultChecked={
                                              Aitem.default == 1 ||
                                              (props.values[
                                                `${Qitem.AnswerType}${Qitem.QID}`
                                              ] &&
                                                props.values[
                                                  `${Qitem.AnswerType}${Qitem.QID}`
                                                ].includes(Aitem.id))
                                            }
                                            onClick={e => {
                                              getChild(
                                                Aitem.id,
                                                index,
                                                e.target.value,
                                                Qitem,
                                                e.target.checked,
                                                false,
                                                props
                                              )
                                              props.setFieldValue(
                                                `${Qitem.AnswerType}${Qitem.QID}`,
                                                Aitem.id
                                              )
                                            }}
                                            id={Aitem.id}
                                            className="me-1"
                                          />
                                          {Aitem.value}
                                        </label>
                                      ) : (
                                        (dataBaseAnswers.length > 0 &&
                                          props.values[
                                            `${Qitem.AnswerType}${Qitem.QID}`
                                          ] &&
                                          props.values[
                                            `${Qitem.AnswerType}${Qitem.QID}`
                                          ].includes(Aitem.id) &&
                                          !Qitem.initialChildrenCheck &&
                                          Qitem.childrenQuestions.length > 0 &&
                                          getChild(
                                            Aitem.id,
                                            index,
                                            props.values[
                                              `${Qitem.AnswerType}${Qitem.QID}`
                                            ],
                                            QuestionData[index],
                                            true,
                                            true,
                                            props
                                          ),
                                        (
                                          <label
                                            className="ms-1 "
                                            forhtml={Aitem.id}
                                          >
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
                                                Qitem.childrenQuestions.length >
                                                  0 &&
                                                  getChild(
                                                    Aitem.id,
                                                    index,
                                                    e.target.value,
                                                    Qitem,
                                                    !e.target.checked,
                                                    false,
                                                    props
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
                                                            checkAnswer !==
                                                            Aitem.id
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
                                            {Aitem.value}
                                          </label>
                                        ))
                                      )}

                                      {Aitem.Hint && (
                                        <div className="fw-bold mb-2 d-flex ">
                                          <h6 className="d-inline fw-bolder">
                                            {Aitem.Hint}
                                          </h6>
                                        </div>
                                      )}
                                    </CardText>
                                  )
                                })}
                                {/* other Answers */}
                                {Qitem.AnswerType === "Radio" && (
                                  <>
                                    {(Qitem.Other || Qitem.Other != null) && (
                                      //  {/* other radio */}
                                      <div>
                                        <CardText
                                          style={{ marginBottom: "0px" }}
                                        >
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
                                              defaultChecked={
                                                props.values[
                                                  `other${Qitem.AnswerType}${Qitem.QID}`
                                                ]
                                              }
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
                                              ) ||
                                              !Boolean(
                                                props.values[
                                                  `other${Qitem.AnswerType}${Qitem.QID}`
                                                ]
                                              )
                                            }
                                            defaultValue={
                                              props.values[
                                                `other${Qitem.AnswerType}${Qitem.QID}`
                                              ]
                                            }
                                          />
                                        </FormGroup>
                                      </div>
                                    )}
                                  </>
                                )}
                                {Qitem.AnswerType === "CheckBox" &&
                                  (Qitem.Other || Qitem.Other != null) && (
                                    // other checkbox
                                    <div>
                                      <OtherChoice
                                        LengthOfotherCheckbox={
                                          LengthOfotherCheckbox
                                        }
                                        props={props}
                                        name={`other${Qitem.AnswerType}${Qitem.QID}`}
                                        label={Qitem.Other}
                                      />
                                    </div>
                                  )}
                              </>
                            ) : Qitem.AnswerType == "Dropdown" &&
                              Qitem.SingleDropdown == "0" ? (
                              Qitem.Answers[0].value == "tickRD6" ? (
                                Qitem.Answers.map((Aitem, key) => {
                                  return (
                                    <CardText
                                      className="d-flex"
                                      style={{ marginBottom: "0px" }}
                                      key={key}
                                    >
                                      <div className="d-flex flex-column col-10 justify-content-between">
                                        {/* Adding other info like TR */}
                                        {
                                          <AddTicketManual
                                            answers={ticketRD6 && ticketRD6}
                                            props={props}
                                            Qitem={Qitem}
                                            dataAnswers={
                                              dataBaseAnswers.filter(
                                                answer =>
                                                  answer.QID === Qitem.QID
                                              )[0]?.RSelect
                                            }
                                            setAuth={setAuth}
                                            userPermissions={
                                              props.userPermissions
                                            }
                                          />
                                        }
                                      </div>
                                      {Aitem.Hint && (
                                        <div
                                          className="fw-bold mb-2 d-flex "
                                          key={key + "hint"}
                                        >
                                          <h6 className="d-inline fw-bolder">
                                            {Aitem.Hint}
                                          </h6>
                                        </div>
                                      )}
                                    </CardText>
                                  )
                                })
                              ) : Qitem.Answers[0].value == "ticks" ? (
                                Qitem.Answers.map((Aitem, key) => {
                                  return (
                                    <CardText
                                      className="d-flex"
                                      style={{ marginBottom: "0px" }}
                                      key={key}
                                    >
                                      <div className="d-flex flex-column col-10 justify-content-between">
                                        {/* Adding other info like TR */}
                                        {
                                          <Ticks
                                            answers={
                                              ticketmultitext && ticketmultitext
                                            }
                                            props={props}
                                            Qitem={Qitem}
                                            dataAnswers={
                                              dataBaseAnswers.filter(
                                                answer =>
                                                  answer.QID === Qitem.QID
                                              )[0]?.RSelect
                                            }
                                            setAuth={setAuth}
                                          />
                                        }
                                      </div>
                                      {Aitem.Hint && (
                                        <div
                                          className="fw-bold mb-2 d-flex "
                                          key={key + "hint"}
                                        >
                                          <h6 className="d-inline fw-bolder">
                                            {Aitem.Hint}
                                          </h6>
                                        </div>
                                      )}
                                    </CardText>
                                  )
                                })
                              ) : (
                                <CardText
                                  className="d-flex"
                                  style={{ marginBottom: "0px" }}
                                >
                                  <div className="d-flex flex-column col-10 justify-content-between">
                                    {/* Adding other info like TR */}
                                    {
                                      <OtherMultiSelect
                                        answers={ticketanswers && ticketanswers}
                                        props={props}
                                        Qitem={Qitem}
                                        dataAnswers={
                                          dataBaseAnswers.filter(
                                            answer => answer.QID === Qitem.QID
                                          )[0]?.RSelect
                                        }
                                        setAuth={setAuth}
                                      />
                                    }
                                  </div>
                                  {Qitem.Answers.map(
                                    (Aitem, key) =>
                                      Aitem.Hint && (
                                        <div
                                          className="fw-bold mb-2 d-flex "
                                          key={key + "hint"}
                                        >
                                          <h6 className="d-inline fw-bolder">
                                            {Aitem.Hint}
                                          </h6>
                                        </div>
                                      )
                                  )}
                                </CardText>
                              )
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
                                  if (key == 0)
                                    return (
                                      <div
                                        className="d-flex col-12 me-5"
                                        key={key + "Int"}
                                      >
                                        <div className="d-flex flex-column col-2 justify-content-between">
                                          <Input
                                            name={`${Qitem.AnswerType}${Qitem.QID}`}
                                            value={
                                              props.values[
                                                `${Qitem.AnswerType}${Qitem.QID}`
                                              ] || ""
                                            }
                                            onChange={e => {
                                              props.setFieldValue(
                                                `${Qitem.AnswerType}${Qitem.QID}`,
                                                e.target.value
                                              )
                                              getChild(
                                                Aitem.id,
                                                index,
                                                e.target.value,
                                                Qitem,
                                                true,
                                                false,
                                                props
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
                                            className="fw-bolder mt-2 d-flex ms-5 "
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
                                Aitem.default === "1" &&
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
                                          defaultValue={
                                            Aitem.default === "1"
                                              ? Aitem.value
                                              : ""
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
                                                      ]
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
                                Aitem.default === "1" &&
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
                                            Aitem.default === "1"
                                              ? Aitem.value
                                              : ""
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
                              })
                            ) : (
                              <CardText
                                className="d-flex"
                                style={{ marginBottom: "0px" }}
                                id={"answerOfQ" + Qitem.QID}
                              >
                                <input
                                  onChange={props.handleChange}
                                  type={Qitem.AnswerType}
                                  name={`${Qitem.AnswerType}${Qitem.QID}`}
                                />
                              </CardText>
                            )}
                          </div>
                          <ChildQuestion
                            key={QuestionData[index].children}
                            childData={QuestionData[index].children}
                            props={props}
                            missData={missData}
                            setMissData={setMissData}
                            defaultArray={defaultArray}
                            setAuth={setAuth}
                            dataBaseAnswers={dataBaseAnswers}
                            dataValues={dataValues}
                          />
                        </CardBody>
                      </Card>
                    ))
                )}
              </Row>
            </div>
            <div>
              <Row className="ms-2 me-3 ">
                {QISOQuestionData.map((QitemISO, key) => (
                  <Card key={key + "ISo"}>
                    <CardBody className="">
                      {/* ISO Question */}
                      <div className="d-flex  col-12 mb-0">
                        <div className="col-6">
                          <CardTitle
                            style={{ fontSize: "14px" }}
                            className="col-12"
                          >
                            {QitemISO.QTitle}
                          </CardTitle>
                        </div>
                      </div>
                      {/* ISO Answes */}
                      <Row className="p-2">
                        <CardText
                          className="d-flex flex-column"
                          style={{ marginBottom: "0px" }}
                          key={key + "F"}
                        >
                          {QitemISO.Answers.map((Aitem, index) => (
                            <Container
                              className=" d-flex col-11 my-2"
                              key={index + "answerIso"}
                            >
                              <Row>
                                <Col sm={6}> {Aitem.value} </Col>
                                <Col
                                  key={key + "isoa"}
                                  check
                                  inline
                                  className="d-flex justify-content-between"
                                  sm={6}
                                >
                                  {QISOOptions.map((answer, key) => (
                                    <>
                                      <Input
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        type={"radio"}
                                        name={Aitem.id}
                                        id={key + Aitem.id + "iso"}
                                        value={answer}
                                      />
                                      <Label
                                        for={key + Aitem.id + "iso"}
                                        style={{ width: "fit-content" }}
                                      >
                                        {answer}
                                      </Label>
                                    </>
                                  ))}
                                </Col>
                                {/* Error */}
                                <div className="col-2 ms-5">
                                  {props.errors[`${Aitem.id}`] ? (
                                    <div className="error col-12" style={{}}>
                                      {props.errors[`${Aitem.id}`]}
                                    </div>
                                  ) : null}
                                </div>
                              </Row>
                            </Container>
                          ))}
                        </CardText>
                      </Row>
                    </CardBody>
                  </Card>
                ))}
              </Row>
            </div>

            {/* <FormGroup className="d-flex ms-auto col-3 mt-5 justify-content-around">
              {isLastTab ? (
                <div>
                  <Button onClick={PreviousFunc} className="bg-primary me-2">
                    {"< previous"}
                  </Button>
                  <Button type="submit" className="bg-primary">
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
                  <Button type="submit" className="bg-primary">
                    {"Next >"}
                  </Button>
                </div>
              )}
            </FormGroup> */}
          </Form>
        )}
      </Formik>

      {/* loading component */}
      <LoadingComponent response={loading} setResponse={setLoading} />

      {/* image preview pop up  */}
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

export default RDReportHTML
