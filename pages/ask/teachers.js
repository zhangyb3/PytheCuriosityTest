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
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})