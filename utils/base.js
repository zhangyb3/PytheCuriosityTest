var config = require('./config')
var user = require('./user')
var login = require('login.js')
var register = require('register.js')
var pay = require("./pay");
var util = require("./util");

const DETAIL_CONTENT_URL = `${config.PytheRestfulServerURL}/index2/question_answers`;

const ANSWER_DETAIL_CONTENT_URL = `${config.PytheRestfulServerURL}/answer/detail`;

const COMMIT_ANSWER_URL = `${config.PytheRestfulServerURL}/answer/insert/`;

const COMMIT_QUESTION_URL = `${config.PytheRestfulServerURL}/question/insert/`;

const MY_QUESTION_URL_DETAIL = `/me/question`;

const MY_QUESTION_ANSWER_URL_DETAIL = `/me/question/click`;

const MY_QUESTION_ANSWER_CONCRETE_URL = `/me/question/answers`;

const MY_ANSWERED_URL_DETAIL = `/teacher/answer/is`;

const MY_UNANSWER_URL_DETAIL = `/teacher/answer/isnot`;

const STUDENT_ANSWERED_URL_DETAIL = `/student/answer/is`;

const STUDENT_UNANSWER_URL_DETAIL = `/student/answer/isnot`;

const TEACHER_ANSWERED_URL_DETAIL = `/teacher/answer/is`;

const TEACHER_UNANSWER_URL_DETAIL = `/teacher/answer/isnot`;

const TEACHER_QUERY_BILL = `/teacher/queryBill`;

const STUDENT_QUERY_BILL = `/student/queryBill`;

const MY_ANSWER_COLLECTION_URL_DETAIL = `/me/collection/question`;

const MY_TEACHER_COLLECTION_URL_DETAIL = `/me/collection/teacher`;

const COMPLAIN_URL = `${config.PytheRestfulServerURL}/me/question/report`;

const RECALL_COMPLAIN_URL = `${config.PytheRestfulServerURL}/me/question/recall`;

const SELECT_BEST_ANSWER_URL = `${config.PytheRestfulServerURL}/me/question/select`;


