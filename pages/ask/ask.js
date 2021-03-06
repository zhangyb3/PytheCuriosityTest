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
        name:"科目老师",
        value:"subject",
        active:true
    },{
        name:"我的老师",
        value:"teacher",
        active:false
    }],

    subjectList:[
      
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
        sub_dis: '元素周期表、化学方程式',
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
        subject_name: '编程',
        sub_dis: '数据结构、算法、机器码',
        icon:'../../images/icon_computer@2x.png',
      },
      {
        subjectId:1012,
        subject_name: '政治',
        sub_dis: '生产关系、代议制、所有制',
        icon:'../../images/question1_icon_political@2x.png',
      },  
    ],

    ask_teacher_list:[
     
    ],
    search_teacher_list:[],
    
    hide_register_lock_cover: false,

    hide_login:true,
    select_student:true,
    select_teacher:false,

    grades: [
      {
        gradeId: null,
        grade: '请选择',
      }, 
      
      
    ],
    grade_index:0,

    subjects: [
      {
        subjectId: null,
        subject: '请选择',
      }, 
      
      
    ],
    subject_index:0,

    hide_subject_selection:true,
    hide_grade_selection:false,
    selectStudent:true,
    selectTeacher:false,

    registerParams: {
      status: null,
      gradeId: null,
      subjectId: null,
    },

    countdownText : '发送验证码',
    second: 60,

    list_height: 0,
    list_mode:'subject_list',

    hide_loading: true,

    searchParameters : {
      query: '',
      subjectId: -1,
      userId: -1,
      pageNum: 1,
      pageSize: 10
    },
    ask_page: true,

    requestingResultList: false,

  },
  onLoad:function(parameters){

    
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        that.setData({
          scrollHeight: res.windowHeight ,
          list_height: res.windowHeight ,
        });
      }
    });
    
    this.setData({
      hide_register_lock_cover: true,
    });
     
    var hide_which = parameters.hide_which;
    this.data.hide_which = hide_which;
    if(hide_which == 'teacher')
    {
      this.data.ask_page_menu[0].active = true;
      this.data.ask_page_menu[1].active = false;
      
      this.setData({hide_ask_teacher_list:true});
      
      this.setData({hide_ask_subject_list:false});
      this.data.list_mode = 'subject_list';
    }
    if(hide_which == 'subject')
    {
      this.data.ask_page_menu[1].active = true;
      this.data.ask_page_menu[0].active = false;
      
      this.setData({hide_ask_subject_list:true});
      
      this.setData({hide_ask_teacher_list:false});
      this.data.list_mode = 'teacher_list';  
      this.setData({hide_teacher_list:false});
    }
    this.setData({ask_page_menu : this.data.ask_page_menu});

    this.setData({ask_subject_list: this.data.subjectList});
    // this.setData({ask_teacher_list: this.data.teachers});

    
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
      this.data.list_mode = 'subject_list';
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
      this.data.list_mode = 'teacher_list';  
      this.setData({hide_teacher_list:false});    
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
    // if(wx.getStorageSync('alreadyRegister') == 'no')
    // {
    //   this.setData({
    //     hide_login: false,
    //   });
    //   register.loadRegisterSelections(this);
    // }
    // else
    {
      // console.log("navigate to ask operation page");
      // var parametersJSON = e.currentTarget.dataset.item;
      // console.log(parametersJSON);
      // var parameters = netUtil.json2Form(parametersJSON);
      // // console.log(parameters);
      // wx.navigateTo({
      //   url: 'ask_operation' + '?' + parameters,
      //   success: function(res){
      //     // success
      //     // console.log(res);
      //   },
      //   fail: function() {
      //     // fail
      //     // console.log(res);
      //   },
      //   complete: function() {
      //     // complete
      //     // console.log(res);
      //   }
      // })

    //   var that = this;
    //   console.log("teacher");
    //   this.data.ask_page_menu[1].active = true;
    //   this.data.ask_page_menu[0].active = false;
      
    //   this.setData({hide_ask_subject_list:true});
      
    //   this.setData({hide_ask_teacher_list:false});
    //   this.data.list_mode = 'teacher_list';
    //   that.setData({
    //     ask_page_menu : this.data.ask_page_menu,
    //     hide_teacher_list: false,
    //   });

    //   this.data.searchParameters.subjectId = e.currentTarget.dataset.item.subjectId;
    //   if(wx.getStorageSync(user.StudentID) != 'StudentID')
    //   {
    //     this.data.searchParameters.userId = wx.getStorageSync(user.StudentID);
    //   }
       
      
    //   listViewUtil.loadList(that,'index_search_teacher',config.PytheRestfulServerURL,
    //   "/index/search/teacher",
    //   10,
    //       this.data.searchParameters,
    //       function (netData){
    //         //取出返回结果的列表
    //         return netData.data;
    //       },
    //       function(item){
          
    //       },
    //       {},
    //       'GET',
    //   );

      console.log(e.currentTarget.dataset.item);
      wx.navigateTo({
        url: 'teachers?subjectId=' + e.currentTarget.dataset.item.subjectId ,
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

    }

    
      
  },

  askOneTeacher:function(e){
    console.log(wx.getStorageSync(user.Status));
    //先判断是否已注册
    if(wx.getStorageSync('alreadyRegister') == 'no')
    {
      this.setData({
        hide_login: false,
      });
      register.loadRegisterSelections(this);
    }
    if(wx.getStorageSync('alreadyRegister') == 'yes' && wx.getStorageSync(user.Status) == 0)
    {
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
    }
    if(wx.getStorageSync(user.Status) == 1)
    {
      wx.showModal({
        content: '老师尚未开通发问功能',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } 
  },


  likeTeacher:function(e){
    var teacher = e.currentTarget.dataset.teacher;
    console.log(teacher);
    var teacher_index = e.currentTarget.dataset.index;
    console.log(teacher_index);   

     var that = this; 
    
    if(that.data.search_teacher_list[teacher_index].collectOrNot == false)
    {
      //通知数据库更新纪录
      wx.request({
        url: config.PytheRestfulServerURL + '/question/teacher/likes',
        data: {
          userId: wx.getStorageSync(user.UserID),
          // teacherId: teacher.teacherid,
          teacherId: teacher.userid,
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

          if(res.data.data == '关注成功')
          {
            that.data.search_teacher_list[teacher_index].collectOrNot = true;
            that.setData({
              search_teacher_list: that.data.search_teacher_list,
            });
            wx.showToast({
              title: '已关注',
              icon: 'success',
              duration: 1000
            });
          }
          
        },
        fail: function(res) {
          console.log(res);
        }
      });
    }   
    
  },
  cancelRegister:function(e){
    this.setData({
      hide_login: true,
    });
  },


  selectStudent:function(e){
    console.log("学生");
    this.setData({
      hide_subject_selection:true,
      hide_grade_selection:false,
      select_student:true,
      select_teacher:false
    })

    this.data.registerParams.status = 0;
  },
  selectTeacher:function(e){
    console.log("老师");
    this.setData({
      hide_subject_selection:false,
      hide_grade_selection:true,
      select_student:false,
      select_teacher:true
    })

    this.data.registerParams.status = 1;
    this.data.registerParams.gradeId = 332;
  },

  gradeChange: function(e) {
    console.log('年级', this.data.grades[e.detail.value])
    this.setData({
      grade_index: e.detail.value      
    })

    this.data.registerParams.gradeId = this.data.grades[e.detail.value].gradeid;
  },
  subjectChange: function(e) {
    console.log('科目', this.data.subjects[e.detail.value])
    this.setData({
      subject_index: e.detail.value
    })

    this.data.registerParams.subjectId = this.data.subjects[e.detail.value].subjectid;
  },

  //注册
  phoneNumberInput: function(e) {
    var registerPhoneNum = e.detail.value;
      console.log(e.detail.value);
      wx.setStorageSync('registerPhoneNum', registerPhoneNum);
  },

  sendVerificationCode:function(res) {
    console.log(wx.getStorageSync('registerPhoneNum'));
    register.sendVerificationCode(wx.getStorageSync('registerPhoneNum'));

    //重发倒数
    var that = this;
    
    that.setData({  
      second: 60,  
      lock_countdown: true,
      }); 
    countdown(that);
    if (second < 0) {  
      that.setData({  
        countdownText: "重发验证码"  ,
        lock_countdown: false,
      });  
    }
  },

  verificationCodeInput: function(e) {
    var verificationCode = e.detail.value;
    console.log(e.detail.value);
    wx.setStorageSync('verificationCode', verificationCode);
  },

  registerToMainPage: function (e) {
    register.commitRegister(this);
  },


  enterPersonalAsk:function(e){
    console.log('enter personal ask page');
    if(wx.getStorageSync('StudentID') != 'StudentID')
    {
      wx.navigateTo({
        url: '../personal/personal_ask' ,
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
    }

  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示

    this.setData({
      alreadyRegister: wx.getStorageSync('alreadyRegister'),
    });

    var that = this;
    // var simple_params = {
    //   userId: wx.getStorageSync(user.UserID),
    //   pageSize : 10,
    //   pageNum : 1,
    // };
    // this.setData({
    //   hide_loading: false,
    // });
    // listViewUtil.loadList(that,'teacher',config.PytheRestfulServerURL,
    // "/question/teacherList",
    // 10,
    //     simple_params,
    //     function (netData){
    //       //取出返回结果的列表
    //       return netData.data;
    //     },
    //     function(item,that){
    //       that.setData({
    //         hide_loading: true,
    //       });
    //     },
    //     {},
    //     'GET',
    // );
    
    if(wx.getStorageSync(user.StudentID) != 'StudentID')
    {
      this.data.searchParameters.userId = wx.getStorageSync(user.StudentID);
    }
       
    listViewUtil.loadList(that,'collection_teacher',config.PytheRestfulServerURL,
    "/collection/teacher",
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


  checkTeacherInfo:function(e){
    var teacher = (e.currentTarget.dataset.teacher);

    wx.navigateTo({
      url: 'teacherInfo?userId=' + teacher.userid,
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
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



function countdown(that) {
  var second = that.data.second ;
    if (second < 0) {  
      that.setData({  
        countdownText: "重发验证码" ,
        lock_countdown: false,
      });  
      return ;  
  } 

  var time = setTimeout(function(){  
    that.setData({  
      
      countdownText: second + '秒后可重发',
      second: second - 1  ,
      lock_countdown: true,
    });  
    countdown(that);  
    }  
    ,1000)  
}