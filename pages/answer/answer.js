// pages/answer/answer.js


var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

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
     
    ],
    
    questionsForAnswer:[
          
    ],
    selectSubject:'',
    sortSortAttribute:'',
    sort_attributes:[
      { key: 1, name: '按时间' },
      { key: 2, name: '按金额' }
    ],
    
    answer_page_filter:{
      selectSubject:{
        subjectId:-1,
        subjectName:'科目',
      },
      selectSort:{
        sortId:'startTime',
        sortName:'排序',
      },
    },

    hide_register_lock_cover: false,
  },
  onLoad:function(options){

    this.setData({
      hide_register_lock_cover: false,
    });

    if(wx.getStorageSync('alreadyRegister') == 'yes')
    {
      this.setData({
        hide_register_lock_cover: true,
      });
    }

    if(wx.getStorageSync('alreadyRegister')=='no')
    {
      // this.setData({hide_register_page:false});
      // this.setData({hide_index_page:true});
      wx.navigateTo({
        url: '../register/register',
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    }

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
    
    var select_subject = e.currentTarget.dataset.select_subject;
    console.log(select_subject.subject);
    
    this.data.answer_page_filter.selectSubject.subjectName = select_subject.subject;
    this.data.answer_page_filter.selectSubject.subjectId = select_subject.subjectid;
    this.setData({answer_page_filter: this.data.answer_page_filter});
    this.setData({hide_pop_subject_list:true});

    var answer_page_menu = this.data.answer_page_menu;
    this.data.answer_page_menu[0].active = false;
    this.data.answer_page_menu[1].active = false;
    this.setData({answer_page_menu : answer_page_menu});

    var that = this;
    var conditionQuestionParams = {
      subjectId: that.data.answer_page_filter.selectSubject.subjectId,
      condition: that.data.answer_page_filter.selectSort.sortId,
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
        subjectId: that.data.answer_page_filter.selectSubject.subjectId,
        order: 'desc',     
        pageNum: 1,
        pageSize: 3,   
    };
    that.data.answer_page_filter.selectSort.sortName = selected_sort_attribute;
    if(selected_sort_attribute == "按金额")
    {
      conditionQuestionParams.condition = 'reward';
       that.data.answer_page_filter.selectSort.sortId = 'reward';
    }
    if(selected_sort_attribute == "按时间")
    {
      conditionQuestionParams.condition = 'startTime';
      that.data.answer_page_filter.selectSort.sortId = 'startTime';
    }
    that.setData({answer_page_filter: this.data.answer_page_filter});

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

    //获取科目列表
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/index/subject/' + wx.getStorageSync(user.GradeID),
      data: {
        
      },
      method: 'GET', 
      success: function(res){
        // success
        
        that.data.subject_infos = res.data;
        that.setData({
          subject_infos : that.data.subject_infos,
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