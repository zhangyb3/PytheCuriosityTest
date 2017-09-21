
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
    // 页面显示
  },

  redirectToPage:function(e){

    var item = e.currentTarget.dataset.item;
    console.log(item);

    switch(item.sectionName)
    {
      case '机构':
      {
        
        break;
      }
      case '教师':
      {
        
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
        
        break;
      }
      case '回答':
      {
        wx.navigateTo({
          url: '../answer',
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
      url: 'search?searchContent='+this.data.searchContent,
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