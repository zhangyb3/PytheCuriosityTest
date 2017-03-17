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
      { key: 1, name: ' 语文 ', number: '#FFFFFF' },

      { key: 2, name: ' 数学 ', number: '#FF0000' },

      { key: 3, name: ' 英语 ', number: '#00FF00' },

      { key: 4, name: ' 物理 ', number: '#0000FF' },

      { key: 5, name: ' 化学 ', number: '#FF00FF' },

      { key: 6, name: ' 生物 ', number: '#00FFFF' },

      { key: 7, name: ' 历史 ', number: '#FFFF00' },

      { key: 8, name: ' 政治 ', number: '#000000' },

      { key: 9, name: ' 地理 ', number: '#70DB93' }
    ],

    
    hide_select_item: true,
    motto: 'Hello World',
    userInfo: {},
    // basic_url: 'https://api.qxinli.com/api/'
    basic_url: 'http://192.168.1.6:8080'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if(wx.getStorageSync('alreadyRegister')=='no')
    {
      this.setData({hide_register_page:false});
      this.setData({hide_index_page:true});
    }
      
    
    
    this.setData({hide_pop_subject_list:true});
    this.setData({hide_select_item:true});

    console.log('onLoad');
    var that = this;
    
    


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
    this.setData({hide_index_page:false});
    var that = this;

    var simple_params = {
      gradeId : 112,
      pageSize : 3,
      pageNum : 1,
      subjectId: 1001,
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
    var select_item = base.getDetailContent(this,selectItem);
    
    // this.setData({select_item:selectItem});
  },

  likeAnswer:function(e){
    console.log(this.data.infos[itemIndex]);
    selectItem.is_like = true;
    this.setData({select_item:selectItem});
    this.data.infos[itemIndex].is_like = true;
    this.setData({infos:this.data.infos});
  },

  rewardAnswer:function(e){
    var selected = e.currentTarget.dataset.selected;
    console.log(selected);
    var parametersJSON ={
      answerId: selected.data[0].answerid
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


  selectSubject:function(e){
    
    var selected_subject = e.currentTarget.dataset.name;
    console.log(selected_subject);
    this.setData({hide_pop_subject_list:true});
  },



  onShow:function(){
    countdown(this);
  },

})


function countdown(that) {
  var second = that.data.second ;
    if (second == 0) {  
      that.setData({  
        second: '结束'  
      });  
      return ;  
  } 

  var time = setTimeout(function(){  
    that.setData({  
      second: second - 1  
    });  
    countdown(that);  
    }  
    ,1000)  
}



