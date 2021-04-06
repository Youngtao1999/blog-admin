let baseUrl = 'http://127.0.0.1:7001/admin/'

let servicePath = {
  login: baseUrl + 'login', // 登录接口
  getTypeInfo: baseUrl + "getTypeInfo", // 获取文章类别信息
  addArticle: baseUrl + "addArticle", // 添加文章
  updateArticle: baseUrl + "updateArticle", // 更新文章
  getArticleList: baseUrl + "getArticleList", // 获取文章列表
  delArticle: baseUrl + "delArticle", // 删除文章
  getArticleById: baseUrl + "getArticleById", // 根据id查询文章
}

export default servicePath