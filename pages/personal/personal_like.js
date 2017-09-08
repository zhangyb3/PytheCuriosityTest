// pages/personal/personal_answer.js

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");
var fileSys = require("../../utils/file.js");

var selectItem;
var itemIndex;

Page({
  data:{
    personal_like_menu:[{
        name:"精选",
        value:"like answer",
        active:true
    },{
        name:"名师",
        value:"like teacher",
        active:false
    }],

    list_mode: 'my_like_answer',

    hide_show_image_page: true,
    hide_select_item:true,

    scrollHeight:0,

    hide_personal_like_answer_list:false,
    hide_personal_like_teacher_list:true,

    preview_img_url: config.PytheFileServerURL ,
  },
  onLoad:function(parameters){
    console.log("from personal");
    console.log(parameters);
    
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          // scrollHeight: res.windowHeight - (100 * res.windowWidth / 750) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
          // scrollHeight: res.windowHeight - (100 * res.windowWidth / 750),
          scrollHeight: res.windowHeight,
        });
      }
    })
  },
    



  selectLikeAnswer:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var personal_like_menu = this.data.personal_like_menu;
    if(personal_like_menu[0].value == value)
    {
      
      this.data.personal_like_menu[0].active = true;
      this.data.personal_like_menu[1].active = false;
      
      this.setData({hide_personal_like_answer_list:false});
      
      this.setData({hide_personal_like_teacher_list:true});

      this.data.list_mode = 'my_like_answer';
    }
    else
    {
      this.data.personal_like_menu[0].active = false;
      this.data.personal_like_menu[1].active = true;
    }
    this.setData({personal_like_menu : personal_like_menu});
    
  },

  selectLikeTeacher:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var personal_like_menu = this.data.personal_like_menu;
    if(personal_like_menu[1].value == value)
    {
      
      this.data.personal_like_menu[1].active = true;
      this.data.personal_like_menu[0].active = false;
      
      this.setData({hide_personal_like_answer_list:true});
      
      this.setData({hide_personal_like_teacher_list:false});

      this.data.list_mode = 'my_like_teacher';
    }
    else
    {
      this.data.personal_like_menu[0].active = false;
      this.data.personal_like_menu[1].active = true;
    }
    this.setData({personal_like_menu : personal_like_menu});

  },

  selectOneTeacher:function(e){
      console.log("navigate to ask operation page");
      var parametersJSON = e.currentTarget.dataset.teacher;
      console.log(parametersJSON);
      var parameters = netUtil.json2Form(parametersJSON);
      // console.log(parameters);
      wx.navigateTo({
        url: '../ask/ask_operation' + '?' + parameters,
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
  returnIndexPage: function(e) {
      console.log("return to index page");
      
      this.setData({
          hide_select_item: true,
          hide_show_image_page: true,
          img_src:null,
      });
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

  onReady:function(){
    // 页面渲染完成
    this.setData({
      alreadyRegister: wx.getStorageSync('alreadyRegister'),
    });
  },
  onShow:function(){
    // 页面显示
    //加载个人精选列表
    var that = this;
    var myLikeAnswerParams = {
      userId : wx.getStorageSync(user.UserID),
      pageSize : 3,
      pageNum : 1,
      
    };    
    listViewUtil.loadList(that,'my_like_answer',config.PytheRestfulServerURL,
    base.MY_ANSWER_COLLECTION_URL_DETAIL,
    10,
        myLikeAnswerParams,
        function (netData){
          //取出返回结果的列表
          return netData.data;
        },
        function(item){
         
        },
        {},
        'GET',
    );

    //加载个人名师列表
    // var that = this;
    // var myLikeTeacherParams = {
    //   userId : wx.getStorageSync(user.UserID),
    //   pageSize : 3,
    //   pageNum : 1,
      
    // };    
    // listViewUtil.loadList(that,'my_like_teacher',config.PytheRestfulServerURL,
    // base.MY_TEACHER_COLLECTION_URL_DETAIL,
    // 10,
    //     myLikeTeacherParams,
    //     function (netData){
    //       //取出返回结果的列表
    //       return netData.data;
    //     },
    //     function(item){
         
    //     },
    //     {},
    //     'GET',
    // );
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})