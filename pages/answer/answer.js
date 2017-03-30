// pages/answer/answer.js


var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

Page({
  data:{
    answer_page_sections:['分类','排序'],
    answer_page_menu:[{
        name:"分类",
        value:"classification",
        active:false
    },{
        name:"排序",
        value:"sort",
        active:false
    }],
    subject_infos: [
      { subjectId: 1, name: ' 语文 ', number: '#FFFFFF' },

      { subjectId: 1001, name: ' 数学 ', number: '#FF0000' },

      { subjectId: 3, name: ' 英语 ', number: '#00FF00' },

      { subjectId: 4, name: ' 物理 ', number: '#0000FF' },

      { subjectId: 5, name: ' 化学 ', number: '#FF00FF' },

      { subjectId: 6, name: ' 生物 ', number: '#00FFFF' },

      { subjectId: 7, name: ' 历史 ', number: '#FFFF00' },

      { subjectId: 8, name: ' 政治 ', number: '#000000' },

      { subjectId: 9, name: ' 地理 ', number: '#70DB93' }
    ],
    
    questionsForAnswer:[
          
    ],
    selectSubject:'',
    sortSortAttribute:'',
    sort_attributes:[
      { key: 1, name: '按时间' },
      { key: 2, name: '按金额' }
    ],
    basic_url: 'http://192.168.1.6:8080'
  },
  onLoad:function(options){

    

    this.setData({hide_pop_subject_list:true});
    this.setData({hide_pop_sort_attribute_list:true});

    // 获取默认问题列表
    var that = this;
    var questionListParams = {
      pageSize: 3,
      pageNum: 1,
    };
    listViewUtil.loadList(that,'question',config.PytheRestfulServerURL,
    "/answer/defaultList",
    10,
        questionListParams,
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

  subject_filter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var answer_page_menu = this.data.answer_page_menu;
    if(answer_page_menu[0].value == value)
    {
      console.log("classification");
      this.data.answer_page_menu[0].active = true;
      this.data.answer_page_menu[1].active = false;
      //收起排序属性列表
      this.setData({hide_pop_sort_attribute_list:true});
      //弹出科目列表
      this.setData({hide_pop_subject_list:false});
    }
    else
    {
      this.data.answer_page_menu[0].active = false;
      this.data.answer_page_menu[1].active = true;
    }
    this.setData({answer_page_menu : answer_page_menu});
    
  },

  sort_by_attribute:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var answer_page_menu = this.data.answer_page_menu;
    if(answer_page_menu[1].value == value)
    {
      console.log("sort");
      this.data.answer_page_menu[1].active = true;
      this.data.answer_page_menu[0].active = false;
      //收起科目列表
      this.setData({hide_pop_subject_list:true});
      //弹出排序属性列表
      this.setData({hide_pop_sort_attribute_list:false});
    }
    else
    {
      this.data.answer_page_menu[1].active = false;
      this.data.answer_page_menu[0].active = true;
    }
    this.setData({answer_page_menu : answer_page_menu});

  },

  selectSubject:function(e){
    
    var selected_subject = e.currentTarget.dataset.select_subject;
    console.log(selected_subject.name);
    this.data.select_subject = selected_subject;
    this.setData({hide_pop_subject_list:true});

    var answer_page_menu = this.data.answer_page_menu;
    this.data.answer_page_menu[0].active = false;
    this.data.answer_page_menu[1].active = false;
    this.setData({answer_page_menu : answer_page_menu});

    var that = this;
    var conditionQuestionParams = {
      subjectId: this.data.select_subject.subjectId,
      condition: "startTime",
      order: 'desc',     
      pageNum: 1,
      pageSize: 3,   
    };
    listViewUtil.loadList(that,'question',config.PytheRestfulServerURL,
    "/answer/conditionList",
    10,
        conditionQuestionParams,
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

  selectSortAttribute:function(e){
    
    var selected_sort_attribute = e.currentTarget.dataset.name;
    console.log(selected_sort_attribute);
    
    this.setData({hide_pop_sort_attribute_list:true});

    var answer_page_menu = this.data.answer_page_menu;
    this.data.answer_page_menu[0].active = false;
    this.data.answer_page_menu[1].active = false;
    this.setData({answer_page_menu : answer_page_menu});

    var that= this;
    var conditionQuestionParams = {
        // subjectId: this.data.select_subject.subjectId,
        order: 'desc',     
        pageNum: 1,
        pageSize: 3,   
    };
    if(selected_sort_attribute == "按金额")
    {
      conditionQuestionParams.condition = 'reward';
    }
    if(selected_sort_attribute == "按时间")
    {
      conditionQuestionParams.condition = 'startTime';
    }

    listViewUtil.loadList(that,'question',config.PytheRestfulServerURL,
    "/answer/conditionList",
    10,
        conditionQuestionParams,
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

  returnAnswerPage: function(e) {
      console.log("return to answer page");
      this.setData({hide_pop_subject_list:true});
      this.setData({hide_pop_sort_attribute_list:true});

      var answer_page_menu = this.data.answer_page_menu;
      this.data.answer_page_menu[0].active = false;
      this.data.answer_page_menu[1].active = false;
      this.setData({answer_page_menu : answer_page_menu});
  },

  selectOneItem:function(e){
      console.log("navigate to answer operation page");
      var parametersJSON = e.currentTarget.dataset.item;
      parametersJSON.question_id = parametersJSON.question.questionid;
      parametersJSON.subject_id = parametersJSON.question.subjectid;
      parametersJSON.student_id = parametersJSON.question.studentid;
      parametersJSON.text_content = parametersJSON.question.questioncontent.text[0];
      parametersJSON.photo_path = parametersJSON.question.questioncontent.img[0];
      parametersJSON.draw_path = parametersJSON.question.questioncontent.draw[0];
      parametersJSON.audio_path = parametersJSON.question.questioncontent.audio[0];
      parametersJSON.audio_duration = parametersJSON.question.questioncontent.audio[1];
      console.log(parametersJSON);
      var parameters = netUtil.json2Form(parametersJSON);
      // console.log(parameters);
      wx.navigateTo({
        url: 'answer_operation' + '?' + parameters,
        success: function(res){
          // success
          // console.log(res);
        },
        fail: function() {
          // fail
          // console.log(res);
        },
        complete: function() {
          // complete
          // console.log(res);
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
  },

})