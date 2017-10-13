
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
    organization: {},
    userRole: 0,
    preview_img_url: config.PytheFileServerURL ,
    alreadySetupOrg: false,
  },
  onLoad:function(parameters){
    console.log(parameters);

    

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    

    var organizationId = wx.getStorageSync(user.OrganizationID);
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/org/managerQuery',
      data: {
        managerId: wx.getStorageSync(user.TeacherID),
        // managerId: 1,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res);
        if(res.data.status == 200)
        {
          that.data.alreadySetupOrg = true;
          that.setData({
            alreadySetupOrg: that.data.alreadySetupOrg,
          });
        }

        that.data.organization = res.data.data;
        that.setData({
          organization: res.data.data,
        });
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete

        wx.request({
          url: config.PytheRestfulServerURL + '/org/query',
          data: {
            orgId: that.data.organization.id,
            
          },
          method: 'GET', 
          success: function(res){
            // success
            console.log(res.data.data);
            var members = res.data.data.members;
            var organization = res.data.data.organization;
            that.data.organization = organization;
            that.data.organizationName = organization.name;
            that.data.organizationDescription = organization.description;
            that.data.organizationAddress = organization.address;
            that.setData({
              member_display_list:members,
              orgInfo:organization,
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
    });

    
  },

  setupOrg:function(e){
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/teacher/setupOrg',
      data: {
        orgName: '待编辑',
        teacherId:wx.getStorageSync(user.TeacherID),
        // teacherId:2,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res);
        if(res.data.msg=='OK')
        {
          that.data.alreadySetupOrg = true;
          that.setData({
            organizationId: res.data.data.id,
            alreadySetupOrg: that.data.alreadySetupOrg,
          });
        }
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
        that.onShow();
      }
    });

  },

  updateOrg:function(e){

    var organization = this.data.organization;
    wx.request({
      url: config.PytheRestfulServerURL + '/teacher/editOrg',
      data: {
        managerId: wx.getStorageSync(user.TeacherID),
        orgName: organization.name,
        description: organization.description,
        address: organization.address,
        latitude: organization.latitude,
        longitude: organization.longitude,
      },
      method: 'POST', 
      success: function(res){
        wx.showToast({
          title: '编辑完成',
          duration: 1500
        });
        
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
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
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    });

  },

  inputTeacherPhone:function(e){
    console.log(e.detail.value);
    this.data.teacherPhone=e.detail.value;
  },

  searchTeacherByPhone:function(e){
    wx.navigateTo({
      url: 'teacher_add'+'?'
            +"teacherPhone="+this.data.teacherPhone
            +'&'
            +'organizationId='+this.data.organization.id,
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

  orgDeleteTeacher:function(e){
    var teacher = e.currentTarget.dataset.teacher;
    var organization = this.data.organization;
    console.log(organization.name + ' delete teacher ' + teacher.username);

    var that = this;
    wx.showModal({
      content: '是否删除该老师?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');

          wx.request({
            url: config.PytheRestfulServerURL + '/teacher/orgDelete',
            data: {
              teacherId: teacher.userid,
              orgId: organization.id,
            },
            method: 'GET',
            success: function (res) {
              // success
              if (res.data.msg == 'OK') {
                wx.showToast({
                  title: '删除老师成功',
                  icon: 'success',
                  duration: 1000
                });
                that.onShow();
              }

            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          });
        }
      }
    });
    
  },

  updateOrganization:function(e){
    console.log('edit org');

    var organization = this.data.organization;
    wx.request({
      url: config.PytheRestfulServerURL + '/teacher/editOrg',
      data: {
        managerId: wx.getStorageSync(user.TeacherID),
        orgName: organization.name,
        description: organization.description,
        address: organization.address,
        latitude: organization.latitude,
        longitude: organization.longitude,
      },
      method: 'POST', 
      success: function(res){
        // success
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
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
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    });

  },

  chooseOrgLocation:function(e){
    var that = this;
    wx.chooseLocation({
      success: function(res){
        // success
        console.log(res);
        that.data.organization.address = res.address;
        that.data.organization.latitude = res.latitude;
        that.data.organization.longitude = res.longitude;

        var organization = that.data.organization;
        wx.request({
          url: config.PytheRestfulServerURL + '/teacher/editOrg',
          data: {
            managerId: wx.getStorageSync(user.TeacherID),
            orgName: organization.name,
            description: organization.description,
            address: organization.address,
            latitude: organization.latitude,
            longitude: organization.longitude,
          },
          method: 'POST', 
          success: function(res){
            
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
            console.log(res);
            that.setData({
              organization: that.data.organization,
            });
          }
        });

        


      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })

  },

  checkOrgLocation:function(e){
    
    console.log("go to " + e.currentTarget.dataset.address);
    var org = e.currentTarget.dataset.org;
    console.log(org.latitude + ' , ' + org.longitude);

    wx.openLocation({
      latitude: org.latitude, // 纬度，范围为-90~90，负数表示南纬
      longitude: org.longitude, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例
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

  changeOrgAvatar:function(e){
    console.log('change organization avatar');
    var org = e.currentTarget.dataset.org;
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        // success
        console.log(res);

        var upload_avatar_local_path = res.tempFilePaths[0];
        wx.request({
          url: config.PytheRestfulServerURL + '/file/uploadFilePrepare',
          data: {
            userFilePath: upload_avatar_local_path,
            fileType: 'image',
          },
          method: 'POST', 
          success: function(res){
            // success
            console.log(res.data.data)
            var result = JSON.parse(res.data.data);
            that.data.upload_avatar_path = result.path;

           
            var parameters = {
              path : that.data.upload_avatar_path,
              fileType : 'image',
            };
            //准备完毕，上传
            wx.setStorageSync('uploading_avatar', 'yes');
            fileSys.uploadFile(upload_avatar_local_path,parameters,that);
            
            // var jumpToNextStep = false;
            // var count = 0;
            // for(; count < 5; )
            // {
            //   if(jumpToNextStep) break;

            //   //每秒检测一次上传是否完成
            //   setTimeout(function(){
            //     if(wx.getStorageSync('uploading_avatar') == 'no')
            //     {
            //       that.onShow();
            //       jumpToNextStep = true;
            //     }
            //     count++;
            //     console.log(count);
            //   },1000);

                

            // }
            // if(count >= 5)
            // {
            //   wx.showModal({
            //     content: '上传速度不给力，请稍后再试',
            //     success: function(res) {
            //       if (res.confirm) {
            //         console.log('用户点击确定');          
            //       }
            //     }
            //   });
            // }

            //更新数据库纪录
            wx.request({
              url: config.PytheRestfulServerURL + '/org/updateAvatar',
              data: {
                orgId: that.data.organization.id,
                avatar: that.data.preview_img_url + parameters.path,
              },
              method: 'GET', 
              success: function(res){
                // success
                
              },
              fail: function(res) {
                // fail
              },
              complete: function(res) {
                // complete
                
                //最多等待5秒
                

              }
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
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
        
      }
    });

    
  },

  editOrgName:function(e){
    wx.navigateTo({
      url: '../section/text_edit?orgName=' + this.data.organization.name
      + '&editType=editOrgName'
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
    });
  },

  editOrgDescription:function(e){
    wx.navigateTo({
      url: '../section/text_edit?orgDescription=' + this.data.organization.description 
      + '&editType=editOrgDescription'
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
    });
  },


  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})