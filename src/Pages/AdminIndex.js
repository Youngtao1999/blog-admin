import React, { useState } from "react"
import { Layout, Menu, Breadcrumb, Switch } from 'antd';
import { Route } from "react-router-dom"
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
  MailOutlined,
} from '@ant-design/icons';
import ManageInfo from "./content/ManageInfo"
import AddArticle from "./content/AddArticle"
import ArticleList from "./content/ArticleList";
import TypeList from "./content/TypeList";
import ManageComment from "./content/ManageComment";
import "../static/css/AdminIndex.css"


const AdminIndex = (props) => {
  const { Header, Content, Footer, Sider } = Layout;
  const { SubMenu } = Menu;

  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");  // 主题
  const [headclass, setHeadclass] = useState("head-light"); // 头部样式主题
  const [breadcrumb, setBreadcrumb] = useState(["工作台"]); // 头部样式主题

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };
  // 信息台
  const manageInfo = () => {
    props.history.push("/index");
    setBreadcrumb(["信息台"]);
  }
  // 文章管理点击事件
  const handleClickMenu = (e) => {
    if(e.key === "addArticle") {
      props.history.push("/index/addArt");
      setBreadcrumb(["文章管理", "编写文章"]);
    } else if(e.key === "Articlelist") {
      props.history.push("/index/artList");
      setBreadcrumb(["文章管理", "文章列表"]);
    }
  }
  // 管理文章类型
  const manageType = () => {
    props.history.push("/index/typeList");
    setBreadcrumb(["类型管理"]);
  }
  // 管理评论
  const manageComment = () => {
    props.history.push("/index/comments");
    setBreadcrumb(["留言管理"]);
  }
  // 修改主题
  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light')
    setHeadclass(value ? 'head-dark' : 'head-light')
  }

  return (
    <Layout>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={onCollapse} 
        theme={theme}
        style={{ minHeight: '100vh' }}
      >
        <div className={headclass}>
          博客管理系统
          <Switch
            checked={theme === 'dark'}
            onChange={changeTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </div>
        <Menu theme={theme} defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="info" icon={<UserOutlined />} onClick={manageInfo}>
            信息台
          </Menu.Item>
          <SubMenu 
            key="sub1" 
            icon={<FileOutlined />} 
            title="文章管理"
            onClick={handleClickMenu}
          >
            <Menu.Item key="addArticle">编写文章</Menu.Item>
            <Menu.Item key="Articlelist">文章列表</Menu.Item>
          </SubMenu>
          <Menu.Item key="manageType" icon={<AppstoreOutlined />} onClick={manageType}>
            类型管理
          </Menu.Item>
          <Menu.Item key="manageComment" icon={<MailOutlined />} onClick={manageComment}>
            留言管理
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>后台管理系统</Breadcrumb.Item>
            {
              breadcrumb.map((item, index) => (
                <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
              ))
            }
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <div>
              <Route path="/index/" exact component={ManageInfo} />
              <Route path="/index/addArt" exact component={AddArticle} />
              <Route path="/index/add/:id" exact component={AddArticle} />
              <Route path="/index/artList" exact component={ArticleList} />
              <Route path="/index/typeList" exact component={TypeList} />
              <Route path="/index/comments" exact component={ManageComment} />
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Young + React + antd</Footer>
      </Layout>
    </Layout>
  );
}

export default AdminIndex;