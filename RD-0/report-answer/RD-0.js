import React, { useEffect, useState } from "react"

import axios from "axios"
import { useHistory } from "react-router-dom"

import RDReportHTML from "./RDReportHTML"

const RDZero = props => {
  const setAuth = props.setAuth()
  const history = useHistory()
  const SpecialSystem = props.SpecialSystem?.SpecialSystem || []
  let projectid = props.projectId
  const userId = localStorage.getItem("id")

  let ticketanswers
  let ticketRD6
  let ticketmultitext

  const [response, setResponse] = useState(null)
  const [QuestionData, setQuestionData] = useState([])
  const [loading, setLoading] = useState(true)

  // ***** Preparing showing and hiding questions *************
  let ignoredQuestionsIds = ["476", "343", "344", "345", "346"]
  SpecialSystem.map(item => {
    if (item === "437") {
      ignoredQuestionsIds.push("233")
      ignoredQuestionsIds = ignoredQuestionsIds.filter(id => id !== "476")
    }
    if (item === "438") {
      ignoredQuestionsIds = ignoredQuestionsIds.filter(id => id !== "343")
    }
    if (item === "439") {
      ignoredQuestionsIds = ignoredQuestionsIds.filter(id => id !== "344")
    }
    if (item === "440") {
      ignoredQuestionsIds = ignoredQuestionsIds.filter(id => id !== "345")
    }
    if (item === "441") {
      ignoredQuestionsIds = ignoredQuestionsIds.filter(id => id !== "346")
    }
  })
  // ***********Show All Questions ************
  function handleAnswersFrom_DataBase(numberAnswers, item) {
    let answerArray = []
    for (let i = 0; i < numberAnswers; i++) {
      answerArray.push({
        value: item["OptionTitle" + i],
        id: item["QOID" + i],
        Hint: item["AHint" + i],
        default: item["DefaultValue" + i],
        operator: item["Operator" + i],
      })
    }
    return answerArray
  }

  useEffect(() => {
    let questionscollect = []
    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      SectionID: props.id,
    }
    axios
      .post("https://test.cpvarabia.com/api/ShowRD0All", formData)
      .then(questions => {
        if (
          questions.data.error === true &&
          questions.data.message === "Access denied!"
        ) {
          setAuth(true)
          setTimeout(() => {
            history.push("/logout")
            setTimeout(() => {
              history.push("/login")
            }, 1000)
          }, 4000)
        }

        let array = Object.entries(questions.data)
        const getchildernQuestions = QID => {
          return array.filter(item => item[1].ParentQID === QID)
        }
        array.splice(-1)
        array.forEach(item => {
          questionscollect.push({
            QTitle: item[1].QTitle,
            QID: item[1].QID,
            Answers: handleAnswersFrom_DataBase(item[1].OptionsCount, item[1]),
            AnswerType: item[1].AnswerType,
            childrenQuestions: getchildernQuestions(item[1].QID),
            QHint: item[1].QHint,
            ParentAID: item[1].ParentAID,
            ParentQID: item[1].ParentQID,
            children: [],
            allLevel3: [],
            childrenLevel3: [],
            Other: item[1].Other,
            QHelp: item[1].QHelp,
            MissingData: item[1].MissingData,
            SingleDropdown: item[1].Single,
            initialChildrenCheck: false,
            initialChildrenCheckLevel3: false,
            AnswersChecked: [],
            AnswersCheckedlevel3: [],
            order: item[1].QuestionOrder,
          })
        }) //end of push

        // Showing and Hiding Questions as comming from special system

        ignoredQuestionsIds.map(id => {
          questionscollect = questionscollect.filter(item => item.QID !== id)
        })

        let sortedarray = [...questionscollect].sort(
          (a, b) => a.order - b.order
        )

        setQuestionData(sortedarray)
      }) //end of foreach
  }, [])

  // ****** Answers comming from database **************************
  const [dataBaseAnswers, setDataBaseAnswers] = useState([])
  useEffect(() => {
    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      ProjectID: props.projectId,
    }
    axios
      .post("https://test.cpvarabia.com/api/RD0AllQAnswersView", formData)
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
        let answers = array.filter(answer => {
          return answer[1].SectionID == props.id
        })
        setDataBaseAnswers(answers)
      })
      .catch(err => console.log(err))
  }, [])

  let dataValues = {}
  let LengthOfotherCheckbox = 2
  dataBaseAnswers.forEach(answerdata => {
    let answer = answerdata[1]
    if (answer.MissingData === "1") {
      dataValues[`${answer.AnswerType}${answer.QID}`] = "MD"
      dataValues[`${answer.AnswerType}Multi${answer.QID}`] &&
        (dataValues[`${answer.AnswerType}Multi${answer.QID}`] = "MD")
    } else {
      if (answer.AnswerType === "Integer") {
        dataValues[`Integer${answer.QID}`] = answer.Answers[0]
      }

      if (answer.AnswerType === "Radio") {
        dataValues[`Radio${answer.QID}`] = answer.OptionIDs[0]
        if (answer.Answers.length > 0) {
          dataValues[`otherRadio${answer.QID}`] = answer.Answers[0]
        }
      }

      if (answer.AnswerType === "Boolean") {
        dataValues[`Boolean${answer.QID}`] = answer.OptionIDs[0]
      }

      if (answer.AnswerType === "CheckBox") {
        if (answer.OptionIDs[0] === null) {
          dataValues[`CheckBox${answer.QID}`] = answer.OptionIDs[0]
        } else {
          dataValues[`CheckBox${answer.QID}`] = answer.OptionIDs
        }
        if (answer.Answers.length > 0) {
          LengthOfotherCheckbox = answer.Answers.length + 1
          answer.Answers.map(
            (checklistOther, i) =>
              (dataValues[`otherCheckBox${answer.QID}-${i + 1}`] =
                checklistOther)
          )
        }
      }

      if (answer.AnswerType === "Dropdown" && answer.Single == "1") {
        dataValues[`Dropdown${answer.QID}`] = answer.OptionIDs[0]
      }

      if (answer.AnswerType === "Dropdown" && answer.Single == "0") {
        if (answer.OptionTitle === "tickRD6") {
          ticketRD6 = answer.Answers
        } else if (answer.OptionTitle === "ticks") {
          ticketmultitext = answer.Answers
        } else {
          ticketanswers = answer.Answers
        }
        if (answer.Answers.length > 0) {
          answer.Answers.map((item, i) => {
            dataValues[`Dropdown${answer.QID}-Answer${i + 1}`] =
              answer.Answers[i]
            dataValues[`Dropdown${answer.QID}-AnswerAR${i + 1}`] =
              answer.AnswerAR[i]
            dataValues[`Dropdown${answer.QID}-RSelect${i + 1}`] =
              answer.RSelect[i]
            dataValues[`Dropdown${answer.QID}-CSelect${i + 1}`] =
              answer.CSelect[i]
            dataValues[`Dropdown${answer.QID}-Term${i + 1}`] = answer.Term[i]
            dataValues[`Dropdown${answer.QID}-TermAR${i + 1}`] =
              answer.TermAR[i]
          })
        }
      }

      if (answer.AnswerType === "Text") {
        dataValues[`Text${answer.QID}`] = answer.Answers[0]
      }

      if (answer.AnswerType === "File") {
        dataValues[`File${answer.QID}`] = answer.Answers
      }

      if (answer.AnswerType === "Date") {
        dataValues[`Date${answer.QID}`] = answer.Answers[0]
      }
    }
  })

  //****Preparing disabled of comming miss data ****
  let missObject = {}
  QuestionData.filter(Q => Q.MissingData).map(item => {
    missObject[`${item.AnswerType}${item.QID}`] = React.createRef()
  })

  // console.log("missObject",missObject);
  //****** missing Data ******
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
  // ********* missing data function ********
  const [missData, setMissData] = useState([])
  const missingData = (target, values, errors) => {
    let questionId = target.id.slice(8)
    let clickedQuestion = QuestionData.filter(
      item => item.QID === questionId
    )[0]

    let tempQuestionData = [...QuestionData]
    tempQuestionData = tempQuestionData.map(item => {
      if (item.children)
        if (item.QID === questionId) {
          item.children.forEach(item => {
            delete values[`${item.AnswerType}${item.QID}`]
          })
          item.children = []
        }
      return item
    })
    setQuestionData(tempQuestionData)

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

  // ***** preparing child question array for => validation *********
  let childQuestionArray = []
  let childQuestionArrayLevel3 = []

  QuestionData.map(item => {
    if (item.children.length > 0) {
      childQuestionArray = [...childQuestionArray, ...item.children]
      item.children.map(child => {
        if (child.childrenLevel3.length > 0) {
          childQuestionArrayLevel3 = [
            ...childQuestionArrayLevel3,
            ...child.childrenLevel3,
          ]
        }
      })
    }
  })

  //****************************** child questions ****************************//
  const childQuestion = []
  for (let item in QuestionData) {
    QuestionData[item].ParentAID && childQuestion.push(QuestionData[item])
  }
  const [defaultArray, setDefaultArray] = useState([])

  // ******** preper options for Dropdown ***************
  // let answersDropDownArray = []
  // QuestionData.map((item, index) => {
  //   item.AnswerType == "Dropdown" &&
  //     answersDropDownArray.push({
  //       answerId: item.QID,
  //       answers: [],
  //     })
  //   answersDropDownArray.map(answer => {
  //     item.QID == answer.answerId &&
  //       item.Answers.map(itemAnswer =>
  //         answer.answers.push({
  //           options: [{ label: itemAnswer.value, value: itemAnswer.id }],
  //         })
  //       )
  //   })
  // })

  const [error, setError] = useState({})

  const PreviousFunc = () => {
    if (props.submittedKey - 1 >= 1) {
      props.setActiveTab((props.submittedKey - 1).toString())
    }
  }

  // for redirecting to reports page after submitting
  const [tickets, setTickets] = useState([])
  useEffect(() => {
    if (props.activeTab == props.tabsLength) {
      const formData = {
        PerToken: localStorage.getItem("token"),
        PerUserID: localStorage.getItem("id"),
        PerRoleID: localStorage.getItem("userRoleID"),
        ProjectID: projectid,
      }
      axios
        .post("https://test.cpvarabia.com/api/Rd0TicketsList.php", formData)
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

          if (res.data.error === false) {
            let array = Object.values(res.data)
            array.splice(-1)
            setTickets(array)
          }
        })
        .catch(err => console.log(err))
    }
  }, [props.activeTab])
  useEffect(() => {
    if (response && tickets.length===0) {
      history.push("/Reports")
    } else if ( tickets.length > 0) {
      history.push("/RD0Tickets", { tickets: tickets, ProjectId: projectid })
    }
  }, [response])
  //******************************************* component ************************************************//
  return (
    <RDReportHTML
      dataValues={dataValues}
      QuestionData={QuestionData}
      childQuestionArray={childQuestionArray}
      childQuestionArrayLevel3={childQuestionArrayLevel3}
      props={props}
      error={error}
      SpecialSystem={SpecialSystem}
      userId={userId}
      projectid={projectid}
      setResponse={setResponse}
      setLoading={setLoading}
      history={history}
      setAuth={setAuth}
      missData={missData}
      defaultArray={defaultArray}
      setError={setError}
      missingData={missingData}
      setMissData={setMissData}
      Boolean={Boolean}
      dataBaseAnswers={dataBaseAnswers}
      childQuestion={childQuestion}
      setQuestionData={setQuestionData}
      PreviousFunc={PreviousFunc}
      LengthOfotherCheckbox={LengthOfotherCheckbox}
      loading={loading}
      missObject={missObject}
      ticketanswers={ticketanswers}
      ticketRD6={ticketRD6}
      ticketmultitext={ticketmultitext}
      refAP={props.refAP}
    />
  )
}

export default RDZero
