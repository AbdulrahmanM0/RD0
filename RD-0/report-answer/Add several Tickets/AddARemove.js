import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { FormGroup, Col } from "reactstrap"

const AddARemove = props => {
  const addAnswer = () => {
    let lastId = props.answerIds[props.answerIds.length - 1]
    let temp = lastId + 1
    props.setAnswerIds([...props.answerIds, temp])
  }

  const removeAnswer = itemId => {
    const index = props.answerIds.indexOf(itemId)
    let tempAnswerIds = [...props.answerIds]

    // make sure the item is not the first one
    tempAnswerIds.splice(index, 1)
    props.setAnswerIds(tempAnswerIds)
  }

  return (
    <FormGroup className="d-flex ">
      <Col className="d-flex  justify-content-around">
        <Link
          to="#"
          onClick={() => {
            addAnswer()
          }}
          className="p-0 me-3 "
        >
          <i className="mdi mdi-plus font-size-14" id="edittooltip" />
        </Link>

        <Link
          to="#"
          onClick={() => {
            if (props.answerIds.length > 1) {
              removeAnswer(props.id)

              props.name.forEach(el => {
                delete props.props.values[`${el}`]
              })
            }
          }}
          className="p-1 py-0 col-2"
        >
          <i className="mdi mdi-minus font-size-8" id="edittooltip" />
        </Link>
      </Col>
    </FormGroup>
  )
}

export default AddARemove
