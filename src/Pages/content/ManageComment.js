import React, { useState, useEffect, createContext } from "react"
import { Space, Table, Badge, Switch, Tooltip, Tag, Button, Modal, message } from "antd"
import {
  LikeTwoTone,
  DeleteTwoTone
} from '@ant-design/icons';

import servicePath from "../../config/apiUrl"
import instance from "../../api/axios"
import "../../static/css/ManageComment.css"

const ManageComment = () => {
  const { confirm } = Modal;

  useEffect(() => {
    getCommentList();
  }, [])
  // 获取评论列表
  const getCommentList = () => {
    instance({
      method: 'get',
      url: servicePath.getCommentsList
    }).then(res => {
      if(res.data.success) {
        setCommentData(res.data.data);
      }
    })
  }

  const [commentData, setCommentData] = useState([]);
  // 回复字段
  const expandedRowRender = (records) => {
    const columns = [
      { title: '用户昵称', dataIndex: 'reply_userName', key: 'reply_userName' },
      { 
        title: '回复内容', 
        dataIndex: 'reply_content', 
        key: 'reply_content',
        onCell: () => {
          return {
            style: {
              maxWidth: 150,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow:'ellipsis',
              cursor:'pointer'
            }
          }
        },
        render: content => (
          <Tooltip placement="topLeft" title={content}>{content}</Tooltip>
        ) 
      }, 
      { title: '回复时间', dataIndex: 'reply_date', key: 'reply_date' },
      { 
        title: '类型', 
        dataIndex: 'type', 
        key: 'type',
        render: type => (
          <span>
            <Tag color={"green"} key={type}>
              回复
            </Tag>
          </span>
        ) 
      },
      { 
        title: '回复人', 
        dataIndex: 'from_name', 
        key: 'from_name',
        render: from => (
          <span className="from-name">{(from!=="null"&&from!==null) ? `@${from}` : ""}</span>
        ) 
      },
      { 
        title: '点赞数', 
        dataIndex: 'reply_likes', 
        key: 'reply_likes',
        render: likes => (
          <div>
            <LikeTwoTone twoToneColor="#52c41a" style={{marginRight: "2px"}} />{likes ? likes : 0}
          </div>
        )
      },
      {
        title: '状态',
        dataIndex: 'reply_state',
        key: 'reply_state',
        render: (state) => (
          <span>
            <Badge status={state === "block" ? "success" : "error"} />
            {state === "block" ? "显示" : "隐藏"}
          </span>
        ),
      },
      { 
        title: '操作', 
        dataIndex: 'reply_state',
        key: 'reply_state',
        render: (state, record) => (
          <div>
            <Switch
              defaultChecked={state === "block" ? true : false}
              onChange={() => changeReply(state, record)}
            />
            <Button 
              size="small" 
              danger 
              className="delete-btn" 
              onClick={() => deleteReply(record)}
            >删除</Button>
        </div>
        )
      },
    ];

    return <Table columns={columns} dataSource={records.reply} pagination={{defaultPageSize: 3}} />;
  };
  // 删除回复
  const deleteReply = (record) => {
    const params = {
      id: record.id
    }
    confirm({
      title: "删除评论",
      content: "确定要删除该回复吗？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        instance({
          method: "get",
          url: servicePath.delReply,
          params,
          // withCredentials: true
        }).then(res => {
          getCommentList()
          message.success("删除成功");
        })
      },
      onCancel() {
        message.success("取消删除");
      }
    })
  }
  // 控制评论显示隐藏
  const changeReply = (state, record) => {
    if(state === "block") {
      instance({
        method: 'post',
        url: servicePath.changeReplyState,
        data: {id: record.id, state: "none", date: record.reply_date}
      }).then(res =>{
        getCommentList();
      })
    }else if(state === "none") {
      instance({
        method: 'post',
        url: servicePath.changeReplyState,
        data: {id: record.id, state: "block", date: record.reply_date}
      }).then(res =>{
        getCommentList();
      })
    }
  }
  // 评论字段
  const columns = [
    { title: '用户昵称', dataIndex: 'comment_userName', key: 'comment_userName' },
    { 
      title: '评论内容', 
      dataIndex: 'comment_content', 
      key: 'comment_content',
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: content => (
        <Tooltip placement="topLeft" title={content}>{content}</Tooltip>
      ) 
    },
    { title: '评论时间', dataIndex: 'comment_date', key: 'comment_date' },
    { title: '博客', dataIndex: 'article_title', key: 'article_title' },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type',
      render: type => (
        <span>
          <Tag color={"geekblue"} key={type}>
            评论
          </Tag>
        </span>
      ) 
    },
    { 
      title: '回复数',
      dataIndex: 'reply',
      key: 'reply',
      render: reply => (
        <span>{reply.length}</span>
      )
    },
    { 
      title: '点赞数', 
      dataIndex: 'comment_likes', 
      key: 'comment_likes',
      render: likes => (
        <div>
          <LikeTwoTone twoToneColor="#eb2f96" style={{marginRight: "2px"}} />{likes ? likes : 0}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'comment_state',
      key: 'comment_state',
      render: (state) => (
        <span>
          <Badge status={state === "block" ? "success" : "error"} />
          {state === "block" ? "显示" : "隐藏"}
        </span>
      ),
    },
    { 
      title: '操作', 
      dataIndex: 'comment_state',
      key: 'comment_state',
      render: (state, record) => (
        <div>
          <Switch
            defaultChecked={state === "block" ? true : false}
            onChange={() => changeComment(state, record)}
          />
          <Button 
            size="small" 
            danger 
            className="delete-btn" 
            onClick={() => deleteComment(record)}
          >删除</Button>
        </div>
      )
    },
  ];

  // 控制评论显示隐藏
  const changeComment = (state, record) => {
    if(state === "block") {
      instance({
        method: 'post',
        url: servicePath.changeCommentState,
        data: {id: record.id, state: "none", date: record.comment_date}
      }).then(res =>{
        getCommentList();
      })
    }else if(state === "none") {
      instance({
        method: 'post',
        url: servicePath.changeCommentState,
        data: {id: record.id, state: "block", date: record.comment_date}
      }).then(res =>{
        getCommentList();
      })
    }
  }
  // 删除评论
  const deleteComment = (record) => {
    const params = {
      id: record.id
    }
    confirm({
      title: "删除评论",
      content: "确定要删除该评论及该评论的所有回复吗？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        instance({
          method: "get",
          url: servicePath.delComment,
          params,
          // withCredentials: true
        }).then(res => {
          getCommentList()
          message.success("删除成功");
        })
      },
      onCancel() {
        message.success("取消删除");
      }
    })
  }

  return (
    <div>
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandedRowRender={(record) => expandedRowRender(record)}
        dataSource={commentData}
        pagination={{defaultPageSize: 6}}
        rowKey={record => record.id}
      />
    </div>
  );
}

export default ManageComment