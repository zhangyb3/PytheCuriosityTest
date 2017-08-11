var config = require('./config')
var user = require('./user')
var login = require('login.js')
var pay = require("./pay");

const DETAIL_CONTENT_URL = `${config.PytheRestfulServerURL}/index2/question_answers`;

const COMMIT_ANSWER_URL = `${config.PytheRestfulServerURL}/answer/insert/`;

const COMMIT_QUESTION_URL = `${config.PytheRestfulServerURL}/question/insert/`;

const MY_QUESTION_URL_DETAIL = `/me/question`;

const MY_QUESTION_ANSWER_URL_DETAIL = `/me/question/click`;

const MY_QUESTION_ANSWER_CONCRETE_URL = `/me/question/answers`;

const MY_ANSWERED_URL_DETAIL = `/teacher/answer/is`;

const MY_UNANSWER_URL_DETAIL = `/teacher/answer/isnot`;

const MY_ANSWER_COLLECTION_URL_DETAIL = `/me/collection/question`;

const MY_TEACHER_COLLECTION_URL_DETAIL = `/me/collection/teacher`;

const COMPLAIN_URL = `${config.PytheRestfulServerURL}/me/question/report`;

const RECALL_COMPLAIN_URL = `${config.PytheRestfulServerURL}/me/question/recall`;

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
          temp.playingVoice = false;
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
      },
      complete: function(res) {
        that.setData({
          hide_loading: true,
        });
      },
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
      wx.setStorageSync('last_commit_question_id', res.data.data);
      //提交问题之后纪录付款技能
      pay.recordQuestionPay(parameters);
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


function complainAnswer(parameters,returnBlacklistId)
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
      typeof returnBlacklistId == "function" && returnBlacklistId(res.data);
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
}

function recallComplainAnswer(parameters)
{
  wx.request({
    url: RECALL_COMPLAIN_URL,
    data: {
      userId: parameters.userId,
      answerId: parameters.answerId,
      blacklistId: parameters.blacklistId,
    },
    method: 'GET', 
    success: function(res){
      // success
      console.log(res);
      wx.showToast({
        title: '撤销举报',
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
      userId: parameters.userId,
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

function cleanCacheFile(quantity)
{
  //存储超过20个文件即清除
  wx.getSavedFileList({
    success: function(res) {
      if(res.fileList.length > quantity)
      {
        res.fileList.forEach(function(file){
          //清除缓存中“云-本地”的key-value对
          try {
            wx.removeStorageSync(wx.getStorageSync(file.filePath));
            wx.removeStorageSync(file.filePath);
          } catch (e) {
            // Do something when catch error
          }
            wx.removeSavedFile({
              filePath: file.filePath,
              complete: function(res) {
                console.log(res);
              }
            });
          }
        );
      }
      
    }
  });
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
    recallComplainAnswer: recallComplainAnswer,
    selectBestAnswer: selectBestAnswer,

    cleanCacheFile: cleanCacheFile,

    MY_QUESTION_URL_DETAIL: MY_QUESTION_URL_DETAIL,

    MY_QUESTION_ANSWER_URL_DETAIL: MY_QUESTION_ANSWER_URL_DETAIL,

    MY_QUESTION_ANSWER_CONCRETE_URL: MY_QUESTION_ANSWER_CONCRETE_URL,

    MY_ANSWERED_URL_DETAIL: MY_ANSWERED_URL_DETAIL,

    MY_UNANSWER_URL_DETAIL: MY_UNANSWER_URL_DETAIL,

    MY_ANSWER_COLLECTION_URL_DETAIL: MY_ANSWER_COLLECTION_URL_DETAIL,

    MY_TEACHER_COLLECTION_URL_DETAIL: MY_TEACHER_COLLECTION_URL_DETAIL,
}