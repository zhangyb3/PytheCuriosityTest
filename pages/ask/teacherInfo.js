// pages/ask/teacherInfo.js
var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");
var user = require("../../utils/user.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

var selectItem;
var itemIndex;

Page({
  data:{
    checkTeacher: {},
    teacher_info: true,
    preview_img_url: config.PytheFileServerURL ,

    requestingResultList: false,

  },
  onLoad:function(parameters){
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        that.setData({
          scrollHeight: res.windowHeight ,
        });
      }
    });
    console.log(parameters);
    this.data.checkTeacher.userId = parameters.userId;
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/question/teacher/detail',
      data: {
        userId: this.data.checkTeacher.userId,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res);
        var teacherId = that.data.checkTeacher.userId;
        that.data.checkTeacher = res.data.data;
        that.data.checkTeacher.teacherId = teacherId;
        that.setData({
          checkTeacher: that.data.checkTeacher,
        });

        var myAnsweredParams = {
          teacherId : teacherId,
          pageSize : 10,
          pageNum : 1,
          
        };    
        listViewUtil.loadList(that,'teacher_answered',config.PytheRestfulServerURL,
        base.TEACHER_ANSWERED_URL_DETAIL,
        10,
            myAnsweredParams,
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
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    });


  },

  selectOneItem:function(e){
    
    selectItem = e.currentTarget.dataset.item;
    itemIndex = e.currentTarget.dataset.index;
    console.log(JSON.stringify(selectItem) + "," + itemIndex);

    // this.setData({hide_select_item:false});
    // this.setData({hide_loading:false});
    selectItem.playingVoice = false;


    //进入详细列表
    // base.cleanCacheFile(20);
    //base.getDetailContent(this,selectItem);
    wx.navigateTo({
      url: '../section/concrete_content?selectItem=' + JSON.stringify(selectItem) + '&from_page=' + 'home_page',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    });

  },

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})