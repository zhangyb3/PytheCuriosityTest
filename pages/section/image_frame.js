// pages/section/image_frame.js
Page({
  data:{
    image_source:'',
  },
  onLoad:function(parameters){
    // 页面初始化 parameters为页面跳转所带来的参数
    console.log(parameters);
    this.setData({
      image_source: decodeURIComponent(parameters.image_source),
    });
  },

  returnLastPage:function(e){
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

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})