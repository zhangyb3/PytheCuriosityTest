
var host_base = "http://192.168.1.14:8081/rest";
var config = require('config.js')

function requestSessionId(url, data, method, success, fail){
    var all_data = data || {};
    all_data['AppID'] = config.AppID;
    all_data['AppSecret'] = config.AppSecret;
    wx.request({
      url: host_base + url,
      data: all_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: success,
      fail: fail,
    })
}



module.exports = {
  requestSessionId: requestSessionId,
}