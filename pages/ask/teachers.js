// pages/ask/teachers.js
var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");
var user = require("../../utils/user.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

Page({
  data:{
    list_mode: 'subject_teacher',
    searchParameters: {},
    hide_teacher_list: false,
    ask_page: true,
  },
  onLoad:function(parameters){
    this.data.searchParameters.subjectId = parameters.subjectId;
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    
    var that = this;
    if(wx.getStorageSync(user.StudentID) != 'StudentID')
    {
      this.data.searchParameters.userId = wx.getStorageSync(user.StudentID);
    }
       
    listViewUtil.loadList(that,'subject_teacher',config.PytheRestfulServerURL,
    "/question/teacherList",
    10,
        this.data.searchParameters,
        function (netData){
          //取出返回结果的列表
          return netData.data;
        },
        function(item){
        
        },
        {},
        'GET',
    );

  },

  checkTeacherInfo:function(e){
    var teacher = (e.currentTarget.dataset.teacher);

    wx.navigateTo({
      url: 'teacherInfo?userId=' + teacher.userid,
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

  askOneTeacher:function(e){

    //先判断是否已注册
    if(wx.getStorageSync('alreadyRegister') == 'no')
    {
      this.setData({
        hide_login: false,
      });
      loadingSelections.call(this);
    }
    if(wx.getStorageSync('alreadyRegister') == 'yes')
    {
      console.log("navigate to ask operation page");
      var parametersJSON = e.currentTarget.dataset.teacher;
      console.log(parametersJSON);
      var parameters = netUtil.json2Form(parametersJSON);
      // console.log(parameters);
      wx.navigateTo({
        url: 'ask_operation' + '?' + parameters,
        success: function(res){
          // success
          // console.log(res);
        },
        fail: function() {
          // fail
          // console.log(res);
        },
        complete: function() {
          // complete
          // console.log(res);
        }
      })
    }
      
  },
  
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})