function getDetailContent(that,selectItem)
{
    var URL ;
    if(that.data.from_page == 'home_page')
    {
      URL = DETAIL_CONTENT_URL;
    }
    if(that.data.from_page == 'answer_page')
    {
      URL = ANSWER_DETAIL_CONTENT_URL;
    }
    

    //请求具体数据
    wx.request({
      url: URL, 
      data: {
        questionId: selectItem.questionid,
        userId: wx.getStorageSync(user.UserID),
      },
      method: 'GET', 
      success: function(res){
        console.log(res);
        // var answers = res.data.data;

        // for(var count = 0; count < answers.length; count++)
        // {
          
        //   var temp = answers[count];
        //   var isClick = temp.isClick;
        //   temp = JSON.parse(temp.question);
        //   temp.isClick = isClick;
        //   temp.playingVoice = false;
        //   answers[count] = temp;
        //   answers[count].answercontent = JSON.parse(answers[count].answercontent);
        //   answers[count].questioncontent = JSON.parse(answers[count].questioncontent);
          
        // }

        var temp = res.data.data;
        var content = JSON.parse(temp.question);
        var answer = {};
        answer = content;
        answer.answercontent = JSON.parse(answer.answercontent);
        answer["isClick"] = temp.isClick;
        answer.answercontent.answertime = util.formatDate(answer.answercontent.answertime);

        var answers = [];
        answers[0] = answer;


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

function commitAnswer(the, parameters)
{
  var that = the;
  wx.request({
    url: COMMIT_ANSWER_URL,
    data: {
      parameters
    },
    method: 'POST', 
    success: function(res){
      // success
      console.log(res);

      //推送老师已回答消息到学生
      wx.request({
        url: config.PytheRestfulServerURL + '/answer/push/information',
        data: {
          answerId: res.data.data.data
        },
        method: 'GET',
        dataType: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })

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
      that.setData({commitDisabled: false});
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

function loginSystem(the) {
  var that = the;

  wx.login({
    success: function (res) {
      // success
      wx.getUserInfo({
        success: function (res) {
          // success
          console.log(res.rawData);
          var rawData = JSON.parse(res.rawData);
          wx.setStorageSync('avatarUrl', rawData.avatarUrl);
          // wx.setStorageSync('userNickName', rawData.nickName);
          wx.setStorageSync('wxNickName', rawData.nickName);
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })


  //登录
  login.login(
    () => {



      // 检查是否有注册过
      register.checkRegister(
        (userRegisterResult) => {
          console.log('check register : ' + JSON.stringify(userRegisterResult));
          //如果没注册过，则注册
          var registerInfo = userRegisterResult.data.data;
          if (registerInfo == null) {

          }
          else if (registerInfo.userid == null) {
            wx.setStorageSync('alreadyRegister', 'no');
            console.log("register : " + wx.getStorageSync('alreadyRegister'));


          }
          else {
            wx.setStorageSync('alreadyRegister', 'yes');
            wx.setStorageSync(user.UserID, registerInfo.userid);
            // wx.setStorageSync(user.StudentID, registerInfo.studentid);
            // wx.setStorageSync(user.TeacherID, registerInfo.teacherid);
            wx.setStorageSync(user.GradeID, registerInfo.gradeid);
            wx.setStorageSync(user.UserDescription, registerInfo.description);
            wx.setStorageSync(user.UserNickName, registerInfo.username);
            wx.setStorageSync('userAvatarUrl', registerInfo.userimg);
            wx.setStorageSync(user.Status, registerInfo.status);
            wx.setStorageSync(user.TeacherID, registerInfo.userid);
            wx.setStorageSync(user.StudentID, registerInfo.userid);
            wx.setStorageSync(user.TeacherID, registerInfo.userid);



            if (wx.getStorageSync(user.UserID) != 'userID') {
              wx.setStorageSync('alreadyRegister', 'yes');
              wx.setStorageSync('fromRegister', 'no');

              wx.showToast({
                title: '已登录',
                duration: 1200
              });

              //从服务通知进来answer页面，自动刷新
              if(wx.getStorageSync("fromServiceInfoToAnswerPage") == 'yes')
              {
                that.data.personal_answer_menu[0].active = false;
                that.data.personal_answer_menu[1].active = true;
                that.setData({
                  hide_personal_answer_list: false,
                  hide_personal_not_answer_list: true,
                  personal_answer_menu: that.data.personal_answer_menu
                });
                that.onShow();
              }

            }


            if (wx.getStorageSync(user.Status) == 1) {
              wx.setStorageSync(user.OrganizationID, registerInfo.organizationid);
            }

          }



          that.setData({
            indexUserName: wx.getStorageSync(user.UserNickName),
            indexUserDescription: wx.getStorageSync(user.UserDescription),
            exitSystem: wx.getStorageSync('exitSystem'),
            alreadyRegister: wx.getStorageSync('alreadyRegister')
          });

        },
        (userRegisterResult) => {
          console.log(userRegisterResult);
        },
      );

    }
  );

  wx.setStorageSync('exitSystem', 'no');

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

    TEACHER_ANSWERED_URL_DETAIL: TEACHER_ANSWERED_URL_DETAIL,

    TEACHER_UNANSWER_URL_DETAIL: TEACHER_UNANSWER_URL_DETAIL,

    TEACHER_QUERY_BILL: TEACHER_QUERY_BILL,

    STUDENT_ANSWERED_URL_DETAIL: STUDENT_ANSWERED_URL_DETAIL,

    STUDENT_UNANSWER_URL_DETAIL: STUDENT_UNANSWER_URL_DETAIL,

    STUDENT_QUERY_BILL: STUDENT_QUERY_BILL,

    MY_ANSWER_COLLECTION_URL_DETAIL: MY_ANSWER_COLLECTION_URL_DETAIL,

    MY_TEACHER_COLLECTION_URL_DETAIL: MY_TEACHER_COLLECTION_URL_DETAIL,

    loginSystem: loginSystem,
}