// pages/personal/personal_ask_detail.js
var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

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

    hide_show_image_page: true,

  },
  onLoad:function(parameters){
    console.log(parameters);

    //加载个人问题列表答案集
    var that = this;
    var myQuestionAnswersParams = {
      questionId: parameters.questionid,
    };    
    listViewUtil.loadList(that,'my_question_answer',config.PytheRestfulServerURL,
    base.MY_QUESTION_ANSWER_URL_DETAIL,
    10,
        myQuestionAnswersParams,
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