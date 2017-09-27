// pages/section/concrete_content.js

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");
var fileSys = require("../../utils/file.js");

Page({
  data:{
    preview_img_url: config.PytheFileServerURL ,
    selectItem: {},
    from_page: 'home_page',
  },
  onLoad:function(parameters){
   
    console.log(parameters.selectItem);

    this.data.selectItem = JSON.parse(decodeURIComponent(parameters.selectItem)); 
    this.data.from_page = parameters.from_page;

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    
    this.setData({
      alreadyRegister: wx.getStorageSync('alreadyRegister'),
    });

    if(this.data.from_page == 'home_page')
    {
      base.getDetailContent(this,this.data.selectItem);
    }
    if(this.data.from_page == 'answer_page')
    {
      base.getDetailContent(this,this.data.selectItem);
    }

  },

  playVoiceRecord:function(e){
    var that = this;
    that.setData({
      isPlaying: true
    })
    wx.showToast({
      title: '下载录音',
      icon: 'success',
      duration: 1000
    });
    var that = this;
    
    var voiceRemotePath = e.currentTarget.dataset.voice;
    
    fileSys.downloadFile(that,decodeURI(voiceRemotePath),'audio');
    

  },

  showPhoto:function(e){
    var photo = decodeURIComponent(e.currentTarget.dataset.photo);
    console.log("显示图片" + photo);
    fileSys.downloadFile(this,photo,'image',
      (successReturn)=>{
        console.log(successReturn);
        var parametersJSON = {
          image_source : successReturn,
        };
        var parameters = netUtil.json2Form(parametersJSON);
        wx.navigateTo({
          url: '../section/image_frame'+'?'+ parameters,
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
      (failReturn)=>{

      }
    );
    
    
    
   

  },
  showDraw:function(e){
    var draw = decodeURIComponent(e.currentTarget.dataset.draw);
    console.log("显示手绘" + draw);
    fileSys.downloadFile(this,draw,'image',
      (successReturn)=>{
        console.log(successReturn);
        var parametersJSON = {
          image_source : successReturn,
        };
        var parameters = netUtil.json2Form(parametersJSON);
        wx.navigateTo({
          url: '../section/image_frame'+'?'+ parameters,
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
      (failReturn)=>{

      }
    );
    
  },


  //点赞答案
  likeAnswer:function(e){
    var answer_index = e.currentTarget.dataset.answer_index;
    console.log(answer_index);
    //点赞+1并更新数据库
    console.log(this.data.answers[answer_index]);
    

    var that = this;
    
    //更新数据库
    wx.request({
      url: config.PytheRestfulServerURL + '/likesnum',
      data: {
        answerId: that.data.answers[answer_index].answerid,
        userId: wx.getStorageSync(user.UserID),
        questionId:  that.data.answers[answer_index].questionid,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res.data.data);

        if(res.data.data.data == '点赞成功')
        {
          that.data.answers[answer_index].likesnum++;
          that.data.answers[answer_index].isClick = 1;
          that.setData({
            answers: that.data.answers,
          });
          wx.showToast({
            title: '点赞+1',
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
        
    
  },

  //打赏答案
  rewardAnswer:function(e){
    var answer = e.currentTarget.dataset.selected;
    var question = e.currentTarget.dataset.question;
    console.log(JSON.stringify(answer) + JSON.stringify(question));
    var parametersJSON ={
      questionId: question.questionid,
      answerId: answer.answerid,
      answerTeacher: answer.userid,
      payFee: true,
    };
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: '../reward/reward' + '?' + parametersString,
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

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})