import axios from "axios"
import { convertPermission } from "permissionUtils"


export const validationSchema = (
  values,
  errors,
  QuestionData,
  childQuestionArray,
  childQuestionArrayLevel3,
  missData,
  defaultArray,
  setError,
  transferoperator_of_type_number,
  QISOQuestionData,
  QISO
) => {
  let validatedQuestions = QuestionData.filter(item => !item.ParentAID)
  // ----------> adding other answer with their answer  ------> [for checkbox input]
  validatedQuestions.map(Qitem => {
    if (Qitem.AnswerType === "CheckBox") {
      for (let i = 1; i < 100; i++) {
        if (values[`otherCheckBox${Qitem.QID}-${i}`]) {
          if (values[`${Qitem.AnswerType}${Qitem.QID}`]) {
            values[`${Qitem.AnswerType}${Qitem.QID}`] = [
              ...values[`${Qitem.AnswerType}${Qitem.QID}`],
              "Other|" + values[`otherCheckBox${Qitem.QID}-${i}`],
            ]
          } else {
            values[`${Qitem.AnswerType}${Qitem.QID}`] = [
              values[`otherCheckBox${Qitem.QID}-${i}`],
            ]
          }
          delete values[`otherCheckBox${Qitem.QID}-${i}`]
        }
      }
    }
  })
  // ----------> replacing other answer with their answer  ------> [for dropdown input]

  const userPermissions = convertPermission(
    JSON.parse(localStorage.getItem("roles"))
  )
  let fourComment = ["1", "2", "5"]
  // ******************** Children question validation ********************************
  childQuestionArray.map(Qitem => {
    missData.forEach(item => {
      if (item === Qitem.QID) {
        values[`${Qitem.AnswerType}${Qitem.QID}`] = "MD"
      }
    })

    let childrenDefaultArray = defaultArray.filter(
      item => item.question === `${Qitem.AnswerType}${Qitem.QID}`
    )
    if (
      childrenDefaultArray.length > 0 &&
      childrenDefaultArray[0].question === `${Qitem.AnswerType}${Qitem.QID}` &&
      !values[`${Qitem.AnswerType}${Qitem.QID}`]
    ) {
      values[`${Qitem.AnswerType}${Qitem.QID}`] = childrenDefaultArray[0].answer
    }

    if (
      Qitem.AnswerType === "Integer" &&
      values[`${Qitem.AnswerType}${Qitem.QID}`] &&
      values[`${Qitem.AnswerType}${Qitem.QID}`] !== "MD"
    ) {
      let invalidArray = []
      Qitem.Answers.map(answer => {
        if (
          transferoperator_of_type_number(
            answer,
            values[`${Qitem.AnswerType}${Qitem.QID}`]
          )
        ) {
          invalidArray.push("valid")
        }
      })

      if (invalidArray.length === 0) {
        errors[`${Qitem.AnswerType}${Qitem.QID}`] = "Invalid"
      }
    }

    if (!values[`${Qitem.AnswerType}${Qitem.QID}`]) {
      errors[`${Qitem.AnswerType}${Qitem.QID}`] = "Required"
    }
  })

  // ************** Children level 3 question validation ****************
  childQuestionArrayLevel3.map(Qitem => {
    missData.forEach(item => {
      if (item === Qitem.QID) {
        values[`${Qitem.AnswerType}${Qitem.QID}`] = "MD"
      }
    })

    if (
      Qitem.AnswerType === "Integer" &&
      values[`${Qitem.AnswerType}${Qitem.QID}`] &&
      values[`${Qitem.AnswerType}${Qitem.QID}`] !== "MD"
    ) {
      let invalidArray = []
      Qitem.Answers.map(answer => {
        if (
          transferoperator_of_type_number(
            answer,
            values[`${Qitem.AnswerType}${Qitem.QID}`]
          )
        ) {
          invalidArray.push("valid")
        }
      })

      if (invalidArray.length === 0) {
        errors[`${Qitem.AnswerType}${Qitem.QID}`] = "Invalid"
      }
    }

    if (!values[`${Qitem.AnswerType}${Qitem.QID}`]) {
      errors[`${Qitem.AnswerType}${Qitem.QID}`] = "Required"
    }
  })

  // **************  rest questions validation *********
  // let validatedQuestions = QuestionData.filter(item => !item.ParentAID)
  validatedQuestions.map(Qitem => {
    //  ---------->  ************ for miss data ****************
    missData.forEach(item => {
      if (item === Qitem.QID) {
        values[`${Qitem.AnswerType}${Qitem.QID}`] = "MD"
      }
    })
    // ----------> **************** for default data ****************
    let modifiedDefaultArray = defaultArray.filter(
      item => item.question === `${Qitem.AnswerType}${Qitem.QID}`
    )
    if (
      modifiedDefaultArray.length > 0 &&
      modifiedDefaultArray[0].question === `${Qitem.AnswerType}${Qitem.QID}` &&
      !values[`${Qitem.AnswerType}${Qitem.QID}`]
    ) {
      values[`${Qitem.AnswerType}${Qitem.QID}`] = modifiedDefaultArray[0].answer
    }

    // ----------> replacing other answer with their answer  ------> [for radio input]
    if (values[`${Qitem.AnswerType}${Qitem.QID}`] === "other") {
      values[`${Qitem.AnswerType}${Qitem.QID}`] =
        "Other|" + values[`other${Qitem.AnswerType}${Qitem.QID}`]
    }
    //--------------------> Dropdowmn Multi <-----------------
    if (Qitem.AnswerType === "Dropdown" && Qitem.SingleDropdown == "0") {
      values[`${Qitem.AnswerType}${Qitem.QID}`] = []

      for (let i = 1; i < 100; i++) {
        if (
          values[`${Qitem.AnswerType}${Qitem.QID}-Answer${i}`]
          //  && values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`]
        ) {
          values[`${Qitem.AnswerType}${Qitem.QID}`].push({
            Answer: values[`${Qitem.AnswerType}${Qitem.QID}-Answers${i}`],
            AnswerAR: values[`${Qitem.AnswerType}${Qitem.QID}-AnswerAR${i}`],
            RSelect: values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`],
            CSelect: values[`${Qitem.AnswerType}${Qitem.QID}-CSelect${i}`],
            Term: values[`${Qitem.AnswerType}${Qitem.QID}-Term${i}`],
            TermAR: values[`${Qitem.AnswerType}${Qitem.QID}-TermAR${i}`],
          })
        }
      }
      // if (!values[`${Qitem.AnswerType}${Qitem.QID}`].length) {
      //   errors[`${Qitem.AnswerType}${Qitem.QID}`] = "Required"
      // }
      // ***** validate for each answer if all inputs are found  in dropdown other*********//
      for (let i = 0; i < 100; i++) {
        if (
          values[`${Qitem.AnswerType}${Qitem.QID}-Answer${i}`] ||
          values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`] ||
          values[`${Qitem.AnswerType}${Qitem.QID}-CSelect${i}`] ||
          values[`${Qitem.AnswerType}${Qitem.QID}-Term${i}`]
        ) {
          if (!values[`${Qitem.AnswerType}${Qitem.QID}-Answer${i}`]) {
            errors[`${Qitem.AnswerType}${Qitem.QID}-Answer${i}`] = "Required"
          }
          if (Qitem.Answers[0].value == "tickRD6") {
            if (!values[`${Qitem.AnswerType}${Qitem.QID}-Term${i}`]) {
              errors[`${Qitem.AnswerType}${Qitem.QID}-Term${i}`] = "Required"
            }
            if (!values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`]) {
              errors[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`] = "Required"
            }
            if (
              values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`] ==
                "closed" &&
              !values[`${Qitem.AnswerType}${Qitem.QID}-AnswerAR${i}`]
            ) {
              errors[`${Qitem.AnswerType}${Qitem.QID}-AnswerAR${i}`] =
                "Required"
            }
            if (
              (userPermissions.R4.P === "1" ||
                userPermissions.R4.P === "2" ||
                userPermissions.R4.P === "3" ||
                userPermissions.R4.P === "4" ||
                userPermissions.R4.G === "1") &&
              ((values[`${Qitem.AnswerType}${Qitem.QID}-Answer${i}`] &&
                values[`${Qitem.AnswerType}${Qitem.QID}-CSelect${i}`]) ||
                (!values[`${Qitem.AnswerType}${Qitem.QID}-Answer${i}`] &&
                  !values[`${Qitem.AnswerType}${Qitem.QID}-CSelect${i}`])) &&
              !values[`${Qitem.AnswerType}${Qitem.QID}-CSelect${i}`]
            ) {
              errors[`${Qitem.AnswerType}${Qitem.QID}-CSelect${i}`] = "Required"
            }
          }
          if (Qitem.Answers[0].value == "tickManual") {
            if (
              !values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`] &
              !values[`${Qitem.AnswerType}${Qitem.QID}-CSelect${i}`]
            ) {
              errors[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`] = "Required"
            }
            if (
              fourComment.includes(
                values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`]
              )
            ) {
              if (!values[`${Qitem.AnswerType}${Qitem.QID}-AnswerAR${i}`]) {
                errors[`${Qitem.AnswerType}${Qitem.QID}-AnswerAR${i}`] =
                  "Required"
              }
              if (!values[`${Qitem.AnswerType}${Qitem.QID}-Term${i}`]) {
                errors[`${Qitem.AnswerType}${Qitem.QID}-Term${i}`] = "Required"
              }
              if (!values[`${Qitem.AnswerType}${Qitem.QID}-TermAR${i}`]) {
                errors[`${Qitem.AnswerType}${Qitem.QID}-TermAR${i}`] =
                  "Required"
              }
            }

            if (values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`] == "3") {
              if (!values[`${Qitem.AnswerType}${Qitem.QID}-AnswerAR${i}`]) {
                errors[`${Qitem.AnswerType}${Qitem.QID}-AnswerAR${i}`] =
                  "Required"
              }
            }
          }
        }
      }
    }

    // ************* Validation answer type integer  ****************[Integer]
    if (
      Qitem.AnswerType === "Integer" &&
      values[`${Qitem.AnswerType}${Qitem.QID}`] &&
      values[`${Qitem.AnswerType}${Qitem.QID}`] !== "MD"
    ) {
      let invalidArray = []
      Qitem.Answers.map(answer => {
        if (
          transferoperator_of_type_number(
            answer,
            values[`${Qitem.AnswerType}${Qitem.QID}`]
          )
        ) {
          invalidArray.push("valid")
        }
      })

      if (invalidArray.length === 0) {
        errors[`${Qitem.AnswerType}${Qitem.QID}`] = "Invalid"
      }
    }

    // ---------->  ********************** for the rest answers ****************
    if (
      !QISO.includes(Qitem.QID) &&
      !values[`${Qitem.AnswerType}${Qitem.QID}`]
    ) {
      errors[`${Qitem.AnswerType}${Qitem.QID}`] = "Required"
    }
  })

  console.log("values", values)
  console.log("errors", errors)

  setError(errors)
  return errors
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

export const onSubmitHandler = async (
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
) => {

 

  let validatedQuestions = QuestionData.filter(item => !item.ParentAID)  
  actions.setSubmitting(false)
  let dropdownAnswers = []
  validatedQuestions.map(Qitem => {
  if (Qitem.AnswerType === "Dropdown" && Qitem.SingleDropdown == "0") {
    for (let i = 1; i < 100; i++) {
      if (values[`${Qitem.AnswerType}${Qitem.QID}-Answer${i}`]) {
        dropdownAnswers.push({
          Answer: values[`${Qitem.AnswerType}${Qitem.QID}-Answer${i}`],
          AnswerAR: values[`${Qitem.AnswerType}${Qitem.QID}-AnswerAR${i}`],
          RSelect: values[`${Qitem.AnswerType}${Qitem.QID}-RSelect${i}`],
          CSelect: values[`${Qitem.AnswerType}${Qitem.QID}-CSelect${i}`],
          Term: values[`${Qitem.AnswerType}${Qitem.QID}-Term${i}`] || null,
          TermAR:
            values[`${Qitem.AnswerType}${Qitem.QID}-TermAR${i}`] || null,
        })
      }
    }
    values[`${Qitem.AnswerType}Multi${Qitem.QID}`] =
      values[`${Qitem.AnswerType}${Qitem.QID}`]

    delete values[`${Qitem.AnswerType}${Qitem.QID}`]
    if (missData.includes(Qitem.QID)) {
      values[`${Qitem.AnswerType}Multi${Qitem.QID}`] = "MD"
    }

    if (values[`${Qitem.AnswerType}Multi${Qitem.QID}`] != "MD") {
      values[`${Qitem.AnswerType}Multi${Qitem.QID}`] =
        JSON.stringify(dropdownAnswers)
    }
  }
})

  if (props.activeTab === 1) {
    values["CheckBox238"] = props.SpecialSystem
  }
  if (props.activeTab == props.tabsLength) {
    values["UserID"] = userId
    values["ProjectID"] = projectid
  }
  if (Object.keys(error).length === 0) {
    if (props.activeTab === "1") {
      values["CheckBox238"] = SpecialSystem
    }

    if (!props.submittedReports.includes(props.submittedKey)) {
      props.setSubmittedReports([...props.submittedReports, props.submittedKey])
    }

    if (!props.submittedReports.includes(Number(props.activeTab) - 1)) {
      props.setSubmittedReports([
        ...props.submittedReports,
        Number(props.activeTab) - 1,
      ])
    }
    // ********** Next & Previous ************//
    if (props.activeTab < props.tabsLength) {
      props.setAllValues({ ...props.allValues, ...values })
      props.setActiveTab((Number(props.activeTab) + 1).toString())
    }

    if (
      props.activeTab == props.tabsLength &&
      Object.keys(error).length === 0
    ) {
      let allData = { ...props.allValues, ...values }
      let data = Object.entries(allData)

      const formData = new FormData()
      formData.append("PerToken", localStorage.getItem("token"))
      formData.append("PerUserID", localStorage.getItem("id"))
      formData.append("PerRoleID", localStorage.getItem("userRoleID"))

      data.forEach(value => {
        formData.append(value[0], value[1])
      })
      setLoading(false)

      await axios
        .post("https://test.cpvarabia.com/api/AddReportRD0", formData)
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

          setResponse(res)
          res && setLoading(res)
        })
        .catch(err => {
          console.log(err)
        })
    }

    window.scrollTo({ top: 0 })
  }
}
