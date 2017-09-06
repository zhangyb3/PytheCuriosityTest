// pages/personal/teacher_bill.js
var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

Page({
  data:{
    teacher_bill_list: [],
    list_mode: "teacher_bill",
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          // scrollHeight: res.windowHeight - (100 * res.windowWidth / 750) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
          // scrollHeight: res.windowHeight - (50 * res.windowHeight / 750)
          scrollHeight: res.windowHeight,
        });
      }
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    
    var that = this;
    var queryParams = {
      studentId: wx.getStorageSync(user.StudentID),
      teacherId: wx.getStorageSync(user.TeacherID),
      pageNum: 1,
      pageSize: 10,
    };

    if(wx.getStorageSync(user.Status) == 1)
    {
      listViewUtil.loadList(that,'teacher_bill',config.PytheRestfulServerURL,
        base.TEACHER_QUERY_BILL,
        10,
            queryParams,
            function (netData){
              //取出返回结果的列表
              return netData.data;
            },
            function(item){
              
            },
            {},
            'GET',
        );
    }

  },

  checkQuestionAnswer:function(e){
    var bill = e.currentTarget.dataset.bill;
    console.log('check ' + JSON.stringify(bill) + " QA");
  },

  withdraw:function(e){
    console.log('teacher withdraw ');
  },

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})