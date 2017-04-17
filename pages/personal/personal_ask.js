// pages/personal/personal_ask.js

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

Page({
  data:{
    personal_ask_list:[
      
    ],

    preview_img_url: config.PytheFileServerURL ,
    hide_show_image_page: true,
    
  },
  onLoad:function(parameters){
    console.log("from personal");
    console.log(parameters);
    
    //加载个人问题列表
    var that = this;
    var myQuestionParams = {
      studentId : wx.getStorageSync(user.StudentID),
      pageSize : 3,
      pageNum : 1,
      
    };    
    listViewUtil.loadList(that,'my_question',config.PytheRestfulServerURL,
    base.MY_QUESTION_URL_DETAIL,
    10,
        myQuestionParams,
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

  selectOneQuestion:function(result){
    var question = result.currentTarget.dataset.item;
    console.log(question);
    console.log(JSON.stringify(question));
    // var parametersString = netUtil.json2Form(question);
    var parametersString = encodeURIComponent(JSON.stringify(question));
    wx.navigateTo({
      url: 'personal_ask_detail' + '?' + 'P=' +parametersString,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})