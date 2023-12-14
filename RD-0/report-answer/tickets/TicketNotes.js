import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom/cjs/react-router-dom.min"
import {
  Container,
  Col,
  Row,
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  UncontrolledTooltip,
} from "reactstrap"
import classnames from "classnames"
import axios from "axios"
import ConfirmingAction from "common/ConfirmingAction"
// import { all } from "redux-saga/effects"

const CommentBox = ({ ticketControlled, togglEditing }) => {
  const [commentValue, setCommetValue] = useState()

  const textField = useRef()
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageValue, setImageValue] = useState(null)
  const [isdisable, setDisable] = useState(false)

  const saveComment = () => {
    let formData = new FormData()

    formData.append("PerToken", localStorage.getItem("token"))
    formData.append("PerUserID", localStorage.getItem("id"))
    formData.append("PerRoleID", localStorage.getItem("userRoleID"))
    formData.append("TicketID", ticketControlled.TicketID)
    formData.append("Ntext", textField.current.value)
    formData.append("Nimg", imageValue)

    formData.append("View", "")

    axios
      .post(`https://test.cpvarabia.com/api/TicketNote.php`, formData)
      .then(res => {
        console.log(res), togglEditing()
        textField.current.value = ""
        setSelectedImage(null)
      })
      .catch(err => {
        console.log(err)
      })
  }

  //  img upload
  const handleImageChange = event => {
    event.preventDefault()
    let reader = new FileReader()
    let file = event.target.files[0]
    setImageValue(event.target.files[0])
    reader.onloadend = () => {
      setSelectedImage(reader.result)
      setDisable(true)
    }
    reader.readAsDataURL(file)
  }
  return (
    <div className="">
      {selectedImage && (
        <div className="replymessage-block mb-0 d-flex align-items-start">
          <div className="flex-grow-1">
            <img
              src={selectedImage}
              alt="select img"
              style={{ width: "150px", height: "auto" }}
            />
          </div>
          <div className="flex-shrink-0">
            <button
              type="button"
              id="close_toggle"
              className="btn btn-sm btn-link mt-n2 me-n3 fs-18"
              onClick={() => setSelectedImage(null)}
            >
              <i className="bx bx-x align-middle"></i>
            </button>
          </div>
        </div>
      )}
      <div className="p-3 chat-input-section">
        <Row>
          <Col>
            <div className="position-relative">
              <input
                ref={textField}
                type="text"
                // value={commentValue}
                // onKeyPress={onKeyPress}
                onChange={e => {
                  setCommetValue(e.target.value)
                  setDisable(true)
                }}
                className="form-control chat-input"
                placeholder="Enter Message..."
              />
              <div className="chat-input-links">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">
                    <label
                      htmlFor="imageInput"
                      style={{ color: "#556ee6", fontSize: 16 }}
                    >
                      <i
                        className="mdi mdi-file-image-outline me-1"
                        id="Imagetooltip"
                      />
                      <UncontrolledTooltip
                        placement="top"
                        target="Imagetooltip"
                      >
                        Images
                      </UncontrolledTooltip>
                    </label>
                    <input
                      type="file"
                      id="imageInput"
                      className="d-none"
accept="image/*"
                      onChange={handleImageChange}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col className="col-auto">
            <Button
              type="button"
              color="primary"
              disabled={!isdisable}
              onClick={() =>
                (textField.current.value || imageValue) && saveComment()
              }
              className="btn btn-primary btn-rounded chat-send w-md "
            >
              <span className="d-none d-sm-inline-block me-2">Send</span>{" "}
              <i className="mdi mdi-send" />
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const CommentItem = ({ comments, togglEditing, ticketControlled }) => {
  const Delete = TNID => {
    let formData = new FormData()

    formData.append("PerToken", localStorage.getItem("token"))
    formData.append("PerUserID", localStorage.getItem("id"))
    formData.append("PerRoleID", localStorage.getItem("userRoleID"))
    formData.append("TNID", TNID)

    // Nimg:"",
    // TNID:"",

    axios
      .post(`https://test.cpvarabia.com/api/TicketNote.php`, formData)
      .then(res => {
        console.log(res), togglEditing()
        textField.current.value = ""
      })
      .catch(err => {
        console.log(err)
      })
  }
  const [ConfirmeModel, setConfirmeModel] = useState(false)
  const Confirmetoggle = () => {
    setConfirmeModel(!ConfirmeModel)
  }
  return comments.map((comment, key) => (
    <div
      className={"d-flex py-1 border-bottom my-1  "}
      style={{
        backgroundColor: "#f3f3f9",
        borderRadius: "25px",
        width: "fit-content",
        blockSize: "fit-content",
      }}
      key={key}
    >
      <div className="flex-grow-1 ms-3 p-1 mx-2">
        <span
          className="mb-1 font-size-12  text-primary d-block"
          style={{ fontWeight: "600" }}
        >
          {comment.UserName}
        </span>
        {comment.Nimg && (
          <div className="flex-grow-1">
            <img
              src={comment.Nimg}
              alt="select img"
              style={{ width: "150px", height: "auto" }}
            />
          </div>
        )}
        <span className="text-muted ms-2">{comment.Ntext}</span>

        <div className="text-muted font-size-12 ms-2">
          <i className="far fa-calendar-alt text-primary me-1 mt-1" />
          {comment.CreatedAt}
        </div>
      </div>
      <Link
        to="#"
        onClick={() => {
          Delete(comment.TNID)
        }}
        className="d-flex  text-danger align-items-center me-1"
      >
        <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
        <UncontrolledTooltip placement="top" target="deletetooltip">
          Delete
        </UncontrolledTooltip>
      </Link>
      {ConfirmeModel && (
        <ConfirmingAction
          confirmFunc={Delete(comment.TNID)}
          action={"delete"}
          Confirmetoggle={Confirmetoggle}
          ConfirmeModel={ConfirmeModel}
          massege={"Are you sure you want to delete this comment"}
        />
      )}
    </div>
  ))
}

function TicketNotes({ ticketControlled }) {
  const [comment, setComment] = useState([])

  const [edite, setEdit] = useState(false)
  const togglEditing = () => {
    setEdit(!edite)
  }
  useEffect(() => {
    let formData = new FormData()
    formData.append("PerToken", localStorage.getItem("token"))
    formData.append("PerUserID", localStorage.getItem("id"))
    formData.append("PerRoleID", localStorage.getItem("userRoleID"))
    formData.append("TicketID", ticketControlled.TicketID)
    formData.append("View", "1")

    axios
      .post(`https://test.cpvarabia.com/api/TicketNote.php`, formData)
      .then(response => {
        let array = []
        Object.entries(response.data).forEach(comment => {
          return comment[1].UserID && array.push(comment[1])
        })
        setComment(array)
      })
      .catch(error => {})
  }, [edite])

  return (
    <div className=" mx-5" id="recent-list">
      <CommentItem
        comments={comment}
        togglEditing={togglEditing}
        ticketControlled={ticketControlled}
      />

      <CommentBox
        ticketControlled={ticketControlled}
        togglEditing={togglEditing}
      />
      {/* <div className="d-flex  ">
        <Col sm={4}>
          <div className="d-flex">
            <Input
              onChange={e => setFieldValue(`image`, e.target.files[0])}
              type="file"
              name={`image`}
              id={"1"}
              className="me-1"
              accept="image/*"
            />
          </div>
        </Col>
      </div> */}
    </div>
  )
}

export default TicketNotes
