import React, { useState } from "react"
import { Button, UncontrolledTooltip } from "reactstrap"
import PropTypes from "prop-types"
import { withRouter, Link } from "react-router-dom"

function HelpComponent(props) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const toggle = () => setTooltipOpen(!tooltipOpen)

  return (
    <>
      <Link
        to="#"
        onClick={e => {
          e.preventDefault()
        }}
      >
        <i
          className="bx bx-help-circle font-size-15"
          id={"Tooltip-" + props.id}
        ></i>
        <UncontrolledTooltip
          placement="right"
          isOpen={tooltipOpen}
          target={"Tooltip-" + props.id}
          toggle={toggle}
        >
          {props.Title}
        </UncontrolledTooltip>
      </Link>
    </>
  )
}


export default HelpComponent
