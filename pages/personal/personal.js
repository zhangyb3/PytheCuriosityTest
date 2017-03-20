// pages/personal/personal.js

var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");

var sleep = 30;
var interval = null;

Page({
  data:{
    second : 10,
    user:{
      id: 'vnoeajo4alvn24',
    },
    countdownText : '发',
  },
  onLoad:function(options){
    


  },

  
  

  selectPersonalAsk:function(result){
    var parametersJSON = this.data.user;
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: 'personal_ask' + '?' + parametersString,
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

  selectPersonalAnswer:function(result){
    var parametersJSON = this.data.user;
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: 'personal_answer' + '?' + parametersString,
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

  selectPersonalLike:function(result){
    var parametersJSON = this.data.user;
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: 'personal_like' + '?' + parametersString,
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
    
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  //倒计时
  enterToCountdown:function(e){
    var that = this;
    
    that.setData({  
      second: 10,  
      
      }); 
    countdown(that);
    if (second == 0) {  
      that.setData({  
      countdownText: "重发验证码"  
      });  
    }
  },


})

function countdown(that) {
  var second = that.data.second ;
    if (second == 0) {  
      that.setData({  
        countdownText: "重发验证码" ,
        lock_countdown: false,
      });  
      return ;  
  } 

  var time = setTimeout(function(){  
    that.setData({  
      second: second - 1  ,
      countdownText: second + '秒后可重发',
      lock_countdown: true,
    });  
    countdown(that);  
    }  
    ,1000)  
}