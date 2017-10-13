
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
    section_display_list: [
      {
        sectionName: '机构管理',
        icon: '../../images/organization_section.png',
        infoNum: 0,
      },
      {
        sectionName: '发现',
        icon: '../../images/discovery_section.png',
        infoNum: 0,
      },
      {
        sectionName: '附近',
        icon: '../../images/nearby_section.png',
        infoNum: 0,
      },
      {
        sectionName: '消息',
        icon: '../../images/info_section.png',
        infoNum: 0,
      },
      {
        sectionName: '提问',
        icon: '../../images/ask_section.png',
        infoNum: 0,
      },
      {
        sectionName: '回答',
        icon: '../../images/answer_section.png',
        infoNum: 0,
      },
      {
        sectionName: '收藏',
        icon: '../../images/collection_section.png',
        infoNum: 0,
      },
      {
        sectionName: '钱包',
        icon: '../../images/bill_section.png',
        infoNum: 0,
      },
      {
        sectionName: '个人设置',
        icon: '../../images/personal_section.png',
        infoNum: 0,
      },
    ],

    hide_login:true,

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

    organization: {},

    requestingResultList: false,
    
  },
  onLoad:function(parameters){
  
    console.log(parameters);


  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    
    var that = this;
    
    if(wx.getStorageSync('alreadyRegister') == 'no' && wx.getStorageSync('exitSystem') == 'no')
    {
      var result = loginSystem(this);
      console.log(result);
    }
    
    if(wx.getStorageSync('exitSystem') == 'yes')
    {
      var alreadyRegister = wx.getStorageSync('alreadyRegister');
      wx.clearStorageSync();
      wx.setStorageSync('exitSystem', 'yes');
      wx.setStorageSync('alreadyRegister', alreadyRegister);
      this.setData({
        exitSystem: wx.getStorageSync('exitSystem'),
        alreadyRegister: wx.getStorageSync('alreadyRegister'),
      });
    }

    if(wx.getStorageSync('alreadyRegister') == 'yes' && wx.getStorageSync('exitSystem') == 'no')
    {
       this.setData({
        indexUserName: wx.getStorageSync(user.UserNickName),
        indexUserDescription: wx.getStorageSync(user.UserDescription),
        exitSystem: wx.getStorageSync('exitSystem'),
        alreadyRegister: wx.getStorageSync('alreadyRegister'),
      });
    }
   

  },


  redirectToPage:function(e){

    var item = e.currentTarget.dataset.item;
    console.log(item);

    switch(item.sectionName)
    {
      case '机构管理':
      {
        if (wx.getStorageSync(user.Status) == 0) {
          wx.showModal({
            content: '学生尚未开通此功能',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
              }
            }
          });

        }
        else if(wx.getStorageSync('alreadyRegister') == 'yes' && wx.getStorageSync('exitSystem') == 'no')
        {
          

          wx.navigateTo({
            url: '../personal/organization_manage',
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
        else
        {
          var that = this;
          wx.showModal({
            content: '尚未登录',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
                if(wx.getStorageSync('alreadyRegister') == 'no')
                {
                  //注册
                  that.setData({
                    hide_login: false,
                  });
                  loadingSelections.call(that);
                }               
              }
            }
          });
        }
        
        break;
      }
      case '发现':
      {
        wx.navigateTo({
          url: '../index/catalog',
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
        break;
      }
      case '附近':
      {
        wx.navigateTo({
          url: '../nearby/list_show',
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
        break;
      }
      case '消息':
      {
        
        var that = this;
        wx.showModal({
          content: '尚未开通',
          success: function(res) {
            
          }
        });
        break;
      }
      case '提问':
      {
        if(wx.getStorageSync('alreadyRegister') == 'yes')
        {
          wx.navigateTo({
            url: '../ask/ask?hide_which=' + 'subject',
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
        else
        {
          var that = this;
          wx.showModal({
            content: '尚未登录',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
                if(wx.getStorageSync('alreadyRegister') == 'no')
                {
                  //注册
                  that.setData({
                    hide_login: false,
                  });
                  loadingSelections.call(that);
                }
              }
            }
          });

        }
        break;
      }
      case '回答':
      {
        if(wx.getStorageSync('alreadyRegister') == 'yes')
        {
          wx.navigateTo({
            url: '../answer/answer',
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
        else
        {
          var that = this;
          wx.showModal({
            content: '尚未登录',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
                if(wx.getStorageSync('alreadyRegister') == 'no')
                {
                  //注册
                  that.setData({
                    hide_login: false,
                  });
                  loadingSelections.call(that);
                }
              }
            }
          });

        }
        break;
      }
      case '收藏':
      {
        if(wx.getStorageSync('alreadyRegister') == 'yes')
        {
          wx.navigateTo({
            url: '../personal/personal_like',
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
        }
        else
        {
          var that = this;
          wx.showModal({
            content: '尚未登录',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
                if(wx.getStorageSync('alreadyRegister') == 'no')
                {
                  //注册
                  that.setData({
                    hide_login: false,
                  });
                  loadingSelections.call(that);
                }
              }
            }
          });
        }
        break;
      }
      case '钱包':
      {
        if(wx.getStorageSync('alreadyRegister') == 'yes')
        {
          if(wx.getStorageSync(user.Status) == 1)
          {
            wx.navigateTo({
              url: '../personal/teacher_bill',
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
          }
          if(wx.getStorageSync(user.Status) == 0)
          {
            wx.navigateTo({
              url: '../personal/student_bill',
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
          }
        }
        else
        {
          var that = this;
          wx.showModal({
            content: '尚未登录',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
                if(wx.getStorageSync('alreadyRegister') == 'no')
                {
                  //注册
                  that.setData({
                    hide_login: false,
                  });
                  loadingSelections.call(that);
                }
              }
            }
          });

        }
        break;
      }
      case '个人设置':
      {
        if(wx.getStorageSync('alreadyRegister') == 'yes' && wx.getStorageSync('exitSystem') == 'no')
        {
          wx.navigateTo({
            url: '../personal/personal',
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
        else
        {
          var that = this;
          wx.showModal({
            content: '尚未登录',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
                if(wx.getStorageSync('alreadyRegister') == 'no')
                {
                  //注册
                  that.setData({
                    hide_login: false,
                  });
                  loadingSelections.call(that);
                }
              }
            }
          });

        }
        
        break;
      }
    }

  },

  cleanPlaceholder:function(e){
    console.log(e);
    this.setData({
      searchContent: ''
    });
    
  },
  listenSearchInput:function(e){
    var searchContent = e.detail.value;
    console.log(searchContent);
    this.data.searchContent = searchContent;

  },
  searchByContent:function(e){
    var that = this;

    wx.navigateTo({
      url: 'search?searchContent='+ encodeURIComponent(this.data.searchContent),
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
            
          }
          
          that.setData({
            userAvatarUrl: wx.getStorageSync('userAvatarUrl'),
            userNickName: wx.getStorageSync(user.UserNickName),
            userDescription: wx.getStorageSync(user.UserDescription),
          });

          that.onShow();
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

  userLogin:function(e){
    loginSystem(this);
  },

  userRegister:function(e){
    this.setData({
      hide_login: false,
      select_student: true,
      select_teacher: false,
    });
    loadingSelection();
  },


  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
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

function loginSystem(that) {

  wx.login({
    success: function(res){
      // success
      wx.getUserInfo({
        success: function(res){
          // success
          console.log(res.rawData);
          var rawData = JSON.parse(res.rawData);
          wx.setStorageSync('avatarUrl', rawData.avatarUrl);
          // wx.setStorageSync('userNickName', rawData.nickName);
          wx.setStorageSync('wxNickName', rawData.nickName);
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
  
  
  //登录
  base.login(
    () => {

      base.getUserInfo(
        (userInfo) => {
          console.log("已获取数据", userInfo);
          // app.data.userInfo = userInfo;

        }, 
        () => {
          console.log("用户拒绝提供信息");
        }
      );

      // 检查是否有注册过
      register.checkRegister(
        (userRegisterResult) => {
          console.log('check register : ' + JSON.stringify(userRegisterResult));
          //如果没注册过，则注册
          var registerInfo = userRegisterResult.data.data;
          if(registerInfo == null)
          {

          }
          else if(registerInfo.userid == null)
          {
            wx.setStorageSync('alreadyRegister', 'no');
            console.log("register : " + wx.getStorageSync('alreadyRegister'));
            
            
          }
          else
          {
            wx.setStorageSync('alreadyRegister', 'yes');
            wx.setStorageSync(user.UserID, registerInfo.userid);
            // wx.setStorageSync(user.StudentID, registerInfo.studentid);
            // wx.setStorageSync(user.TeacherID, registerInfo.teacherid);
            wx.setStorageSync(user.GradeID, registerInfo.gradeid);
            wx.setStorageSync(user.UserDescription, registerInfo.description);
            wx.setStorageSync(user.UserNickName, registerInfo.username);
            wx.setStorageSync('userAvatarUrl', registerInfo.userimg);
            wx.setStorageSync(user.Status, registerInfo.status);
            wx.setStorageSync(user.TeacherID, registerInfo.userid);
            wx.setStorageSync(user.StudentID, registerInfo.userid);
            wx.setStorageSync(user.TeacherID, registerInfo.userid);

            

            if(wx.getStorageSync(user.UserID)!='userID')
            {
              wx.setStorageSync('alreadyRegister', 'yes');
              wx.setStorageSync('fromRegister', 'no');
              
              wx.showToast({
                title: '已登录',
                duration: 1200
              });

              
              
            }
            

            if(wx.getStorageSync(user.Status) == 1)
            {
              wx.setStorageSync(user.OrganizationID, registerInfo.organizationid);
            }        

          }

          

          that.setData({
            indexUserName: wx.getStorageSync(user.UserNickName),
            indexUserDescription: wx.getStorageSync(user.UserDescription),
            exitSystem: wx.getStorageSync('exitSystem'),
            alreadyRegister: wx.getStorageSync('alreadyRegister') 
          });
          
        },
        (userRegisterResult) => {
          console.log(userRegisterResult);
        },
      );
    
    }
  );

  wx.setStorageSync('exitSystem', 'no');

  return 'finish';
}