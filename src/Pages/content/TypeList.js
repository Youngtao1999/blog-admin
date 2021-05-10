import React, { useState, useEffect } from "react"
import { Table, Modal, message, Button, Drawer, Input } from "antd"

import "../../static/css/TypeList.css"
import instance from "../../api/axios"
import servicePath from "../../config/apiUrl"


const ArticleList = () => {
  const { confirm } = Modal;
  const { TextArea } = Input;
  const { Column } = Table;

  const [list, setList] = useState([]);
  const [id, setId] = useState();
  const [typeName, setTypeName] = useState("");
  const [icon, setIcon] = useState("");
  const [isAdd, setIsAdd] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getTypeList();
  }, [])

  // 获取列表
  const getTypeList = () => {
    instance({
      method: "get",
      url: servicePath.getTypeInfo,
      // withCredentials: true
    }).then(res => {
      const list = res.data.data;
      
      // list.forEach((item, index) =>{
      //   item.addDate = item.addDate.substring(0,10);
      //   item.key = index;
      // })
      setList(list);
    })
  }
  // 删除类型
  const deleteType = (record) => {
    const params = {
      id: record.id
    }
    confirm({
      title: "删除类型",
      content: "确定要删除此类型嘛？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        instance({
          method: "get",
          url: servicePath.delType,
          params,
          // withCredentials: true
        }).then(res => {
          getTypeList();
          message.success("删除成功");
        })
      },
      onCancel() {
        message.success("取消删除");
      }
    })
  }
  // 清空数据并关闭弹框
  const onClose = () => {
    setId();
    setTypeName("");
    setIcon("");
    setVisible(false);
  };
  // 新增类型弹框
  const addType = () => {
    setIsAdd(true);
    setVisible(true);
  }
  // 更新类型弹框
  const updateType = (records) => {
    setIsAdd(false);
    setId(records.id);
    setTypeName(records.typeName);
    setIcon(records.icon);
    setVisible(true);
  }
  // 设置自动id
  const autoId = () =>{
    const id = list[list.length-1].id;
    setId(id+1);
  }
  // 确认新增
  const onConfirm = () => {
    if(id === "") {
      message.warning("请输入类型ID");
      return false;
    }else 
    if(!typeName) {
      message.warning("请输入类型名");
      return false;
    }else if(!icon) {
      message.warning("请输入图标");
      return false;
    }
    // 新增类型
    if(isAdd) {
      let params = {
        id,
        typeName,
        icon
      }
      instance({
        method: 'post',
        url: servicePath.addType,
        data: params
      }).then(res =>{
        if(res.data.success) {
          message.success("保存成功");
          getTypeList();
        }else {
          message.error("操作失败");
        }
        onClose();
      }).catch(res => {
        message.error("操作失败");
      })
    }else { // 修改类型
      let params = {
        id,
        typeName,
        icon
      }
      instance({
        method: 'post',
        url: servicePath.updateType,
        data: params
      }).then(res =>{
        if(res.data.success) {
          message.success("修改成功");
          getTypeList();
        }else {
          message.error("操作失败");
        }
        onClose();
      }).catch(res => {
        message.error("操作失败");
      })
    }
  }

  return (
    <div>
      <Button type="primary" className="add-btn" onClick={addType}>新增</Button>
      <Table dataSource={list} pagination={{defaultPageSize: 6}}>
        <Column title="类型ID" dataIndex="id" key="id" />
        <Column title="类型名" dataIndex="typeName" key="typeName" />
        <Column 
          title="图标" 
          dataIndex="icon" 
          key="icon"
          render={(tags) => (
            <span className="icon-span" dangerouslySetInnerHTML={{__html: tags}}></span>
          )}
        />
        <Column 
          title="操作" 
          // dataIndex="action"
          key="action" 
          render={(text, record) => (
            <div>
              <Button size="middle" style={{marginRight: 6}} onClick={() => updateType(record)}>
                修改
              </Button>
              <Button size="middle" danger onClick={() => deleteType(record)}>
                删除
              </Button>
            </div>
          )}
        />
      </Table>
      <Drawer
        title={isAdd ? "新增类型" : "修改类型"}
        placement="right"
        width="400"
        closable={false}
        onClose={onClose}
        visible={visible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={onConfirm} type="primary">
              确定
            </Button>
          </div>
        }
      >
        <div className="type-input">
          <div>
            类型ID：
            <Input placeholder="请输入类型ID" value={id} onChange={e => setId(e.target.value)} disabled={!isAdd} />
            <Button onClick={autoId} disabled={!isAdd}>自动</Button>
          </div>
          <div>
            类型名：
            <Input placeholder="请输入类型名" value={typeName} onChange={e => setTypeName(e.target.value)} />
          </div>
          <div>
            图&nbsp;&nbsp;&nbsp;&nbsp;标：
            <span className="icon-span icon-add" dangerouslySetInnerHTML={{__html: icon}}>
            </span>
            <TextArea 
              placeholder="请输入svg格式的图标，建议直接去iconfont复制" 
              value={icon} 
              onChange={e => setIcon(e.target.value)} 
            />
          </div>
        </div>
      </Drawer>
    </div>
  )
  
}

export default ArticleList