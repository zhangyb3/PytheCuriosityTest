var config = require('./config')
var user = require('./user')
var login = require('login.js')

const DETAIL_CONTENT_URL = `${config.PytheRestfulServerURL}/index2/question_answers`;

const COMMIT_ANSWER_URL = `${config.PytheRestfulServerURL}/answer/insert/`;

const COMMIT_QUESTION_URL = `${config.PytheRestfulServerURL}/question/insert/`;

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
        return res.data.data;
      },
      fail: function(res) {
        console.log(res);
      }
    })
    
}

function commitAnswer(parameters)
{
  wx.request({
    url: COMMIT_ANSWER_URL,
    data: {
      parameters
    },
    method: 'POST', 
    success: function(res){
      // success
      console.log(res);
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
}

function commitQuestion(parameters)
{
  wx.request({
    url: COMMIT_QUESTION_URL,
    data: {
      parameters
    },
    method: 'POST', 
    success: function(res){
      // success
      console.log(res);
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
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
    commitAnswer : commitAnswer,
    commitQuestion: commitQuestion,
}