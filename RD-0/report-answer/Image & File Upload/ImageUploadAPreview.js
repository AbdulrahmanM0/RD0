import React, { useState } from "react"
import { Button, Input, Modal } from "reactstrap"
import axios from "axios"
import ImagePicker from "./ImagePicker"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useHistory } from "react-router-dom"

function ImageUploadAPreview(props) {
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
  const handleClick = (getFile) => {
    console.log('handleClick',getFile)
    if (!getFile || getFile.size > limitedsize) {
      setError(true)
      // e.preventDefault()
    } else {
      setError(false)
      const formData = new FormData()

      formData.append("PerToken", localStorage.getItem("token"))
      formData.append("PerUserID", localStorage.getItem("id"))
      formData.append("PerRoleID", localStorage.getItem("userRoleID"))
      formData.append("PDF", getFile)
      // setResponse(false)
      axios
        .post("https://test.cpvarabia.com/api/PDFTOIMG", formData, {
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
          // setResponse(true)
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
          type="file"
          id="PDF"
          name="PDF"
          onChange={(e) => {
            setFile(e.target.files[0])
            handleClick(e.target.files[0])
            props.props.handleChange(props.name)(props.imagesUpload)
          }}
          accept=".pdf"
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
        <div style={{ width: "50px", height: "50px" }} className="me-3 ms-3">
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
            target={"PDF"}
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

export default ImageUploadAPreview
