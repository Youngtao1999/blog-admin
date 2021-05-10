import React, { useState, useEffect, createContext } from "react"
import { Row, Col, Avatar, Divider, Popover, Image, Form, Input, Button, Modal, message } from "antd"
import {
  GithubOutlined,
  QqOutlined,
  WechatOutlined,
  NotificationTwoTone
} from '@ant-design/icons';

import UploadImg from "../../compontents/UploadImg"
import servicePath, { fallback } from "../../config/apiUrl"
import instance from "../../api/axios"
import "../../static/css/ManageInfo.css"

export const imgContext = createContext();

const ManageInfo = (props) => {

  const {confirm} = Modal;
  
  const [logo, setLogo] = useState();
  const [slogan, setSlogan] = useState();
  const [avatar, setAvatar] = useState();
  const [introduce, setIntroduce] = useState();
  const [github, setGithub] = useState();
  const [qq, setQq] = useState();
  const [wechat, setWechat] = useState();
  const [notice, setNotice] = useState();

  useEffect(() => {
    fetchData();
  }, [])

  // 获取个人信息
  const fetchData = async () => {
    instance({
      method: 'get',
      url: servicePath.getLogoAvatar
    }).then(res =>{
      const info = res.data.data[0];
      setLogo(info.logo);
      setSlogan(info.slogan);
      setAvatar(info.avatar);
      setIntroduce(info.introduce);
      setGithub(info.github.split(".com/")[1]);
      setQq(info.qq);
      setWechat(info.wechat);
      setNotice(info.notice);

    }).catch(err => { // token验证失败
      message.error("用户未登录");
      setTimeout(() => {
        props.history.push("/login");
      }, 2000);
    }) 
  }
  // 修改个人信息
  const changeInfo = (props) => {
    const params = {
      logo, 
      slogan, 
      avatar, 
      introduce, 
      github: `https://github.com/${github}`,
      qq, 
      wechat, 
      notice //19873738160
    }
    confirm({
      title: "更新信息",
      content: "确定要更新相关信息嘛？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        instance({
          method: "post",
          url: servicePath.updateInfo,
          data: params
          // withCredentials: true
        }).then(res => {
          if(res.data.success) {
            message.success("更新成功");
            fetchData();
          }
        })
      },
      onCancel() {
        message.success("取消提交");
      }
    })
  }
  // QQ图片
  const qqContent = (
    <div>
      <Image width={100} src={qq}/>
    </div>
  )
  // 微信图片
  const wechatContent = (
    <div>
      <Image width={100} src={wechat}/>
    </div>
  )

  return (
    <div>
      <Row>
        <Col span={8}>
          <Form
            labelCol={{ span: 6 }}
          >
            <Form.Item label="Logo">
              <Input 
                maxLength={6}
                value={logo} 
                onChange={(e) => setLogo(e.target.value)} 
              />
            </Form.Item>
            <Form.Item label="标语">
              <Input 
                maxLength={12}
                value={slogan} 
                onChange={(e) => setSlogan(e.target.value)} 
              />
            </Form.Item>
            <Form.Item label="简介">
              <Input 
                maxLength={20}
                value={introduce} 
                onChange={(e) => setIntroduce(e.target.value)} 
              />
            </Form.Item>
            <Form.Item label="github">
              <Input 
                value={github} 
                onChange={(e) => setGithub(e.target.value)} 
              />
            </Form.Item>
            <Form.Item label="公告">
              <Input 
                onChange={(e) => setNotice(e.target.value)} 
                value={notice}
              />
            </Form.Item>
            <Form.Item className="img-form">
              <div className="img-info">
                <Image
                    className="image-info"
                    width={100}
                    src={avatar}
                    fallback={fallback}
                />
                <imgContext.Provider value="头像">
                  <UploadImg setImgUrl={setAvatar} />
                </imgContext.Provider>
                {/* <Button>头像</Button> */}
              </div>
              <div className="img-info">
                <Image
                    width={100}
                    src={qq}
                    fallback={fallback}
                />
                <imgContext.Provider value="QQ">
                  <UploadImg setImgUrl={setQq} />
                </imgContext.Provider>
                {/* <Button>QQ</Button> */}
              </div>
              <div className="img-info">
                <Image
                    width={100}
                    src={wechat}
                    fallback={fallback}
                />
                <imgContext.Provider value="微信">
                  <UploadImg setImgUrl={setWechat} />
                </imgContext.Provider>
                {/* <Button>微信</Button> */}
              </div>
            </Form.Item>
            <Form.Item>
              <Button className="commit-btn" type="primary" onClick={changeInfo}>提交</Button>
            </Form.Item>
          </Form>
        </Col>
        {/* 中间 */}
        <Col span={6} className="center-box" offset={1}>
          <Row>
            <Col span={24} className="info-header">
              <span className="header-logo">{logo}</span>
              <span className="header-txt"> {slogan} </span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="author-div comm-box">
                <div>
                  <Avatar size={100} src={avatar} />
                </div>
                <div className="author-intr">
                  {introduce}
                  <Divider>社交账号</Divider>
                  <a href={`https://github.com/${github}`} target="_blank" className="github" rel="noopener noreferrer">
                    <GithubOutlined className="account" />
                  </a>
                  <Popover content={qqContent} trigger="hover">
                    <QqOutlined className="account qq" />
                  </Popover>
                  <Popover content={wechatContent} trigger="hover">
                    <WechatOutlined className="account wechat" />
                  </Popover>
                </div>
              </div>
              <div className="notice-nav comm-box">
                <div className="notice-logo"><NotificationTwoTone twoToneColor="#eb2f96"/>公告</div>
                <div>{notice}</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default ManageInfo