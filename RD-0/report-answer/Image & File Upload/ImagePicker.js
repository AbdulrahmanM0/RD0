import axios from "axios"
import React, { useState, useEffect } from "react"
import { Container, Button, FormGroup } from "reactstrap"
import FormUpload from "./FormUpload"
import { submit } from "redux-form"

function ImagePicker(props) {
  // add
  const [otherImages, setOtherImages] = useState([])
  const [dropzone, setDropzone] = useState(false)
  const  [selectedFiles , setSelectedFiles] = useState([])
  const toggleDropzone = () => {
    setDropzone(true)
  }
  // end of add
  const onClose = () => {
    props.toggleViewImages()
    setDeleteImages([...allImages])
    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      ...deletedImagesobject,
      StageID: "10",
    }
    axios
      .post("https://test.cpvarabia.com/api/DeleteFile", formData)
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
      })
      .catch(err => {
        console.log(err)
      })
  }
  const [deletedImages, setDeleteImages] = useState([])
  const [allImages, setAllImages] = useState([...props.pdfImages])

  useEffect(() => {
    setAllImages([...otherImages, ...allImages])
  }, [otherImages])

  const handleClick = async source => {
    const check = allImages.includes(source)
    if (check) {
      setDeleteImages([...deletedImages, source])
      const id = allImages.indexOf(source)
      let newArr = allImages
      newArr.splice(id, 1)
      setAllImages([...newArr])
      selectedFiles([...newArr])
    } else {
      allImages.push(source)
      setAllImages([...allImages])
      selectedFiles([...allImages])
    }
  }
  console.log(allImages)

  let deletedImagesobject = { FileName: deletedImages, Target: props.target }

  // submit
  const onsubmit = () => {
    props.props.setFieldValue(props.value, allImages)
    sendFiles()
    console.log()
    onClose('submit',props.value, allImages)
    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      ...deletedImagesobject,
      StageID: "10",
    }
    axios
      .post("https://test.cpvarabia.com/api/DeleteFile", formData)
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
      })
      .catch(err => {
        console.log(err)
      })
  }

  // drop and drag
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropzone(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropzone(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    console.log(files)
    const newImages = files.map((file) => URL.createObjectURL(file));
    setOtherImages([...otherImages, ...newImages]);
    setDropzone(false);
    console.log(otherImages)
  
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles,...files])
    const newImages = files.map((file) => URL.createObjectURL(file));
    setOtherImages([...otherImages, ...newImages]);
  };

  // handle paste image
  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
  
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        const file = new File([blob], 'pasted-file.png', { type: blob.type });
        handleFileChange({ target: { files: [file] } });
      }
    }
  };
  
  document.addEventListener('paste', handlePaste);

  // send files
  function sendFiles () {
    console.log('works')
    console.log(selectedFiles)
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
          })
         )
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <Container>
      <div className="m-auto d-inline-block">
        <div className="m-auto mt-3 d-flex flex-wrap" style={{width:'684px'}}>
          {props.pdfImages.map((data, index) => (
            <div key={index} className="d-flex justify-content-around">
              <div
                className={`img-card mx-2 position-relative ${
                  allImages.includes(data)
                    ? "border border-2 border-primary mt-2 shadow-lg p-1 mb-1 bg-body-blue rounded"
                    : "border border-2 border-light mt-2 p-1 mb-1 bg-body-secondary rounded"
                } `}
                onClick={() => handleClick(data)}
              >
                <img
                  style={{ width: "200px", height: "200px" }}
                  thumbnail
                  src={data}
                />
                {allImages.includes(data) ? (
                  <div className="img-checked">
                    <i
                      className="bx bxs-check-circle bx-sm position-absolute"
                      style={{ color: "blue" , top: '5px' , right: '5px'}}
                    ></i>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {otherImages.map((data, index) => (
            <div ms={5} key={index} className="d-flex justify-content-around">
              <div
                className={`img-card mx-2 ${
                  allImages.includes(data)
                    ? "border border-2 border-primary mt-2 shadow-lg p-1 mb-1 bg-body-blue rounded"
                    : null
                } `}
                onClick={() => handleClick(data)}
              >
                <img
                  style={{ width: "200px", height: "200px" }}
                  thumbnail
                  src={data}
                />
                {allImages.includes(data) ? (
                  <div className="img-checked">
                    <i
                      className="bx bxs-check-circle bx-sm "
                      style={{ color: "blue" }}
                    ></i>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-around">
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              onPaste={handlePaste}
            />
            <label
              htmlFor="fileInput"
              className={`new-image-picker d-flex justify-content-center align-items-center mx-2 mt-2 p-1 mb-1 rounded ${
                dropzone ? 'dropzone-active' : ''
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <i className="bx bx-plus-circle"></i>
            </label>
          </div> 
        </div>  
      </div>
      <FormGroup className="d-flex ms-auto col-6 mt-5 justify-content-around">
        <Button
          onClick={() => {
            onClose()
          }}
          className="bg-primary me-2"
        >
          close
        </Button>

        <Button
          type="button"
          onClick={() => {
            onsubmit()
          }}
          className=" me-2 bg-primary"
        >
          Submit
        </Button>
        {/* <Button onClick={toggleDropzone}>add</Button> */}
      </FormGroup>
    </Container>
  )
}

export default ImagePicker
