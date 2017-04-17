var config = require('./config')
var user = require('./user')
var login = require('login.js')

const DETAIL_CONTENT_URL = `${config.PytheRestfulServerURL}/index2/question_answers`;

const COMMIT_ANSWER_URL = `${config.PytheRestfulServerURL}/answer/insert/`;

const COMMIT_QUESTION_URL = `${config.PytheRestfulServerURL}/question/insert/`;

const MY_QUESTION_URL_DETAIL = `/me/question`;

const MY_QUESTION_ANSWER_URL_DETAIL = `/me/question/click`;

const MY_QUESTION_ANSWER_CONCRETE_URL = `/me/question/answers`;

const MY_ANSWERED_URL_DETAIL = `/me/answer/is`;

const MY_UNANSWER_URL_DETAIL = `/me/answer/isnot`;

const MY_ANSWER_COLLECTION_URL_DETAIL = `/me/collection/question`;

const MY_TEACHER_COLLECTION_URL_DETAIL = `/me/collection/teacher`;

const COMPLAIN_URL = `${config.PytheRestfulServerURL}/me/question/report`;

const SELECT_BEST_ANSWER_URL = `${config.PytheRestfulServerURL}/me/question/select`;


function getDetailContent(that,selectItem)
{
    //请求具体数据
    wx.request({
      url: DETAIL_CONTENT_URL,
      data: {
        questionId: selectItem.questionid,
        userId: wx.getStorageSync(user.UserID),
      },
      method: 'GET', 
      success: function(res){
        console.log(res);
        var answers = res.data.data;

        for(var count = 0; count < answers.length; count++)
        {
          
          var temp = answers[count];
          var isClick = temp.isClick;
          temp = JSON.parse(temp.question);
          temp.isClick = isClick;
          answers[count] = temp;
          answers[count].answercontent = JSON.parse(answers[count].answercontent);
          answers[count].questioncontent = JSON.parse(answers[count].questioncontent);
          
        }
        that.setData({
            answers: answers,
            question:selectItem,
        });
        typeof success == "function" && success(res.data.data);
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
      wx.showToast({
        title: '已提交',
        icon: 'success',
        duration: 2000
      })
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
      wx.showToast({
        title: '已发布',
        icon: 'success',
        duration: 2000
      })
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
}


function complainAnswer(parameters)
{
  wx.request({
    url: COMPLAIN_URL,
    data: {
      userId: parameters.userId,
      complainedId: parameters.complainedId,
      answerId: parameters.answerId,
    },
    method: 'GET', 
    success: function(res){
      // success
      console.log(res);
      wx.showToast({
        title: '已举报',
        icon: 'success',
        duration: 1500
      });
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
}

function selectBestAnswer(parameters)
{
  wx.request({
    url: SELECT_BEST_ANSWER_URL,
    data: {
      questionId: parameters.questionId,
      answerIds: parameters.answerIds,
    },
    method: 'GET', 
    success: function(res){
      // success
      console.log(res);
      if(res.data.data==2)
      {
        wx.showToast({
          title: '已选择最佳答案',
          icon: 'success',
          duration: 1000
        });
      }
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

    complainAnswer: complainAnswer,
    selectBestAnswer: selectBestAnswer,

    MY_QUESTION_URL_DETAIL: MY_QUESTION_URL_DETAIL,

    MY_QUESTION_ANSWER_URL_DETAIL: MY_QUESTION_ANSWER_URL_DETAIL,

    MY_QUESTION_ANSWER_CONCRETE_URL: MY_QUESTION_ANSWER_CONCRETE_URL,

    MY_ANSWERED_URL_DETAIL: MY_ANSWERED_URL_DETAIL,

    MY_UNANSWER_URL_DETAIL: MY_UNANSWER_URL_DETAIL,

    MY_ANSWER_COLLECTION_URL_DETAIL: MY_ANSWER_COLLECTION_URL_DETAIL,

    MY_TEACHER_COLLECTION_URL_DETAIL: MY_TEACHER_COLLECTION_URL_DETAIL,
}