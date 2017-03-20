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
      { subjectId: 1001, name: ' 语文 ', number: '#FFFFFF' },

      { subjectId: 2, name: ' 数学 ', number: '#FF0000' },

      { subjectId: 3, name: ' 英语 ', number: '#00FF00' },

      { subjectId: 4, name: ' 物理 ', number: '#0000FF' },

      { subjectId: 5, name: ' 化学 ', number: '#FF00FF' },

      { subjectId: 6, name: ' 生物 ', number: '#00FFFF' },

      { subjectId: 7, name: ' 历史 ', number: '#FFFF00' },

      { subjectId: 8, name: ' 政治 ', number: '#000000' },

      { subjectId: 9, name: ' 地理 ', number: '#70DB93' }
    ],
    
    questionsForAnswer:[
      {
        avatar: null,
        
        teacher_name: "自己",
        is_like: false,
        like_num: 88,
        reward_num: 10.00,
        question_content: "传言大陆正研究给予台湾地区民众“国民待遇”。国台办发言人安峰山昨天（8日）指出，中共中央举行的2017年对台工作会议，政策措施涉及台人在大陆的就业、社会保障、生活便利等，有关部门正按照会议精神研究，待成",
        voice_path:'template',
      },
      {
        avatar: null,
        
        teacher_name: "自己",
        is_like: true,
        like_num: 0,
        reward_num: 10.00,
        question_content: "十万个为什么"
      }
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

    if(wx.getStorageSync('alreadyRegister')=='no')
    {
      this.setData({hide_register_page:false});
      this.setData({hide_answer_page:true});
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



  selectStudent:function(e){
    console.log("学生");
    this.setData({
      hide_subject_selection:true,
      hide_grade_selection:false,
      select_student:true,
      select_teacher:false
    })
  },
  selectTeacher:function(e){
    console.log("老师");
    this.setData({
      hide_subject_selection:false,
      hide_grade_selection:true,
      select_student:false,
      select_teacher:true
    })
  },

  gradeChange: function(e) {
    console.log('年级', this.data.grades[e.detail.value])
    this.setData({
      grade_index: e.detail.value
    })
  },
  subjectChange: function(e) {
    console.log('科目', this.data.subjects[e.detail.value])
    this.setData({
      subject_index: e.detail.value
    })
  },

  phoneNumberInput: function(e) {
    var registerPhoneNum = e.detail.value;
    console.log(e.detail.value);
    wx.setStorageSync('registerPhoneNum', registerPhoneNum);
  },
  sendVerificationCode:function(res) {
    console.log(wx.getStorageSync('registerPhoneNum'));
    register.sendVerificationCode(wx.getStorageSync('registerPhoneNum'));
  },
  verificationCodeInput: function(e) {
    var verificationCode = e.detail.value;
    console.log(e.detail.value);
    wx.setStorageSync('verificationCode', verificationCode);
  },

  registerToMainPage:function(e){
    this.setData({hide_register_page:true});
    this.setData({hide_answer_page:false});
    var that = this;
    // listViewUtil.initListView(that,that.data.basic_url,
    // "/answer/2",
    // // "lesson/search/v1.json",
    // 10,
    //     function(params){
    //       params.type = 2;
    //       params.sourceType = 0;
    //       params.labelId = 0;
    //       params.priceType = 2;
    //       params.categoryIds = "";
    //     },
    //     function (netData){

    //       return netData;
    //     },
    //     function(item){
         
    //     }
    // );
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