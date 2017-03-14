// pages/ask/ask.js

var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");

Page({
  data:{
    ask_page_menu:[{
        name:"科目",
        value:"subject",
        active:true
    },{
        name:"名师",
        value:"teacher",
        active:false
    }],

    subjects:[
      {
        subject_name: '数学',
      },{
        subject_name: '物理',
      },{
        subject_name: '化学',
      },
    ],

     teachers:[
      {
        teacher_name: '都教授',
      },{
        teacher_name: '孙悟空',
      },{
        teacher_name: '猪八戒',
      },
      {
        teacher_name: '白骨精',
      },
    ],
    subjects_discribe:[
      {
        sub_dis: '数学（mathematics或maths），是研究数量、结构、变化、空间以及信息等概念的一门学科，从某种角度看属于形式科学的一种。',
      },{
        sub_dis: '数学（mathematics或maths），是研究数量、结构、变化、空间以及信息等概念的一门学科，从某种角度看属于形式科学的一种。',
      },{
        sub_dis: '数学（mathematics或maths），是研究数量、结构、变化、空间以及信息等概念的一门学科，从某种角度看属于形式科学的一种。',
      },
      {
        sub_dis: '数学（mathematics或maths），是研究数量、结构、变化、空间以及信息等概念的一门学科，从某种角度看属于形式科学的一种。',
      },
    ]

    },
  onLoad:function(options){
    
    if(wx.getStorageSync('alreadyRegister')=='no')
    {
      this.setData({hide_register_page:false});
      this.setData({hide_ask_page:true});
    }

    this.setData({hide_ask_subject_list:false});
    this.setData({hide_ask_teacher_list:true});

    this.setData({ask_subject_list: this.data.subjects});
    this.setData({ask_teacher_list: this.data.teachers});
  },

  subject_filter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var ask_page_menu = this.data.ask_page_menu;
    if(ask_page_menu[0].value == value)
    {
      console.log("subject");
      this.data.ask_page_menu[0].active = true;
      this.data.ask_page_menu[1].active = false;
      
      this.setData({hide_ask_teacher_list:true});
      
      this.setData({hide_ask_subject_list:false});
    }
    else
    {
      this.data.ask_page_menu[0].active = false;
      this.data.ask_page_menu[1].active = true;
    }
    this.setData({ask_page_menu : ask_page_menu});
    
  },

  teacher_filter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    // console.log(value);
    var ask_page_menu = this.data.ask_page_menu;
    if(ask_page_menu[1].value == value)
    {
      console.log("teacher");
      this.data.ask_page_menu[1].active = true;
      this.data.ask_page_menu[0].active = false;
      
      this.setData({hide_ask_subject_list:true});
      
      this.setData({hide_ask_teacher_list:false});
    }
    else
    {
      this.data.ask_page_menu[1].active = false;
      this.data.ask_page_menu[0].active = true;
    }
    this.setData({ask_page_menu : ask_page_menu});

  },

  selectOneSubject:function(e){
      console.log("navigate to ask operation page");
      var parametersJSON = e.currentTarget.dataset.item;
      console.log(parametersJSON);
      var parameters = netUtil.json2Form(parametersJSON);
      // console.log(parameters);
      wx.navigateTo({
        url: 'ask_operation' + '?' + parameters,
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

  selectOneTeacher:function(e){
      console.log("navigate to ask operation page");
      var parametersJSON = e.currentTarget.dataset.item;
      console.log(parametersJSON);
      var parameters = netUtil.json2Form(parametersJSON);
      // console.log(parameters);
      wx.navigateTo({
        url: 'ask_operation' + '?' + parameters,
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
    this.setData({hide_ask_page:false});
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
  }
})