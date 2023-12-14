import React, { useState } from "react"
import { FormGroup } from "reactstrap"
import Select from "react-select"

function MultiSelectInspection(props) {
  const customStyles = {
    control: base => ({
      ...base,
      maxMenuHeight: 30,
    }),
  }
  let Options = [{ label: "-select-", value: "" }]

  function createSelectOptions(data, optionArray) {
    data.forEach(Option => {
      Option[1].ResourceID
        ? optionArray.push({
            label: Option[1].Name,
            value: Option[1].ResourceID,
          })
        : optionArray.push({ label: Option[1].Name, value: Option[1].DegreeID })
    })
  }
  let selectedValues = []
  let [arrayOfValues, setArrayOfValues] = useState([])
  arrayOfValues.forEach(item => {
    selectedValues.push(item.value)
  })

  const getValue = (Options, initialValue) => {
    if (Options) {
      return props.isMulti
        ? Options.filter(
            option => initialValue && initialValue.indexOf(option.value) >= 0
          )
        : Options.find(option => option.value === initialValue)
    } else {
      return props.isMulti ? [] : ""
    }
  }

  createSelectOptions(props.data, Options)
  return (
    <FormGroup className={props.className}>
      <Select
        isDisabled={props.disabled}
        isMulti={props.isMulti}
        placeholder={props.title}
        styles={customStyles}
        name={props.name}
        options={Options}
        id={props.name}
        sm={10}
        value={getValue(Options, props.props.values[props.name + props.id])}
        onChange={e => (
          !props.isMulti
            ? (props.props.handleChange(props.name + props.id)(e.value),
              props.setValue(e.value))
            : props.props.setFieldValue(
                props.name + props.id,
                e ? e.map(item => item.value) : []
              ),
          props.setValue(e)
        )}
      />
    </FormGroup>
  )
}

export default MultiSelectInspection
