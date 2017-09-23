
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
        sectionName: '机构',
        icon: '../../images/organization_section.png',
        infoNum: 0,
      },
      {
        sectionName: '教师',
        icon: '../../images/teacher_section.png',
        infoNum: 0,
      },
      {
        sectionName: '搜索',
        icon: '../../images/search_section.png',
        infoNum: 0,
      },
      {
        sectionName: '信息',
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
        sectionName: '设置',
        icon: '../../images/personal_section.png',
        infoNum: 0,
      },
    ],
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    
    var that = this;
    
    if(wx.getStorageSync('alreadyRegister') == 'no')
    {
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
              
              if(registerInfo.userid == null)
              {
                wx.setStorageSync('alreadyRegister', 'no');
                console.log("register : " + wx.getStorageSync('alreadyRegister'));
                //注册
                
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

                // if(wx.getStorageSync('avatarUrl') != wx.getStorageSync('userAvatarUrl'))
                // {
                //   wx.request({
                //     url: config.PytheRestfulServerURL + '/user/updateAvatar',
                //     data: {
                //       userId: wx.getStorageSync(user.UserID),
                //       avatar: wx.getStorageSync('avatarUrl'),
                //     },
                //     method: 'GET', 
                //     success: function(res){
                //       // success
                //       wx.setStorageSync('userAvatarUrl', wx.getStorageSync('avatarUrl'));
                //     },
                //     fail: function(res) {
                //       // fail
                //     },
                //     complete: function(res) {
                //       // complete
                //     }
                //   })
                // }

                if(wx.getStorageSync(user.UserID)!='userID')
                {
                  wx.setStorageSync('alreadyRegister', 'yes');
                  wx.setStorageSync('fromRegister', 'no');
                  
                  var simple_params = {
                    gradeId : wx.getStorageSync(user.GradeID),
                    pageSize : 10,
                    pageNum : 1,
                    
                  };
                  this.setData({
                    hide_loading: false,
                  });
                  listViewUtil.loadList(that,'index',config.PytheRestfulServerURL,
                  "/index/defaultList",
                  10,
                      simple_params,
                      function (netData){
                        //取出返回结果的列表
                        return netData.data;
                      },
                      function(item,that){
                        that.setData({
                          hide_loading: true,
                        });
                      },
                      {},
                      'GET',
                  );
                  wx.setStorageSync('index_load_type', 'one');

                }
                if(wx.getStorageSync(user.Status) == 1)
                {
                  wx.setStorageSync(user.OrganizationID, registerInfo.organizationid);
                }

              }
            },
            (userRegisterResult) => {
              console.log(userRegisterResult);
            },
          );
        
        }
      );
    }
    else
    {
      var simple_params = {
        gradeId : wx.getStorageSync(user.GradeID),
        pageSize : 10,
        pageNum : 1,
        
      };
      this.setData({
        hide_loading: false,
      });
      listViewUtil.loadList(that,'index',config.PytheRestfulServerURL,
      "/index/defaultList",
      10,
          simple_params,
          function (netData){
            //取出返回结果的列表
            return netData.data;
          },
          function(item,that){
            that.setData({
              hide_loading: true,
            });
          },
          {},
          'GET',
      );
      wx.setStorageSync('index_load_type', 'one');
    }



    // this.setData({
    //   alreadyRegister: wx.getStorageSync('alreadyRegister'),
    // });

    // var that = this;
    // var simple_params = {
    //   gradeId : wx.getStorageSync(user.GradeID),
    //   pageSize : 10,
    //   pageNum : 1,
      
    // };
    // this.setData({
    //   hide_loading: false,
    // });
    // listViewUtil.loadList(that,'index',config.PytheRestfulServerURL,
    // "/index/defaultList",
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
    // wx.setStorageSync('index_load_type', 'one');
    

    // //判断是否从注册页面返回
    // if(wx.getStorageSync('fromRegister')=='yes')
    // {
      

    //   wx.setStorageSync('fromRegister', 'no');
    // }

    this.setData({
      hide_register_lock_cover: true,
    });

  },


  redirectToPage:function(e){

    var item = e.currentTarget.dataset.item;
    console.log(item);

    switch(item.sectionName)
    {
      case '机构':
      {
        wx.navigateTo({
          url: '../personal/organization_management',
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
      case '教师':
      {
        wx.navigateTo({
          url: '../ask/ask?hide_which=' + 'teacher',
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
      case '搜索':
      {
        wx.navigateTo({
          url: 'search',
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
        
        break;
      }
      case '提问':
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
        break;
      }
      case '回答':
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
        break;
      }
      case '收藏':
      {
        
        break;
      }
      case '钱包':
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
        break;
      }
      case '设置':
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
        break;
      }
    }

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
    })

  },

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})