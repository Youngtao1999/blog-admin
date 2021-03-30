let baseUrl = 'http://127.0.0.1:7001/admin/'

let servicePath = {
  login: baseUrl + 'login', // 登录接口
  getTypeInfo: baseUrl + "getTypeInfo", // 获取文章类别信息
  addArticle: baseUrl + "addArticle", // 添加文章
  updateArticle: baseUrl + "updateArticle", // 更新文章
}

export default servicePath