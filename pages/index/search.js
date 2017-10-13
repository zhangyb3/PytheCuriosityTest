// pages/index/search.js
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

    index_search_menu:[{
        name:"知识点",
        value:"knowledge",
        active:true
    },{
        name:"教师",
        value:"teacher",
        active:false
    },{
        name:"机构",
        value:"organization",
        active:false
    }],

    searchContent:'',

    hide_knowledge_list:false,
    hide_teacher_list: true,
    hide_org_list: true,

    infos: [],
    search_knowledge_list:[],
    search_teacher_list:[],
    search_org_list:[],

    search_page: true,

    list_mode: 'index_search_knowledge',
    // list_type: 'index',

    preview_img_url: config.PytheFileServerURL ,

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

    organization: {},

    countdownText : '发送验证码',
    second: 60,

    show_cancel_button: true,
    foucs_on_input: false,

    requestingResultList: false,

  },
  onLoad:function(parameters){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight,
          show_cancel_button: this.data.show_cancel_button
        });
      }
    });

    console.log(parameters);
    this.data.searchContent = decodeURIComponent(parameters.searchContent);
    if((this.data.searchContent) != "undefined"){ 
      this.setData({
        searchContent: this.data.searchContent,
      });
      searchByContent(this);
    }

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },

  cleanPlaceholder:function(e){
    this.setData({
      searchContent: ''
    });
    
  },
  listenSearchInput:function(e){
    console.log(e.detail.value);
    this.data.searchContent = e.detail.value;
    this.data.show_cancel_button = true;
    
  },
  listenSearchInput_: function (e) {
    
    this.data.show_cancel_button = true;
    this.setData({
      show_cancel_button: this.data.show_cancel_button,
      focus_on_input: true,
    });
  },
  searchByContent:function(e){
    var that = this;
    searchByContent(that);
    
    this.data.show_cancel_button = true;
    this.setData({
      show_cancel_button: this.data.show_cancel_button,
      focus_on_input: false,
    });
  },
  cancelSearchInput: function(e) {
    
    this.data.show_cancel_button = false;
    this.setData({
      searchContent: '',
      show_cancel_button: this.data.show_cancel_button,
      focus_on_input: false,
    });
  },

  knowledgeFilter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var index_search_menu = this.data.index_search_menu;
    //if(index_search_menu[0].value == value)
    {
      console.log("knowledge");
      this.data.index_search_menu[0].active = true;
      this.data.index_search_menu[1].active = false;
      this.data.index_search_menu[2].active = false;
      
      this.setData({hide_teacher_list:true});
      this.setData({hide_org_list:true});
      
      this.setData({hide_knowledge_list:false});
      this.data.list_mode = 'index_search_knowledge';
      // this.setData({
      //   search_knowledge_list: this.data.search_knowledge_list
      // });
    }
    
    this.setData({index_search_menu : index_search_menu});
    
  },

  teacherFilter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var index_search_menu = this.data.index_search_menu;
    //if(index_search_menu[1].value == value)
    {
      console.log("teacher");
      this.data.index_search_menu[1].active = true;
      this.data.index_search_menu[0].active = false;
      this.data.index_search_menu[2].active = false;
      
      this.setData({hide_knowledge_list:true});
      this.setData({hide_org_list:true});
      
      this.setData({hide_teacher_list:false});
      this.data.list_mode = 'index_search_teacher';
      // this.setData({
      //   search_teacher_list: this.data.teacher_list
      // });
    }
    
    this.setData({index_search_menu : index_search_menu});

  },

  orgFilter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var index_search_menu = this.data.index_search_menu;
    //if(index_search_menu[2].value == value)
    {
      console.log("organization");
      this.data.index_search_menu[2].active = true;
      this.data.index_search_menu[0].active = false;
      this.data.index_search_menu[1].active = false;
      
      this.setData({hide_knowledge_list:true});
      this.setData({hide_teacher_list:true});
      
      this.setData({hide_org_list:false});
      this.data.list_mode = 'index_search_org';
      // this.setData({
      //   search_org_list: this.data.search_org_list
      // });
    }
    
    this.setData({index_search_menu : index_search_menu});

  },

  askOneTeacher:function(e){
    var teacher = e.currentTarget.dataset.teacher;
    console.log(teacher);

    //先判断是否已注册
    if(wx.getStorageSync('alreadyRegister') == 'no')
    {
      this.setData({
        hide_login: false,
      });
      loadingSelections.call(this);
    }
    if(wx.getStorageSync('alreadyRegister') == 'yes' && wx.getStorageSync(user.Status) == 0)
    {
      console.log("navigate to ask operation page");
      teacher['teacherid'] = teacher.userid;
      teacher['subjectId'] = teacher.subjectid;
      var parametersJSON = teacher;
      
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

  askOneOrg:function(e){
    var org = e.currentTarget.dataset.org;
    console.log(org);
    wx.navigateTo({
      url: 'orgInfo?' 
          + 'orgId=' + org.id + '&'
          + 'orgManagerId=' + org.managerId + '&'
          ,
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

  likeTeacher:function(e){
    var teacher = e.currentTarget.dataset.teacher;
    console.log('student ' + wx.getStorageSync(user.StudentID) + " like teacher " + teacher.username);

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

  checkTeacherInfo:function(e){
    var teacher = (e.currentTarget.dataset.teacher);

    wx.navigateTo({
      url: '../../ask/teacherInfo?userId=' + teacher.userid,
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
    })

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
              title: '收藏成功',
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

  checkTeacherInfo:function(e){
    var teacher = (e.currentTarget.dataset.teacher);

    wx.navigateTo({
      url: '../ask/teacherInfo?userId=' + teacher.userid,
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
      that.setData({  
        lock_register: true,
      });

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
            
            that.setData({  
              lock_register: false,
            });
          }
          else if(res.data.data.userid != null)
          {
            wx.setStorageSync(user.UserID, res.data.data.userid);
            wx.setStorageSync(user.StudentID, res.data.data.studentid);
            wx.setStorageSync(user.TeacherID, res.data.data.teacherid);
            wx.setStorageSync(user.GradeID, res.data.data.gradeid);
            wx.setStorageSync(user.UserNickName, res.data.data.username);
            wx.setStorageSync(user.UserDescription, res.data.data.description);

            //判断注册是否成功，成功则返回index页面
            wx.setStorageSync('alreadyRegister', 'yes');
            that.setData({
              hide_login:true,
            });
            that.setData({
              userAvatarUrl: wx.getStorageSync('userAvatarUrl'),
              userNickName: wx.getStorageSync(user.UserNickName),
              userDescription: wx.getStorageSync(user.UserDescription),
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

          that.setData({  
            lock_register: false,
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

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})


function searchByContent(the)
{
  var search_content = the.data.searchContent;
  console.log(search_content);
  
  var that = the;
  var searchParameters = {
    query: encodeURIComponent(search_content),
    subjectId: -1,
    userId: -1,
    pageNum: 1,
    pageSize: 10
  };
  if(wx.getStorageSync(user.StudentID) != 'StudentID')
  {
    searchParameters.userId = wx.getStorageSync(user.StudentID);
  }

  the.setData({
    infos: [],
    search_knowledge_list: [],
    search_teacher_list: [],
    search_org_list: [],
  });

  //三种列表
  listViewUtil.loadList(that,'index_search_knowledge',config.PytheRestfulServerURL,
  "/index/search/knowledge",
  10,
      searchParameters,
      function (netData){
        //取出返回结果的列表
        return netData.data;
      },
      function(item){
        
      },
      {},
      'GET',
  );

  listViewUtil.loadList(that,'index_search_teacher',config.PytheRestfulServerURL,
  "/index/search/teacher",
  10,
      searchParameters,
      function (netData){
        //取出返回结果的列表
        return netData.data;
      },
      function(item){
        
      },
      {},
      'GET',
  );

  listViewUtil.loadList(that,'index_search_org',config.PytheRestfulServerURL,
  "/index/search/organization",
  10,
      searchParameters,
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
