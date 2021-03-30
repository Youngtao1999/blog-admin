import React, { useState, useEffect } from "react"
import marked from "marked"
import axios from "axios"
import "../static/css/AddArticle.css"
import { Row, Col, Input, Select, Button, DatePicker, Divider, message } from "antd"

import servicePath from "../config/apiUrl"
import instance from "../api/axios"

const AddArticle = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;

  const [articleId,setArticleId] = useState(0);  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle,setArticleTitle] = useState(''); //文章标题
  const [articleContent , setArticleContent] = useState('');  //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState('文章内容预览'); //html内容
  const [introduce,setIntroduce] = useState(); //简介的markdown内容
  const [markdownIntro,setMarkdownIntro] = useState('文章简介预览'); //简介的markdown内容
  const [showDate,setShowDate] = useState(); //发布日期
  const [updateDate,setUpdateDate] = useState(); //修改日志的日期
  const [typeInfo ,setTypeInfo] = useState([]); // 文章类别信息
  const [selectedType,setSelectType] = useState("选择类型"); //选择的文章类别

  useEffect(() => {
    getTypeInfo();
  }, [])

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true, // 允许 Git Hub标准的markdown.
    pedantic: false, // 不纠正原始模型任何的不良行为和错误（默认为false）
    sanitize: false, // 对输出进行过滤（清理），将忽略任何已经输入的html代码（标签）
    tables: true, // 允许支持表格语法（该选项要求 gfm 为true）
    breaks: false, // 允许回车换行（该选项要求 gfm 为true）
    smartLists: true, // 使用比原生markdown更时髦的列表
    smartypants: false, // 使用更为时髦的标点
  })
  // 内容转换成md格式
  const changeContent = (e) => {
    setArticleContent(e.target.value);
    let html = marked(e.target.value);
    setMarkdownContent(html);
  }
  // 简介转换成md格式
  const changeIntro = (e) => {
    setIntroduce(e.target.value);
    let html = marked(e.target.value);
    setMarkdownIntro(html);
  }

  // 获取类型信息
  const getTypeInfo = () => {
    instance({
      method: "get",
      url: servicePath.getTypeInfo,
      withCredentials: true,
    }).then(res => {  // token验证成功
      if(res.data.success) {
        setTypeInfo(res.data.data);
      }
    }).catch(err => { // token验证失败
      message.error("用户未登录");
      setTimeout(() => {
        props.history.push("/login");
      }, 2000);
    })
  }

  // 保存文章
  const saveArticle = () => {
    if(selectedType === "选择类型") {
      message.warning("请选择文章类型");
      return false;
    }else if(!articleTitle) {
      message.warning("文章名称不能为空");
      return false;
    }else if(!articleContent){
      message.warning('文章内容不能为空');
      return false;
    }else if(!introduce){
        message.warning('简介不能为空');
        return false;
    }else if(!showDate){
        message.warning('发布日期不能为空');
        return false;
    }
    let params = {
      type_id: selectedType,
      title: articleTitle,
      article_content: articleContent,
      introduce: introduce,
      addDate: showDate,
    }
    // 判断是新增还是修改
    if(articleId === 0) {
      // 新增
      params.view_count = 0;
      instance({
        method: "post",
        url: servicePath.addArticle,
        data: params,
        withCredentials: true,
      }).then(res => {
        if(res.data.success) {
          setArticleId(res.data.insertId);
          message.success("发布成功");
        }else {
          message.err("发布失败")
        }
      })
    }else {
      // 修改
      params.id = articleId;
      instance({
        method: "post",
        url: servicePath.updateArticle,
        data: params,
        withCredentials: true
      }).then(res => {
        if(res.data.success) {
          message.success("更新成功");
        }else {
          message.err("更新失败")
        }
      })
    }
  }

  return (
    <div>
      <Row gutter={5}>
        {/* 左侧 */}
        <Col span={18}>
          {/* 左侧头 */}
          <Row gutter={10} className="left-header">
            {/* 标题 */}
            <Col span={20}>
              <Input 
                placeholder="博客标题"
                size="large"
                value={articleTitle}
                onChange={(e) => {setArticleTitle(e.target.value);console.log(articleTitle)}}
              />
            </Col>
          </Row>
          {/* 左侧主体 */}
          <Row gutter={10}>
            {/* 输入内容部分 */}
            <Col span={12}>
              <TextArea
                className="markdown-content"
                rows={35}
                placeholder="输入文章内容"
                value={articleContent}
                onChange={(e) => {changeContent(e)}}
              />
            </Col>
            {/* markdown 展示部分 */}
            <Col span={12}>
              <div className="show-html" dangerouslySetInnerHTML={{ __html: markdownContent }}>
              </div>
            </Col>
          </Row>
        </Col>
        {/* 右侧 */}
        <Col span={6}>
          <Row>
            <Col span={24} className="right-button">
              <Button size="large">暂存</Button>
              <Button type="primary" size="large" onClick={saveArticle}>发布</Button>
            </Col>
            <Col span={24} className="date-select">
              <DatePicker 
                placeholder="发布日期"
                onChange={(date, dateString) => {setShowDate(dateString)}}
              />
              <Select placeholder="类型" defaultValue={selectedType} onChange={(value) => {console.log(value);setSelectType(value)}} >
                {
                  typeInfo.map((item, index) => (
                    <Option value={item.id} key={index}>{item.typeName}</Option>
                  ))
                }
              </Select>
            </Col>
            <Col span={24} className="article-intro">
              <TextArea
                rows={8}
                placeholder="文章简介"
                onChange={(e) => {changeIntro(e)}}
              />
              <div  className="introduce-html" dangerouslySetInnerHTML={{ __html: markdownIntro }}>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )

}

export default AddArticle