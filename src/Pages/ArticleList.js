import React, { useState, useEffect } from "react"
import { List, Table, Row, Col, Modal, message, Button } from "antd"

import instance from "../api/axios"
import servicePath from "../config/apiUrl"


const ArticleList = (props) => {
  const { confirm } = Modal;

  const [list, setList] = useState([]);
  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "类别",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "发布时间",
      dataIndex: "addDate",
      key: "addDate",
    },
    {
      title: "浏览量",
      dataIndex: "view_count",
      key: "view_count",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
    },
  ]

  return (
    <div>
      <Table 
        dataSource={list}
        columns={columns}
      />
    </div>
  )
  
}

export default ArticleList