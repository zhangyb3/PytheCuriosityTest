
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
        sectionName: '收藏',
        icon: '../../images/collection_section.png',
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
        sectionName: '客服',
        icon: '../../images/info_section.png',
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
      base.loginSystem(this);
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
                  register.loadRegisterSelections(that);
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
      case '客服':
      {
        
        // var that = this;
        // wx.navigateTo({
        //   url: '../section/custom_contact',
        //   success: function(res) {},
        //   fail: function(res) {},
        //   complete: function(res) {},
        // });
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
                  register.loadRegisterSelections(that);
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
                  register.loadRegisterSelections(that);
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
                  register.loadRegisterSelections(that);
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
                  register.loadRegisterSelections(that);
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
                  register.loadRegisterSelections(that);
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

  registerToMainPage: function (e) {
    register.commitRegister(this);
  },

  cancelRegister:function(e){
    this.setData({
      hide_login: true,
    });
    
  },

  userLogin:function(e){
    base.loginSystem(this);
  },

  userRegister:function(e){
    this.setData({
      hide_login: false,
      select_student: true,
      select_teacher: false,
    });
    register.loadRegisterSelections(this);
  },


  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    
    //清除缓存
    wx.clearStorageSync();

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

