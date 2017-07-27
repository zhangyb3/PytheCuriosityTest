// pages/personal/organization_management.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },

  addOrganization:function(){
    console.log('add organization');
    wx.navigateTo({
      url: 'organization_edit',
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

  organizationEditOperationPage:function(){
    console.log('go to organization edit page');
    wx.navigateTo({
      url: 'organization_edit',
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