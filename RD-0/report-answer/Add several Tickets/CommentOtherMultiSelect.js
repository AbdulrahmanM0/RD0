import React, { useEffect } from "react"
import { Input, Col } from "reactstrap"

function CommentOtherMultiSelect(props) {
  let NumberOfComments = [0]

  for (let index = 1; index < props.commentsNumber; index++) {
    NumberOfComments.push(index)
  }

  return (
    <div className={props.classNameDiv}>
      <Col
        sm={props.userSelect ? 6 : 12}
        className={props.userSelect && " me-2"}
      >
        {NumberOfComments.map(
          (number, key) =>
            number < 2 && (
              <div>
                <Input
                  key={key}
                  className={props.className}
                  type="textarea"
                  id={props.name}
                  name={
                    props.commentsNumber == "4"
                      ? number === 0
                        ? `${props.AnswerType}${props.QID}-Answer${props.id}`
                        : number === 1 &&
                          `${props.AnswerType}${props.QID}-Term${props.id}`
                      : number === 0
                      ? `${props.AnswerType}${props.QID}-Answer${props.id}`
                      : number === 1 &&
                        `${props.AnswerType}${props.QID}-AnswerAR${props.id}`
                  }
                  onChange={props.props.handleChange}
                  onBlur={props.handleBlur}
                  placeholder={
                    props.commentsNumber == "4"
                      ? number === 0
                        ? "Comment(en)" + props.id
                        : number === 1 && "Corrective(en)" + props.id
                      : number === 0
                      ? "Note(en)" + props.id
                      : "Note(Ar)" + props.id
                  }
                  style={{ height: "30px" }}
                  value={
                    props.commentsNumber == "4"
                      ? number === 0
                        ? props.props.values[
                            `${props.AnswerType}${props.QID}-Answer${props.id}`
                          ]
                        : number === 1 &&
                          props.props.values[
                            `${props.AnswerType}${props.QID}-Term${props.id}`
                          ]
                      : number === 0
                      ? props.props.values[
                          `${props.AnswerType}${props.QID}-Answer${props.id}`
                        ]
                      : number === 1 &&
                        props.props.values[
                          `${props.AnswerType}${props.QID}-AnswerAR${props.id}`
                        ]
                  }
                />
                {/* error */}
                {props.commentsNumber == "4" ? (
                  number === 0 ? (
                    props.props.errors[
                      `${props.AnswerType}${props.QID}-Answer${props.id}`
                    ] ? (
                      <div className="error mb-2">
                        {
                          props.props.errors[
                            `${props.AnswerType}${props.QID}-Answer${props.id}`
                          ]
                        }
                      </div>
                    ) : null
                  ) : (
                    number === 1 &&
                    (props.props.errors[
                      `${props.AnswerType}${props.QID}-Term${props.id}`
                    ] ? (
                      <div className="error mb-2">
                        {
                          props.props.errors[
                            `${props.AnswerType}${props.QID}-Term${props.id}`
                          ]
                        }
                      </div>
                    ) : null)
                  )
                ) : props.props.errors[
                    `${props.AnswerType}${props.QID}-Answer${props.id}`
                  ] ? (
                  <div className="error mb-2">
                    {
                      props.props.errors[
                        `${props.AnswerType}${props.QID}-Answer${props.id}`
                      ]
                    }
                  </div>
                ) : null}
              </div>
            )
        )}
      </Col>
      {/* left column */}
      <Col sm={props.userSelect ? 6 : 12}>
        {NumberOfComments.map(
          (number, key) =>
            number >= 2 && (
              <div>
                <Input
                  key={key}
                  className={props.className}
                  type="textarea"
                  id={props.name}
                  name={
                    props.commentsNumber == "4" &&
                    (number === 2
                      ? `${props.AnswerType}${props.QID}-AnswerAR${props.id}`
                      : number === 3 &&
                        `${props.AnswerType}${props.QID}-TermAR${props.id}`)
                  }
                  onChange={props.props.handleChange}
                  onBlur={props.handleBlur}
                  placeholder={
                    props.commentsNumber == "4"
                      ? number === 2
                        ? "Comment(Ar)" + props.id
                        : number === 3 && "Corrective(Ar)" + props.id
                      : "Note" + props.id
                  }
                  value={
                    props.commentsNumber == "4"
                      ? number === 2
                        ? props.props.values[
                            `${props.AnswerType}${props.QID}-AnswerAR${props.id}`
                          ]
                        : number === 3 &&
                          props.props.values[
                            `${props.AnswerType}${props.QID}-TermAR${props.id}`
                          ]
                      : props.props.values[
                          `${props.AnswerType}${props.QID}-Answer${props.id}`
                        ]
                  }
                  style={{ height: "30px" }}
                />
                {/* error */}
                {props.commentsNumber == "4" &&
                  (number === 2 ? (
                    props.props.errors[
                      `${props.AnswerType}${props.QID}-AnswerAR${props.id}`
                    ] ? (
                      <div className="error mb-2">
                        {
                          props.props.errors[
                            `${props.AnswerType}${props.QID}-AnswerAR${props.id}`
                          ]
                        }
                      </div>
                    ) : null
                  ) : (
                    number === 3 &&
                    (props.props.errors[
                      `${props.AnswerType}${props.QID}-TermAR${props.id}`
                    ] ? (
                      <div className="error mb-2">
                        {
                          props.props.errors[
                            `${props.AnswerType}${props.QID}-TermAR${props.id}`
                          ]
                        }
                      </div>
                    ) : null)
                  ))}
              </div>
            )
        )}
      </Col>
    </div>
  )
}

export default CommentOtherMultiSelect
