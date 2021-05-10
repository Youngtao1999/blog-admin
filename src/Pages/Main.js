import React from "react"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import "antd/dist/antd.css"

import Login from "./Login"
import AdminIndex from "./AdminIndex"
import UploadImg from "../compontents/UploadImg"

const Main = () => {
  return (
    <Router>
      <Route path="/" exact render={()=> (<Redirect to="/login"/>)} />
      <Route path="/login" exact component={Login} />
      <Route path="/index" component={AdminIndex} />
      <Route path="/upload" component={UploadImg} />
    </Router>
  )
}

export default Main;
