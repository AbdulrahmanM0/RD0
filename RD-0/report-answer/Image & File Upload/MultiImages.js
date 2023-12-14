import React, { useState } from "react"
import { Button, Input, Modal } from "reactstrap"
import axios from "axios"
import ImagePicker from "./ImagePicker"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useHistory } from "react-router-dom"

function MultiImages(props) {
  const history = useHistory()

  const [percentage, setPercentage] = useState()

  const [error, setError] = useState(false)
  const limitedsize = 10 * 1000 * 1024
  const [file, setFile] = useState()
  const [pdfImages, setPdfImages] = useState([null])
  const [viewImages, setViewImages] = useState(false)
  const toggleViewImages = () => {
    setViewImages(!viewImages)
  }
  async function handledata(data) {
    let Dataimages = []
    await data.forEach(item => {
      if ((item[0] != "Count") & (item[0] != "error")) {
        Dataimages.push(item[1])
      }
    })
    return Dataimages
  }
  const handleClick = getFile => {
    if (!getFile || getFile.size > limitedsize) {
      setError(true)
      // e.preventDefault()
    } else {
      console.log(getFile)
      setError(false)

      // setResponse(false)
      const data = new FormData()

      data.append("PerToken", localStorage.getItem("token"))
      data.append("PerUserID", localStorage.getItem("id"))
      data.append("PerRoleID", localStorage.getItem("userRoleID"))
      data.append("StageID", "10")

      for (let i = 0; i < getFile.length; i++) {
        data.append("file[]", getFile[i])
      }
      axios
        .post("https://test.cpvarabia.com/api/UploadImages", data, {
          onUploadProgress: data => {
            setPercentage(Math.round((data.loaded / data.total) * 100))
          },
        })
        .then(res => {
          if (
            res.data.error === true &&
            res.data.message === "Access denied!"
          ) {
            props.setAuth(true)
            setTimeout(() => {
              history.push("/logout")
              setTimeout(() => {
                history.push("/login")
              }, 1000)
            }, 4000)
          }

          res.data &&
            (handledata(Object.entries(res.data)).then(res => {
              setPdfImages(res)
            }),
            toggleViewImages())
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <div className="d-flex">
      <div className="form-group ">
        <Input
          multiple
          type="file"
          id="multiImages"
          name="multiImages"
          onChange={e => {
            setFile(e.target.files)
            handleClick(e.target.files)
            props.props.handleChange(props.name)(props.imagesUpload)
          }}
          accept="image/*"
        />
        {error && (
          <p className="error d-block">Please select a file less than 10MB.</p>
        )}
      </div>
      {/* <div>
        <Button
          type="button"
          onClick={e => handleClick(e)}
          className="btn btn-danger btn-block mx-2"
        >
          Upload 
        </Button>
      </div> */}
      {percentage && (
        <div style={{ width: "50px", height: "50px" }} className="me-2 ms-2">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({ textSize: "26px" })}
          />
        </div>
      )}

      {pdfImages && (
        <Modal
          isOpen={viewImages}
          toggle={toggleViewImages}
          className="modal-lg"
        >
          <ImagePicker
            target={"Image"}
            pdfImages={pdfImages}
            toggleViewImages={toggleViewImages}
            props={props.props}
            value={props.value}
            setAuth={props.setAuth}
          />
        </Modal>
      )}
    </div>
  )
}

export default MultiImages
