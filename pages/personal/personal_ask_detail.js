// pages/personal/personal_ask_detail.js
var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

Page({
  data:{
    personal_question_answer_list:[
      {
        data:{
          answerid:-1,
          text: '答案一',
        },
        selected:false,
      },
      {
        data:{
          answerid:-2,
          text: '答案二',
        },
        selected:false,
      },
      {
        data:{
          answerid:-3,
          text: '答案三',
        },
        selected:false,
      },
    ],
    

    hide_select_answer: true,

    hide_show_image_page: true,

    bestAnswerParams:{
      questionId:'',
      answerIds:'',
    },

    question:{},

  },
  onLoad:function(params){
    console.log(params);
    var parameters = JSON.parse(decodeURIComponent(params.P));
    
    this.data.question.questioncontent = parameters.questioncontent;
    this.data.question.question_id = parameters.questionid;
    this.data.question.reward = parameters.reward;
    
    this.setData({
      question: this.data.question,
    });

    this.data.bestAnswerParams.questionId = parameters.questionid;

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

    var that = this;
    //加载一条答案的详情
    wx.request({
      url: config.PytheRestfulServerURL + base.MY_QUESTION_ANSWER_CONCRETE_URL,
      data: {
        answerId: select_item.answerid,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res);
        var concrete_answer = res.data.data;
        concrete_answer.answercontent = JSON.parse(concrete_answer.answercontent);
        that.setData({
          select_item: concrete_answer,
        });
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })

    this.setData({
      hide_select_answer: false,
      select_item: select_item,
    });
  },

  selectBestAnswer:function(result){
    console.log("best answer " + result.currentTarget.dataset.item.answerid);
    var theAnswer = result.currentTarget.dataset.item;
    
    this.data.bestAnswerParams.answerIds = this.data.bestAnswerParams.answerIds + theAnswer.answerid + ',';
    
    //显示选中效果
    var select_item = result.currentTarget.dataset.item;
    var select_item_index = result.currentTarget.dataset.index;
    console.log("best answer index " + select_item_index);
    if(select_item.selected != true)
    {
      this.data.personal_question_answer_list[select_item_index].selected = true;
    }
    else
    {
      this.data.personal_question_answer_list[select_item_index].selected = false;
    }
    this.setData({
      personal_question_answer_list: this.data.personal_question_answer_list,
    });
    
    
  },
  commitBestAnswer:function(e){
    this.data.bestAnswerParams.answerIds = this.data.bestAnswerParams.answerIds.substr(0,this.data.bestAnswerParams.answerIds.length-1);
    base.selectBestAnswer(this.data.bestAnswerParams);
  },
  complainOneAnswer:function(result){
    console.log("complain this answer " + result.currentTarget.dataset.item.answerid);
    var theAnswer = result.currentTarget.dataset.item;
    var complainParams = {
      userId: wx.getStorageSync(user.UserID),
      complainedId: theAnswer.answerid,
    };
    base.complainAnswer(complainParams);
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