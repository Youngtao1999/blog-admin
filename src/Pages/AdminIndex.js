import React, { useState } from "react"
import { Layout, Menu, Breadcrumb, Switch } from 'antd';
import { Route } from "react-router-dom"
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import AddArticle from "./AddArticle"
import ArticleList from "./ArticleList";
import "../static/css/AdminIndex.css"


const AdminIndex = (props) => {
  const { Header, Content, Footer, Sider } = Layout;
  const { SubMenu } = Menu;

  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const [headclass, setHeadclass] = useState("head-light");

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  const handleClickMenu = (e) => {
    if(e.key === "addArticle") {
      props.history.push("/index/add");
    } else if(e.key === "Articlelist") {
      props.history.push("/index/list");
    }
  }

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
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            工作台
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            添加文章
          </Menu.Item>
          <SubMenu 
            key="sub1" 
            icon={<UserOutlined />} 
            title="文章管理"
            onClick={handleClickMenu}
          >
            <Menu.Item key="addArticle">添加文章</Menu.Item>
            <Menu.Item key="Articlelist">文章列表</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            留言管理
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>后台管理系统</Breadcrumb.Item>
            <Breadcrumb.Item>工作台</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <div>
              <Route path="/index/" exact component={AddArticle} />
              <Route path="/index/add" exact component={AddArticle} />
              <Route path="/index/list" exact component={ArticleList} />
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Young + React + antd</Footer>
      </Layout>
    </Layout>
  );
}

export default AdminIndex;