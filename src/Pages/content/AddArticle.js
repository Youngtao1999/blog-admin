import React, { useState, useEffect, createContext } from "react"
import marked from "marked"
import "../../static/css/AddArticle.css"
import { Row, Col, Input, Select, Drawer, Button, DatePicker, Divider, message, Image } from "antd"

import { FileImageOutlined } from '@ant-design/icons';
import UploadImg from "../../compontents/UploadImg"
import servicePath, { fallback } from "../../config/apiUrl"
import instance from "../../api/axios"

const AddArticle = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;

  const { Provider } = createContext();

  const [articleId,setArticleId] = useState(0);  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle,setArticleTitle] = useState(''); //文章标题
  const [articleContent , setArticleContent] = useState('');  //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState('文章内容预览'); //html内容
  const [introduce,setIntroduce] = useState(); //简介的markdown内容
  const [markdownIntro,setMarkdownIntro] = useState('文章简介预览'); //简介的markdown内容
  const [showDate,setShowDate] = useState(); //发布日期
  const [updateDate,setUpdateDate] = useState(); //修改日志的日期
  const [typeInfo ,setTypeInfo] = useState([]); // 文章类别信息
  const [imgUrl,setImgUrl] = useState(""); // 封面图片地址
  const [selectedType,setSelectType] = useState("选择类型"); //选择的文章类别
  const [visible,setVisible] = useState(false); // 信息弹框

  useEffect(() => {
    getTypeInfo();
    // 获取文章id
    let tmpId = props.match.params.id
    if(tmpId) {
      setArticleId(tmpId);
      getArticleById(tmpId);
    }
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
      // withCredentials: true,
    }).then(res => {  // token验证成功
      if(res.data.success) {
        setTypeInfo(res.data.data);
      }
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
    }else if(!imgUrl) {
      message.warning('请上传博客封面');
      return false;
    }
    let params = {
      type_id: selectedType,
      title: articleTitle,
      article_content: articleContent,
      introduce: introduce,
      addDate: showDate,
      image: imgUrl
    }
    // 判断是新增还是修改
    if(articleId === 0) {
      // 新增
      params.view_count = 0;
      instance({
        method: "post",
        url: servicePath.addArticle,
        data: params,
        // withCredentials: true,
      }).then(res => {
        if(res.data.success) {
          setArticleId(res.data.insertId);
          message.success("发布成功");
          onClose();
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
        // withCredentials: true
      }).then(res => {
        if(res.data.success) {
          message.success("更新成功");
          onClose();
        }else {
          message.err("更新失败")
        }
      })
    }
  }

  // 根据id获取内容
  const getArticleById = (id) => {
    const params = {
      id
    }
    instance({
      method: "get",
      url: servicePath.getArticleById,
      params,
      // withCredentials: true
    }).then(res => {
      let articleInfo = res.data.data[0];
      setArticleTitle(articleInfo.title);
      setArticleContent(articleInfo.article_content);
      setMarkdownContent(marked(articleInfo.article_content));
      setIntroduce(articleInfo.introduce);
      setImgUrl(articleInfo.image);
      setMarkdownIntro(marked(articleInfo.introduce));
      setShowDate(articleInfo.addDate);
      setSelectType(articleInfo.typeId)
    })
  }
  // 关闭弹框
  const onClose = () => {
    if(articleId === 0) {
      setImgUrl("");
    }
    setVisible(false);
  }
  // 打开弹框
  const openDrawer = () =>{
    if(articleId === 0) {
      setImgUrl("")
    }
    setVisible(true);
  }
  const imageIcon = (<FileImageOutlined />)

  return (
    <div>
      <Row gutter={5}>
        {/* 左侧 */}
        <Col span={24}>
          {/* 左侧头 */}
          <Row gutter={10} className="left-header">
            {/* 标题 */}
            <Col span={6}>
              <Input 
                placeholder="博客标题"
                size="large"
                value={articleTitle}
                onChange={(e) => {setArticleTitle(e.target.value)}}
              />
            </Col>
            <Col>
              <Button type="primary" size="large" onClick={openDrawer}>发布文章</Button>
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

        <Drawer
          // title={isAdd ? "新增类型" : "修改类型"}
          title={"保存文章"}
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
              {/* <Button onClick={onConfirm} type="primary"> */}
              <Button onClick={saveArticle} type="primary">
                确定
              </Button>
            </div>
          }
        >
          <Row>
            <Col span={24} className="date-select">
              <DatePicker 
                placeholder="发布日期"
                // value={showDate}
                onChange={(date, dateString) => {setShowDate(dateString);}}
              />
              <Select 
                placeholder="类型" 
                defaultValue={selectedType} 
                value={selectedType}
                onChange={(value) => {setSelectType(value)}} 
              >
                {
                  typeInfo.map((item, index) => (
                    <Option value={item.id} key={index}>
                      <span className="icon-span" dangerouslySetInnerHTML={{__html: item.icon}}></span>{item.typeName}
                    </Option>
                  ))
                }
              </Select>
            </Col>
            <Col span={24}>
              <Provider value="上传封面">
                <UploadImg setImgUrl={setImgUrl} />
              </Provider>
              <Image
                className="img-url"
                src={imgUrl}
                fallback={fallback}
              />
            </Col>
            <Col span={24} className="article-intro">
              <TextArea
                maxLength={150}
                rows={8}
                placeholder="文章简介"
                value={introduce}
                onChange={(e) => {changeIntro(e)}}
              />
              <div className="introduce-html" dangerouslySetInnerHTML={{ __html: markdownIntro }}>
              </div>
            </Col>
          </Row>
        </Drawer>
      </Row>
    </div>
  )

}

export default AddArticle