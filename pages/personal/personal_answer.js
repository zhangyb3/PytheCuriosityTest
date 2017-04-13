// pages/personal/personal_answer.js

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

Page({
  data:{
    personal_answer_menu:[{
        name:"已答",
        value:"already answer",
        active:true
    },{
        name:"未答",
        value:"not answer",
        active:false
    }],

    personal_answer_list:[
      
    ],

    personal_not_answer_list:[
      
    ],

    hide_show_image_page: true,


    hide_personal_answer_list:false,
    hide_personal_not_answer_list:true,
    preview_img_url: config.PytheFileServerURL ,
  },
  onLoad:function(parameters){
    console.log("from personal");
    console.log(parameters);
    
    //加载个人已答列表
    var that = this;
    var myAnsweredParams = {
      teacherId : wx.getStorageSync(user.TeacherID),
      pageSize : 3,
      pageNum : 1,
      
    };    
    listViewUtil.loadList(that,'my_answered',config.PytheRestfulServerURL,
    base.MY_ANSWERED_URL_DETAIL,
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

    //加载个人未答列表
    var that = this;
    var myUnanswerParams = {
      teacherId : wx.getStorageSync(user.TeacherID),
      pageSize : 3,
      pageNum : 1,
      
    };    
    listViewUtil.loadList(that,'my_unanswer',config.PytheRestfulServerURL,
    base.MY_UNANSWER_URL_DETAIL,
    10,
        myUnanswerParams,
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



  selectAlreadyAnswer:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var personal_answer_menu = this.data.personal_answer_menu;
    if(personal_answer_menu[0].value == value)
    {
      console.log("已答");
      this.data.personal_answer_menu[0].active = true;
      this.data.personal_answer_menu[1].active = false;
      
      this.setData({hide_personal_answer_list:false});
      
      this.setData({hide_personal_not_answer_list:true});
    }
    else
    {
      this.data.personal_answer_menu[0].active = false;
      this.data.personal_answer_menu[1].active = true;
    }
    this.setData({personal_answer_menu : personal_answer_menu});
    
  },

  selectNotAnswer:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var personal_answer_menu = this.data.personal_answer_menu;
    if(personal_answer_menu[1].value == value)
    {
      console.log("未答");
      this.data.personal_answer_menu[1].active = true;
      this.data.personal_answer_menu[0].active = false;
      
      this.setData({hide_personal_answer_list:true});
      
      this.setData({hide_personal_not_answer_list:false});
    }
    else
    {
      this.data.personal_answer_menu[0].active = false;
      this.data.personal_answer_menu[1].active = true;
    }
    this.setData({personal_answer_menu : personal_answer_menu});

  },

  selectOneNotAnswer:function(result){
    var index = result.currentTarget.dataset.index;
    var parametersJSON = result.currentTarget.dataset.item;
    parametersJSON.question_id = parametersJSON.questionid;
    parametersJSON.subject_id = parametersJSON.subjectid;
    parametersJSON.student_id = parametersJSON.studentid;
    parametersJSON.text_content = parametersJSON.questioncontent.text[0];
    parametersJSON.photo_path = parametersJSON.questioncontent.img[0];
    parametersJSON.draw_path = parametersJSON.questioncontent.draw[0];
    parametersJSON.audio_path = parametersJSON.questioncontent.audio[0];
    parametersJSON.audio_duration = parametersJSON.questioncontent.audio[1];
    console.log(parametersJSON);
    var parameters = netUtil.json2Form(parametersJSON);
    console.log(parameters);
    wx.navigateTo({
      url: '../answer/answer_operation' + '?' + parameters,
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