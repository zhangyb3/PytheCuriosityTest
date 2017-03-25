// pages/ask/ask.js

var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");

var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

Page({
  data:{
    ask_page_menu:[{
        name:"科目",
        value:"subject",
        active:true
    },{
        name:"名师",
        value:"teacher",
        active:false
    }],

    subjects:[
      {
        subjectId:1001,
        subject_name: '数学',
      },
      {
        subjectId:2,
        subject_name: '物理',
      },
      {
        subjectId:3,
        subject_name: '化学',
      },
    ],

     ask_teacher_list:[
      {
        teacherid:0,
        teacher_name: '都教授',
      },{
        teacher_name: '孙悟空',
      },{
        teacher_name: '猪八戒',
      },
      {
        teacher_name: '白骨精',
      },
    ],
    subjects_discribe:[
      {
        sub_dis: '数学（mathematics或maths），是研究数量、结构、变化、空间以及信息等概念的一门学科，从某种角度看属于形式科学的一种。',
      },{
        sub_dis: '数学（mathematics或maths），是研究数量、结构、变化、空间以及信息等概念的一门学科，从某种角度看属于形式科学的一种。',
      },{
        sub_dis: '数学（mathematics或maths），是研究数量、结构、变化、空间以及信息等概念的一门学科，从某种角度看属于形式科学的一种。',
      },
      {
        sub_dis: '数学（mathematics或maths），是研究数量、结构、变化、空间以及信息等概念的一门学科，从某种角度看属于形式科学的一种。',
      },
    ]

    },
  onLoad:function(options){
    
    

    this.setData({hide_ask_subject_list:false});
    this.setData({hide_ask_teacher_list:true});

    this.setData({ask_subject_list: this.data.subjects});
    // this.setData({ask_teacher_list: this.data.teachers});

    var that = this;
    var simple_params = {
      pageSize : 3,
      pageNum : 1,
    };
    listViewUtil.loadList(that,'teacher',config.PytheRestfulServerURL,
    "/question/teacherList/",
    10,
        simple_params,
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

  subject_filter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var ask_page_menu = this.data.ask_page_menu;
    if(ask_page_menu[0].value == value)
    {
      console.log("subject");
      this.data.ask_page_menu[0].active = true;
      this.data.ask_page_menu[1].active = false;
      
      this.setData({hide_ask_teacher_list:true});
      
      this.setData({hide_ask_subject_list:false});
    }
    else
    {
      this.data.ask_page_menu[0].active = false;
      this.data.ask_page_menu[1].active = true;
    }
    this.setData({ask_page_menu : ask_page_menu});
    
  },

  teacher_filter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    // console.log(value);
    var ask_page_menu = this.data.ask_page_menu;
    if(ask_page_menu[1].value == value)
    {
      console.log("teacher");
      this.data.ask_page_menu[1].active = true;
      this.data.ask_page_menu[0].active = false;
      
      this.setData({hide_ask_subject_list:true});
      
      this.setData({hide_ask_teacher_list:false});
    }
    else
    {
      this.data.ask_page_menu[1].active = false;
      this.data.ask_page_menu[0].active = true;
    }
    this.setData({ask_page_menu : ask_page_menu});

  },

  selectOneSubject:function(e){
      console.log("navigate to ask operation page");
      var parametersJSON = e.currentTarget.dataset.item;
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
  },

  selectOneTeacher:function(e){
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
  },


  likeTeacher:function(e){
    var teacher = e.currentTarget.dataset.teacher;
    console.log(teacher);
    var teacher_index = e.currentTarget.dataset.index;
    console.log(teacher_index);

    // if(teacher.not_like == true){

      this.data.ask_teacher_list[teacher_index].popularity++;
      this.setData({
        ask_teacher_list: this.data.ask_teacher_list,
      });
      //通知数据库更新纪录
      wx.request({
        url: config.PytheRestfulServerURL + '/question/teacher/likes',
        data: {
          userId: user.UserID,
          teacherId: teacher.teacherid,
        },
        method: 'GET', 
        success: function(res){
          console.log(res);
        },
        fail: function(res) {
          console.log(res);
        }
      })

    // };
    
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