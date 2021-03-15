import React, { useState } from "react"
import { Card, Button, Input, Spin } from "antd"
import {
  MehTwoTone,
  SmileTwoTone
} from "@ant-design/icons"

import "../static/css/Login.css"

const Login = () => {

  const [ userName, setUserName ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ isLoading, setIsLoading ] = useState(false);

  const checkLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
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
            style={{width: 400}}
            prefix={<MehTwoTone twoToneColor="#eb2f96" />}
            onChange={(e) => {setUserName(e.target.value)}}
          />
          <Input.Password
            className="card-item"
            id="password"
            size="large"
            placeholder="请输入密码"
            style={{width: 400}}
            prefix={<SmileTwoTone twoToneColor="#52c41a" />}
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