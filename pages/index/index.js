//index.js
//获取应用实例
var app = getApp()

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

var selectItem;
var itemIndex;


Page({
  data: {
    second: 60,
    grades: ['六年级', '初三', '高三'],
    grade_index:0,
    subjects: ['物理', '化学', '计算机'],
    subject_index:0,
    hide_subject_selection:false,
    hide_grade_selection:false,
    selectStudent:false,
    selectTeacher:false,
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

    answers:[],
    hide_select_item: true,
    motto: 'Hello World',
    userInfo: {},

    

    hide_show_image_page: true,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
      
    
    
    this.setData({hide_pop_subject_list:true});
    this.setData({hide_select_item:true});

    console.log('onLoad');
    var that = this;

    var simple_params = {
      gradeId : 112,
      pageSize : 3,
      pageNum : 1,
      // subjectId: 1001,
    };
    
    listViewUtil.loadList(that,'index',config.PytheRestfulServerURL,
    "/index/defaultList",
    10,
        simple_params,
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

  //注册
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

  //搜索
  listenerSearchInput:function(e){
    //获取搜索框输入
    var search_content_text = e.detail.value;
    console.log(search_content_text);
    this.data.search_content_text = search_content_text;
  },
  getSearchContentList:function(e){
    var that = this;
    var searchParameters = {
      q: this.data.search_content_text,
      pageSize: 3,
      pageNum: 1,
    };

    listViewUtil.loadList(that,'index',config.PytheSearchServerURL,
    "/index",
    10,
        searchParameters,
        function (netData){
          //取出返回结果的列表
          return netData.data.knowlegeList;
        },
        function(item){
         
        },
        {},
        'GET',
    );

  },

  

  filterSubject:function(subject_data){
    console.log("subject filter");
    this.setData({hide_pop_subject_list:false});
  },

  selectOneItem:function(e){
    
    selectItem = e.currentTarget.dataset.item;
    itemIndex = e.currentTarget.dataset.index;
    console.log(JSON.stringify(selectItem) + "," + itemIndex);
    this.setData({hide_select_item:false});

    //进入详细列表
    this.data.answers = base.getDetailContent(this,selectItem);
    
    // this.setData({select_item:selectItem});
  },

  likeAnswer:function(e){
    var answer_index = e.currentTarget.dataset.answer_index;
    
    //点赞+1并更新数据库
    console.log(this.data.answers[answer_index]);
    this.data.answers[answer_index].likesnum++;
    this.setData({
      answers: this.data.answers,
    });
    //更新数据库
  },

  rewardAnswer:function(e){
    var selected = e.currentTarget.dataset.selected;
    console.log(selected);
    var parametersJSON ={
      answerId: selected.answerid,
    };
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: '../reward/reward' + '?' + parametersString,
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
  },
  

  /**
   * 点击遮罩层使搜索条件消失
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  returnIndexPage: function(e) {
      console.log("return to index page");
      this.setData({
          hide_pop_subject_list: true,
      });
      this.setData({
          hide_select_item: true,
      });
  },

  //科目筛选列表
  getSelectSubjectList:function(e){
    
    var selected_subject = e.currentTarget.dataset.name;
    console.log(selected_subject);
    this.setData({hide_pop_subject_list:true});

    var that = this;
    var subjectParamters = {
      subjectId: e.currentTarget.dataset.subject_id,
      pageSize: 3,
      pageNum: 1,
      gradeId: 112,
    };
    listViewUtil.loadList(that,'index',config.PytheRestfulServerURL,
    "/index/filterList",
    10,
        subjectParamters,
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


  

  onShow:function(){
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
  },

})





