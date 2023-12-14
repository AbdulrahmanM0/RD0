import axios from "axios"
import UnAuthorizedComponent from "common/UnAuthorizedComponent"
import EditProjectData from "pages/Projects/EditProjectData/EditProjectData"
import { convertPermission } from "permissionUtils"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Row } from "reactstrap"

const ProjectHeader = ({ projectID }) => {
  const history = useHistory()

  const [project, setProject] = useState()
  const [editing, setEditing] = useState(false)
  // console.log("project =========>", project)

  const [editModal, setEditModal] = useState(false)
  // console.log("editModal ==========>", editModal)

  const editToggle = () => {
    setEditModal(!editModal)
  }

  // **************** Permissions ******************************
  const userPermissions = convertPermission(
    JSON.parse(localStorage.getItem("roles"))
  )
  // console.log("userPermissions", userPermissions)

  // **************** Authorization ******************************
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    const formData = {
      PerToken: localStorage.getItem("token"),
      PerUserID: localStorage.getItem("id"),
      PerRoleID: localStorage.getItem("userRoleID"),
      ProjectID: projectID,
    }
    axios
      .post("https://test.cpvarabia.com/api/ProjectsView", formData)
      .then(res => {
        if (res.data.error === true && res.data.message === "Access denied!") {
          setAuth(true)
          setTimeout(() => {
            history.push("/logout")
            setTimeout(() => {
              history.push("/login")
            }, 1000)
          }, 4000)
        }

        // console.log("res", Object.entries(res.data)[0][1])
        setProject(Object.entries(res.data)[0][1])
      })
      .catch(err => console.log(err))
  }, [editing])

  // Access denied !!
  if (auth) {
    return <UnAuthorizedComponent />
  }

  return (
    <div className="pb-4 px-4">
      <Row>
        <div className="col-4 my-2">
          <h5>
            <span style={{ fontWeight: "700" }}>Reference No : </span>
            {project?.ReferenceNo}
          </h5>
        </div>
        <div className="col-4 my-2">
          <h5>
            <span style={{ fontWeight: "700" }}>Region : </span>
            {project?.CityNameEN}
          </h5>
        </div>
        <div className="col-4 my-2">
          <h5>
            <span style={{ fontWeight: "700" }}>Soil Reports : </span>
            {project?.Soil || "not found"}
          </h5>
        </div>
        <div className="col-8 my-2">
          <h5>
            <span style={{ fontWeight: "700" }}>Project Total Cost : </span>
            SAR {project?.Cost}
          </h5>
        </div>
        <div className="col-4 my-2 d-flex justify-content-center">
          <Button
            color="danger"
            onClick={() => editToggle()}
            disabled={
              userPermissions.R7.P !== "3" && userPermissions.R7.P !== "4"
            }
          >
            Edit Project Data
          </Button>
        </div>
      </Row>

      <hr style={{ backgroundColor: "gray", height: "1px" }} />
      {editModal && (
        <EditProjectData
          editToggle={editToggle}
          project={project}
          editing={editing}
          setEditing={setEditing}
          setAuth={setAuth}
        />
      )}
    </div>
  )
}

export default ProjectHeader
