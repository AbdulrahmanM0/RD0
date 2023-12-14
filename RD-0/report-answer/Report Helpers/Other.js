import React, { useEffect, useState } from "react"
import { Button, Form, FormGroup, Col } from "reactstrap"
import AddARemove from "../Add several Tickets/AddARemove"

const OtherChoice = props => {
  const [answerIds, setAnswerIds] = useState([1])
  let initalAnswers = []
  if (props.LengthOfotherCheckbox) {
    for (let i = 1; i < props.LengthOfotherCheckbox; i++) {
      initalAnswers.push(i)
    }
  }
  props.LengthOfotherCheckbox &&
    useEffect(() => {
      setAnswerIds(initalAnswers)
    }, [props.LengthOfotherCheckbox])


  const [disabled, setDisabled] = useState(true)
  // console.log("Props",props.props.handleChange);

  return (
    <>
      <div className="mt-2">
        <input
          type="Checkbox"
          id="others"
          onClick={() => {
            setDisabled(!disabled)
          }}
        />
        <label forhtml="others" className="ms-1">
          {props.label}
        </label>
      </div>
      <div>
        {answerIds.map((id, key) => (
          <FormGroup key={key} className="d-flex">       
            <input
              disabled={disabled}
              onChange={props.props.handleChange}
              type="text"
              id="other"
              name={`${props.name}-${id}`}
              style={{ height: "24px" }}
              defaultValue={props.props.values[`${props.name}-${id}`]}
              className="me-5"
            />

            <AddARemove
              answerIds={answerIds}
              setAnswerIds={setAnswerIds}
              id={id}
              name={[`${props.name}-${id}`]}
              props={props.props}
            />
          </FormGroup>
        ))}
      </div>
    </>
  )
}

export default OtherChoice
