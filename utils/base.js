var config = require('./config')
var user = require('./user')
var login = require('login.js')

const DETAIL_CONTENT_URL = `${config.PytheRestfulServerURL}/index2/question_answers`;//下单

function getDetailContent(that,selectItem)
{
    //请求具体数据
    wx.request({
      url: DETAIL_CONTENT_URL,
      data: {
        questionId: selectItem.questionid,
      },
      method: 'GET', 
      success: function(res){
        console.log(res);
        that.setData({
            answers: res.data.data,
            question:selectItem,
        });
      },
      fail: function(res) {
        console.log(res);
      }
    })
    
}


module.exports = {
    login: login.login,
    checkLogin: login.checkLogin,
    getUserInfo: login.getUserInfo,
    checkRegister: login.checkRegister,
    getUserAllData : login.getUserAllData,
    decodeUserData : login.decodeUserData,
    alreadyRegister : login.alreadyRegister,
    
    getDetailContent: getDetailContent,

}