import React, { useState } from "react"
import { Card, Button, Input, Spin, message } from "antd"
import axios from "axios"
import {
  MehTwoTone,
  SmileTwoTone
} from "@ant-design/icons"

import "../static/css/Login.css"
import servicePath from "../config/apiUrl"

const Login = (props) => {

  const [ userName, setUserName ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ isLoading, setIsLoading ] = useState(false);

  const checkLogin = () => {
    if(!userName) {
      message.error("用户名不能为空");
      return false;
    }else if(!password) {
      message.error("密码不能为空");
      return false;
    }
    setIsLoading(true);
    let loginData = {
      "userName": userName,
      "password": password
    }

    const timer = setTimeout(() => {
      message.error("登录超时");
      setIsLoading(false);
    }, 5000)

    axios({
      method: "post",
      url: servicePath.login,
      data: loginData,
      withCredentials: true
    }).then(res => {
      if(res.data.data === "登录成功") {
        localStorage.setItem("openId", res.data.openId);
        props.history.push("/index");
        setIsLoading(false);
        clearTimeout(timer)
      }else {
        setIsLoading(false);
        message.error("用户名或密码错误");
        clearTimeout(timer)
      }
    })
  }

  return (
    <div className="login-div">
      <Spin 
        tip="加载中..."
        spinning={isLoading}
      >
        <Card 
          title="博客管理系统"
          bordered
          style={{width: 450}}
        >
          <Input
            className="card-item"
            id="userNmae"
            size="large"
            placeholder="请输入用户名"
            style={{width: 400, borderRadius: 6}}
            prefix={<MehTwoTone twoToneColor="#eb2f96" />}
            onChange={(e) => {setUserName(e.target.value)}}
          />
          <Input.Password
            className="card-item"
            id="password"
            size="large"
            placeholder="请输入密码"
            style={{width: 400, borderRadius: 6}}
            prefix={<SmileTwoTone twoToneColor="#52c41a" />}
            onChange={(e) => {setPassword(e.target.value)}}
          />
          <div className="card-item card-button">
            <Button 
              type="ghost"
              size="small"
              block
            >注册</Button>
            <Button 
              type="primary"
              size="small"
              block
              onClick={checkLogin}
            >登录</Button>
          </div>
        </Card>
      </Spin>
    </div>
  )
}

export default Login;