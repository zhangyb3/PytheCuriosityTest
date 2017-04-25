// pages/answer/answer.js


var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");
var timer = require("../../utils/wxTimer.js");

Page({
  data:{
    answer_page_sections:['分类','排序'],
    answer_page_menu:[{
        name:"分类",
        value:"classification",
        active:false
    },{
        name:"排序",
        value:"sort",
        active:false
    }],
    subject_infos: [
     
    ],
    
    questionsForAnswer:[
          
    ],
    selectSubject:'',
    sortSortAttribute:'',
    sort_attributes:[
      { key: 1, name: '按时间' },
      { key: 2, name: '按金额' }
    ],
    
    answer_page_filter:{
      selectSubject:{
        subjectId:-1,
        subjectName:'科目',
      },
      selectSort:{
        sortId:'startTime',
        sortName:'排序',
      },
    },

    wxTimerList:[],

    preview_img_url: config.PytheFileServerURL ,
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
    scrollHeight:0
  },
  onLoad:function(options){

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          // scrollHeight: res.windowHeight - (100 * res.windowWidth / 750) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
          scrollHeight: res.windowHeight - (100 * res.windowWidth / 750)
        });
      }
    })


    this.setData({
      hide_register_lock_cover: false,
    });

    
      this.setData({
        hide_register_lock_cover: true,
      });
   

   
    this.setData({hide_pop_subject_list:true});
    this.setData({hide_pop_sort_attribute_list:true});

    
    
    
  },

  subject_filter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var answer_page_menu = this.data.answer_page_menu;
    if(answer_page_menu[0].value == value)
    {
      console.log("classification");
      this.data.answer_page_menu[0].active = true;
      this.data.answer_page_menu[1].active = false;
      if(this.data.hide_pop_subject_list == true)
      {
        //收起排序属性列表
        this.setData({hide_pop_sort_attribute_list:true});
        //弹出科目列表
        this.setData({hide_pop_subject_list:false});
      }
      else
      {
        //收起排序属性列表
        this.setData({hide_pop_sort_attribute_list:true});
        //弹出科目列表
        this.setData({hide_pop_subject_list:true});

        this.data.answer_page_menu[0].active = false;
        this.data.answer_page_menu[1].active = false;
      }
      
    }
    else
    {
      this.data.answer_page_menu[0].active = false;
      this.data.answer_page_menu[1].active = true;
    }
    this.setData({answer_page_menu : answer_page_menu});
    
  },

  sort_by_attribute:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var answer_page_menu = this.data.answer_page_menu;
    if(answer_page_menu[1].value == value)
    {
      console.log("sort");
      this.data.answer_page_menu[1].active = true;
      this.data.answer_page_menu[0].active = false;
      if(this.data.hide_pop_sort_attribute_list == true)
      {
        //收起科目列表
        this.setData({hide_pop_subject_list:true});
        //弹出排序属性列表
        this.setData({hide_pop_sort_attribute_list:false});
      }
      else
      {
        //收起科目列表
        this.setData({hide_pop_subject_list:true});
        //弹出排序属性列表
        this.setData({hide_pop_sort_attribute_list:true});

        this.data.answer_page_menu[1].active = false;
        this.data.answer_page_menu[0].active = false;
      }
      
    }
    else
    {
      this.data.answer_page_menu[1].active = false;
      this.data.answer_page_menu[0].active = true;
    }
    this.setData({answer_page_menu : answer_page_menu});

  },

  selectSubject:function(e){
    
    var select_subject = e.currentTarget.dataset.select_subject;
    console.log(select_subject.subject);
    
    this.data.answer_page_filter.selectSubject.subjectName = select_subject.subject;
    this.data.answer_page_filter.selectSubject.subjectId = select_subject.subjectid;
    this.setData({answer_page_filter: this.data.answer_page_filter});
    this.setData({hide_pop_subject_list:true});

    var answer_page_menu = this.data.answer_page_menu;
    this.data.answer_page_menu[0].active = false;
    this.data.answer_page_menu[1].active = false;
    this.setData({answer_page_menu : answer_page_menu});

    var teacherId = -1;
    if(wx.getStorageSync(user.UserID) != 'TeacherID')
    {
      teacherId = wx.getStorageSync(user.UserID);
    }
    var that = this;
    var conditionQuestionParams = {
      subjectId: that.data.answer_page_filter.selectSubject.subjectId,
      condition: that.data.answer_page_filter.selectSort.sortId,
      order: 'desc',     
      pageNum: 1,
      pageSize: 10,   
      teacherId: teacherId,
    };
    listViewUtil.loadList(that,'question',config.PytheRestfulServerURL,
    "/answer/conditionList",
    10,
        conditionQuestionParams,
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

  selectSortAttribute:function(e){
    
    var selected_sort_attribute = e.currentTarget.dataset.name;
    console.log(selected_sort_attribute);
    
    this.setData({hide_pop_sort_attribute_list:true});
    
    var answer_page_menu = this.data.answer_page_menu;
    this.data.answer_page_menu[0].active = false;
    this.data.answer_page_menu[1].active = false;
    this.setData({answer_page_menu : answer_page_menu});

    var teacherId = -1;
    if(wx.getStorageSync(user.UserID) != 'TeacherID')
    {
      teacherId = wx.getStorageSync(user.UserID);
    }
    var that= this;
    var conditionQuestionParams = {
        subjectId: that.data.answer_page_filter.selectSubject.subjectId,
        order: 'desc',     
        pageNum: 1,
        pageSize: 10,   
        teacherId: teacherId,
    };
    that.data.answer_page_filter.selectSort.sortName = selected_sort_attribute;
    if(selected_sort_attribute == "按金额")
    {
      conditionQuestionParams.condition = 'reward';
       that.data.answer_page_filter.selectSort.sortId = 'reward';
    }
    if(selected_sort_attribute == "按时间")
    {
      conditionQuestionParams.condition = 'startTime';
      that.data.answer_page_filter.selectSort.sortId = 'startTime';
    }
    that.setData({answer_page_filter: this.data.answer_page_filter});

    listViewUtil.loadList(that,'question',config.PytheRestfulServerURL,
    "/answer/conditionList",
    10,
        conditionQuestionParams,
        function (netData){
          //取出返回结果的列表
          return netData.data;
        },
        function(item){
          wx.showToast({
              title: item.question.questionid,
              icon: 'success',
              duration: 1500
          })
          runTimer.call(item,that);
        },
        {},
        'GET',
    );

  },

  returnAnswerPage: function(e) {
      console.log("return to answer page");
      this.setData({hide_pop_subject_list:true});
      this.setData({hide_pop_sort_attribute_list:true});

      var answer_page_menu = this.data.answer_page_menu;
      this.data.answer_page_menu[0].active = false;
      this.data.answer_page_menu[1].active = false;
      this.setData({answer_page_menu : answer_page_menu});
  },

  selectOneItem:function(e){

    //先判断是否已注册
    if(wx.getStorageSync('alreadyRegister') == 'no')
    {
      this.setData({
        hide_login: false,
      });
      loadingSelections.call(this);
    }
    if(wx.getStorageSync('alreadyRegister') == 'yes')
    {
      console.log("navigate to answer operation page");
      var parametersJSON = e.currentTarget.dataset.item;
      parametersJSON.question_id = parametersJSON.question.questionid;
      parametersJSON.subject_id = parametersJSON.question.subjectid;
      parametersJSON.student_id = parametersJSON.question.studentid;
      parametersJSON.text_content = parametersJSON.question.questioncontent.text[0];
      parametersJSON.photo_path = parametersJSON.question.questioncontent.img[0];
      parametersJSON.draw_path = parametersJSON.question.questioncontent.draw[0];
      parametersJSON.audio_path = parametersJSON.question.questioncontent.audio[0];
      parametersJSON.audio_duration = parametersJSON.question.questioncontent.audio[1];
      console.log(parametersJSON);
      var parameters = netUtil.json2Form(parametersJSON);
      // console.log(parameters);
      wx.navigateTo({
        url: 'answer_operation' + '?' + parameters,
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

  registerToMainPage:function(e){
    var that = this;
    if(that.data.registerParams.status == 0 && that.data.registerParams.gradeId == null)
    {
      wx.showModal({
        title: '提示',
        content: '年级必填',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else if( that.data.registerParams.status == 1 && that.data.registerParams.subjectId == null)
    {
      wx.showModal({
        title: '提示',
        content: '科目必填',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else if((that.data.registerParams.status == 1 && that.data.registerParams.subjectId != null) || (that.data.registerParams.status == 0 && that.data.registerParams.gradeId != null))
    {
      //注册
      wx.request({
        url: config.PytheRestfulServerURL + '/user/register/',
        data: {
          status:this.data.registerParams.status,
          userName: wx.getStorageSync('wxNickName'),
          phoneNum: wx.getStorageSync('registerPhoneNum'),
          verificationCode: wx.getStorageSync('verificationCode'),
          gradeId: this.data.registerParams.gradeId,
          subjectId: this.data.registerParams.subjectId,
          openId: wx.getStorageSync(user.OpenID),
          userImg: wx.getStorageSync('userAvatarUrl'),
        },
        method: 'POST',
        success: function(res){
          // success
          console.log(res);
          if(res.data.data==null)
          {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          }
          else if(res.data.data.userid != null)
          {
            wx.setStorageSync(user.UserID, res.data.data.userid);
            wx.setStorageSync(user.StudentID, res.data.data.studentid);
            wx.setStorageSync(user.TeacherID, res.data.data.teacherid);
            wx.setStorageSync(user.GradeID, res.data.data.gradeid);

            //判断注册是否成功，成功则返回index页面
            wx.setStorageSync('alreadyRegister', 'yes');
            that.setData({
              hide_login:true,
            });
          }
          
        },
        fail: function() {
          // fail
          wx.showModal({
            title: '提示',
            content: '登录失败，请重试',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        },
        
      });
    }
  },
  cancelRegister:function(e){
    this.setData({
      hide_login: true,
    });
  },


  

  

  onReady:function(){
    // 页面渲染完成

    //获取科目列表
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/index/subject' ,
      data: {
        gradeId: wx.getStorageSync(user.GradeID),
      },
      method: 'GET', 
      success: function(res){
        // success
        
        that.data.subject_infos = res.data;
        that.setData({
          subject_infos : that.data.subject_infos,
        });
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });
  },
  onShow:function(){
    // 页面显示

    // 获取默认问题列表
    var teacherId = -1;
    if(wx.getStorageSync(user.UserID) != 'TeacherID')
    {
      teacherId = wx.getStorageSync(user.UserID);
    }
    var that = this;
    var questionListParams = {
      pageSize: 10,
      pageNum: 1,
      teacherId: teacherId,
    };
    listViewUtil.loadList(that,'question',config.PytheRestfulServerURL,
    "/answer/defaultList",
    10,
        questionListParams,
        function (netData){
          //取出返回结果的列表
          return netData.data;
        },
        function(item,that){
          item.countdown.start(that);
        },
        {},
        'GET',
    );


  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

})

//注册准备
function loadingSelections() {
  console.log('load picker dataset');

  this.data.registerParams.gradeId = null;
  this.data.registerParams.subjectId = null;


  // 页面初始化 options为页面跳转所带来的参数
  this.setData({
    hide_subject_selection:true,
    hide_grade_selection:false,
    select_student:true,
    select_teacher:false
  });
  this.data.registerParams.status = 0;

  var that = this;

  var subjectRange = ['请选择'];
  //加载动态课程列表,年级列表
  wx.request({
    url: config.PytheRestfulServerURL + '/user/register/subject',
    data: {

    },
    method: 'GET', 
    success: function(res){
      // success
      console.log(res.data.data);
      
      for(var count = 0; count < res.data.data.data.length; count++)
      {
        
        subjectRange[count+1] = res.data.data.data[count].subject;
        that.data.subjects[count+1] = res.data.data.data[count];
        console.log(subjectRange);
      }
      
      that.setData({
        subjectRange: subjectRange,
      });
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  });

  var gradeRange = ['请选择'];
  //加载动态课程列表,年级列表
  wx.request({
    url: config.PytheRestfulServerURL + '/user/register/grade',
    data: {

    },
    method: 'GET', 
    success: function(res){
      // success
      console.log(res.data.data);
      
      for(var count = 0; count < res.data.data.data.length; count++)
      {
        
        gradeRange[count+1] = res.data.data.data[count].gradename;
        that.data.grades[count+1] = res.data.data.data[count];
        console.log(gradeRange);
      }
      
      that.setData({
        gradeRange: gradeRange,
      });
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  });
}

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

function runTimer(timer,that)
{
  timer.start(that);
}

