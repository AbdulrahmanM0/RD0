import React, { useEffect, useState } from "react"
import { Row, Col, Card, Form, CardBody, Container, Modal } from "reactstrap"
import Dropzone from "react-dropzone"
import LoadingComponent from "common/LoadingComponent"
import { Link, useHistory } from "react-router-dom"
import axios from "axios"

const FormUpload = props => {
  const history = useHistory()

  const [response, setResponse] = useState(true)

  const [dropzoneModal, setDropzone] = useState(true)
  const toggleDropzone = () => {
    setDropzone(!dropzoneModal)
  }
  //meta title
  document.title = "Form File Upload | Skote - React Admin & Dashboard Template"

  const [selectedFiles, setselectedFiles] = useState([])

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setselectedFiles([...selectedFiles, ...files])
  }
  const dropfile = file => {
    let temp = [...selectedFiles]
    const index = temp.indexOf(file)
    if (index > -1) {
      temp.splice(index, 1)
    }
    setselectedFiles([...temp])
  }
  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  async function handledata(data) {
    let Dataimages = []
    await data.forEach(item => {
      if (item[0] != "Count") {
        Dataimages.push(item[1])
      }
    })
    return Dataimages
  }
  const sendFiles = () => {
    setResponse(false)
    const data = new FormData()

    data.append("PerToken", localStorage.getItem("token"))
    data.append("PerUserID", localStorage.getItem("id"))
    data.append("PerRoleID", localStorage.getItem("userRoleID"))
    data.append("StageID", "10")

    for (let i = 0; i < selectedFiles.length; i++) {
      data.append("file[]", selectedFiles[i])
    }
    console.log(selectedFiles)

    axios
      .post("https://test.cpvarabia.com/api/UploadImages", data)
      .then(res => {
        if (res.data.error === true && res.data.message === "Access denied!") {
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
            props.setOtherImages(res)
          }),
          toggleDropzone())
        setResponse(true)
        props.setDropzone(false)
      })
      .catch(error => {
        console.log(error)
      })
  }
    const handlePaste = (event) => {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file") {
          const blob = item.getAsFile();
          const file = new File([blob], "pasted-file.png", { type: blob.type });
          handleAcceptedFiles([file]);
        }
      }
    };
    document.addEventListener("paste", handlePaste);

  return (
    // <Modal isOpen={dropzoneModal} className="modal-lg" toggle={toggleDropzone}>
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <h6 className="card-title">Dropzone</h6>

                  <Form>
                    <Dropzone
                      onDrop={acceptedFiles => {
                        handleAcceptedFiles(acceptedFiles)
                      }}
                      noKeyboard={false}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick mt-2"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <div className="mb-3">
                              <i className="display-4 text-muted bx bxs-cloud-upload" />
                            </div>
                            <h4>Drop files here or click to upload.</h4>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="dropzone-previews mt-3" id="file-previews">
                      {selectedFiles.map((f, i) => {
                        return (
                          <Card
                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                            key={i + "-file"}
                          >
                            <div className="p-2">
                              <Row
                                className="align-items-center"
                                style={{ height: "100px" }}
                              >
                                <Col className="col-4">
                                  <img
                                    data-dz-thumbnail=""
                                    style={{ height: "100%" }}
                                    className="avatar-xl rounded bg-light"
                                    alt={f.name}
                                    src={f.preview}
                                  />
                                </Col>
                                <Col>
                                  <Link
                                    to="#"
                                    className="text-muted font-weight-bold"
                                  >
                                    {f.name}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{f.formattedSize}</strong>
                                  </p>
                                </Col>
                                <Col className="col-2">
                                  <button
                                    type="button"
                                    className="btn-close position-absolute end-0 bottom-0 m-3"
                                    onClick={() => dropfile(f)}
                                  ></button>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </Form>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={sendFiles}
                    >
                      Send Files
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <LoadingComponent response={response} setResponse={setResponse} />
    </>
    //  </Modal> 
  )
}

export default FormUpload
