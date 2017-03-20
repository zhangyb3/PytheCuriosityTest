// pages/personal/personal_ask_detail.js


Page({
  data:{
    personal_question_answer_list:[
      {
        text: '答案一',
      },
      {
        text: '答案二',
      },
      {
        text: '答案三',
      },
    ],

    hide_select_answer: true,

  },
  onLoad:function(parameters){
    console.log(parameters);

  },

  seeOneAnswer:function(result){
    console.log("see this answer");
    var select_item = result.currentTarget.dataset.item;
    console.log(select_item);
    this.setData({
      hide_select_answer: false,
      select_item: select_item,
    });
  },

  selectBestAnswer:function(result){
    console.log("best answer");
  },

  complainOneAnswer:function(result){
    console.log("complain this answer");
  },

  returnPersonalAnswerDetailPage:function(result){
    
    this.setData({
      hide_select_answer: true,
    });
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