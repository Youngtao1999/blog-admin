import React, { useState } from "react"
import marked from "marked"
import "../static/css/AddArticle.css"
import { Row, Col, Input, Select, Button, DatePicker, Divider } from "antd"

const AddArticle = () => {
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
  const [selectedType,setSelectType] = useState(1); //选择的文章类别

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

  const changeContent = (e) => {
    setArticleContent(e.target.value);
    let html = marked(e.target.value);
    setMarkdownContent(html);
  }

  const changeIntro = (e) => {
    setIntroduce(e.target.value);
    let html = marked(e.target.value);
    setMarkdownIntro(html);
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
              <Button type="primary" size="large">发布</Button>
            </Col>
            <Col span={24} className="date-select">
              <DatePicker 
                placeholder="发布日期"
              />
              <Select placeholder="类型">
                <Option value="1">js学习</Option>
                <Option value="2">Vue学习</Option>
                <Option value="3">React学习</Option>
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