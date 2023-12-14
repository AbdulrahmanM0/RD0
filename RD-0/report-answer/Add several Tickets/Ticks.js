import React, { useState, useEffect } from "react"
import { Col, Container, Input, Label } from "reactstrap"
import AddARemove from "./AddARemove"

function Ticks({ props, Qitem, dataAnswers, answers, setAuth }) {
  const [answerIds, setAnswerIds] = useState([1])
  let numberofIds = []
  // answers &&
  useEffect(() => {
    answers &&
      (answers.map((answer, index) => numberofIds.push(index + 1)),
      setAnswerIds(numberofIds))
  }, [answers])

  return (
    <React.Fragment>
      {answerIds.map((id, index) => (
        <Container key={index} className="d-flex mt-3">
          {/* <div className="d-flex col-12 "> */}
          <Label className="d-flex  align-items-center ms-4  col-8">
            <Col sm={2}>concept :</Col>
            <Col sm={8}>
              <Input
                name={`${Qitem.AnswerType}${Qitem.QID}-Answer${id}`}
                type="textarea"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={
                  props.values[`${Qitem.AnswerType}${Qitem.QID}-Answer${id}`]
                }
              />
            </Col>
          </Label>
          {/* </div> */}

          <div className="d-flex col-4 mt-1">
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

export default Ticks
