// pages/ask/ask.js

var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");
var user = require("../../utils/user.js");
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
        sub_dis: '代数、几何、概率',
        icon:'../../images/question1_icon_math@2x.png',
      },
      {
        subjectId:1002,
        subject_name: '英语',
        sub_dis: '翻译、作文、语法',
        icon:'../../images/question1_icon_English@2x.png',
      },
      {
        subjectId:1003,
        subject_name: '语文',
        sub_dis: '文言文、古诗词解析、成语',
        icon:'../../images/question1_icon_language@2x.png',
      },
      {
        subjectId:1004,
        subject_name: '艺术',
        sub_dis: '音乐、舞蹈、美术',
        icon:'../../images/icon_art@2x.png',
      },
      {
        subjectId:1005,
        subject_name: '健康',
        sub_dis: '运动、养生',
        icon:'../../images/icon_health@2x.png',
      },
      {
        subjectId:1006,
        subject_name: '物理',
        sub_dis: '能量守恒、自由落体、加速度',
        icon:'../../images/question1_icon_physics@2x.png',
      },
      {
        subjectId:1007,
        subject_name: '化学',
        sub_dis: '元素周期表、化学方程式、分子',
        icon:'../../images/question1_icon_chemical@2x.png',
      },
      {
        subjectId:1008,
        subject_name: '生物',
        sub_dis: '细胞、物种、食物链',
        icon:'../../images/question1_icon_biont@2x.png',
      },
      {
        subjectId:1009,
        subject_name: '地理',
        sub_dis: '时区、地形、星系',
        icon:'../../images/question1_icon_geography@2x.png',
      },
      {
        subjectId:1010,
        subject_name: '历史',
        sub_dis: '春秋战国、分封制、诸子百家',
        icon:'../../images/question1_icon_history@2x.png',
      },
      {
        subjectId:1011,
        subject_name: '计算机',
        sub_dis: '数据结构、算法、机器码',
        icon:'../../images/question1_icon_political@2x.png',
      },
      
      
     
      
    ],

     ask_teacher_list:[
     
    ],

    
    hide_register_lock_cover: false,

  },
  onLoad:function(options){

    this.setData({
      hide_register_lock_cover: false,
    });
    
    
    
      this.setData({
        hide_register_lock_cover: true,
      });
    
    

    
    

    this.setData({hide_ask_subject_list:false});
    this.setData({hide_ask_teacher_list:true});

    this.setData({ask_subject_list: this.data.subjects});
    // this.setData({ask_teacher_list: this.data.teachers});

    var that = this;
    var simple_params = {
      userId: wx.getStorageSync(user.UserID),
      pageSize : 10,
      pageNum : 1,
    };
    listViewUtil.loadList(that,'teacher',config.PytheRestfulServerURL,
    "/question/teacherList",
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

    //先判断是否已注册


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

    //先判断是否已注册

    
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

     var that = this; 
    
      //通知数据库更新纪录
      wx.request({
        url: config.PytheRestfulServerURL + '/question/teacher/likes',
        data: {
          userId: wx.getStorageSync(user.UserID),
          teacherId: teacher.teacherid,
        },
        method: 'GET', 
        success: function(res){
          

          console.log(res);
          if(res.data.data == 1)
          {
            that.data.ask_teacher_list[teacher_index].popularity++;
            that.data.ask_teacher_list[teacher_index].isClick = 0;
            that.setData({
              ask_teacher_list: that.data.ask_teacher_list,
            });
            wx.showToast({
              title: '点赞+1',
              icon: 'success',
              duration: 1000
            });
          }
          
        },
        fail: function(res) {
          console.log(res);
        }
      })
        
    
  },








  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示

    this.setData({
      alreadyRegister: wx.getStorageSync('alreadyRegister'),
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})