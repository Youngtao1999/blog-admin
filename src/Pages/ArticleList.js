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
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button size="middle" style={{marginRight: 6}} onClick={() => updateArticle(record)}>
            修改
          </Button>
          <Button size="middle" danger onClick={() => deleteArticle(record)}>
            删除
          </Button>
        </div>
      ),
    },
  ]

  useEffect(() => {
    getList();
  }, [])

  // 获取列表
  const getList = () => {
    instance({
      method: "get",
      url: servicePath.getArticleList,
      withCredentials: true
    }).then(res => {
      const list = res.data.list;
      // list.forEach((item, index) =>{
      //   item.addDate = item.addDate.substring(0,10);
      //   item.key = index;
      // })
      setList(list);
    })
  }
  // 删除文章
  const deleteArticle = (record) => {
    const params = {
      id: record.id
    }
    confirm({
      title: "删除文章",
      content: "确定要删除这篇文章嘛？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        instance({
          method: "get",
          url: servicePath.delArticle,
          params,
          withCredentials: true
        }).then(res => {
          getList();
          message.success("删除成功");
        })
      },
      onCancel() {
        message.success("取消删除");
      }
    })
  }
  // 修改文章
  const updateArticle = (record) => {
    props.history.push("/index/add/"+record.id)
    const params = {
      id: record.id
    }
    instance({
      method: "get",
      url: servicePath.getArticleById,
      params,
      withCredentials: true
    })
  }

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