import React, { useState, useEffect } from "react"
import { Table, Modal, message, Button, Input, Image } from "antd"

import "../../static/css/ArticleList.css"
import instance from "../../api/axios"
import servicePath from "../../config/apiUrl"


const ArticleList = (props) => {
  const { confirm } = Modal;
  const { Search } = Input;

  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
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
      title: "封面",
      dataIndex: "image",
      key: "image",
      render: image => (
        <div>
          <Image
            className="list-image"
            src={image}
          />
        </div>
      )
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
    getList(title);
  }, [])

  // 获取列表
  const getList = (title) => {
    instance({
      method: "get",
      params: {title},
      url: servicePath.getArticleList,
      // withCredentials: true
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
          // withCredentials: true
        }).then(res => {
          getList(title);
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
      // withCredentials: true
    })
  }
  // 搜索文章
  const onSearch = (value) => {
    setTitle(value);
    getList(value);
  }

  return (
    <div>
      <Search
        className="search-input"
        placeholder="请输入标题"
        allowClear
        enterButton="搜索"
        size="middle"
        onSearch={onSearch}
      />
      <Table 
        dataSource={list}
        columns={columns}
        pagination={{defaultPageSize: 6}}
      />
    </div>
  )
  
}

export default ArticleList