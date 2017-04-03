//index.js
//获取应用实例
var app = getApp()

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

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
    ],

    answers:[],
    hide_select_item: true,
    motto: 'Hello World',
    userInfo: {},
    val:[],
    

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
    //加载科目列表
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

  selectOneItem:function(e){
    
    selectItem = e.currentTarget.dataset.item;
    itemIndex = e.currentTarget.dataset.index;
    console.log(JSON.stringify(selectItem) + "," + itemIndex);

    this.setData({hide_select_item:false});

    //进入详细列表
    val = base.getDetailContent(this,selectItem);console.log(val);
    
    // this.setData({select_item:selectItem});
  },

  //点赞答案
  likeAnswer:function(e){
    var answer_index = e.currentTarget.dataset.answer_index;
    
    //点赞+1并更新数据库
    console.log(this.data.answers[answer_index]);
    this.data.answers[answer_index].likesnum++;
    this.setData({
      answers: this.data.answers,
    });

    var that = this;
    //先查是否已点赞过这道题
    wx.request({
      url: config.PytheRestfulServerURL + '/user/question/likes',
      data: {
        userId: wx.getStorageSync(user.UserID),
        answerId: this.data.answers[answer_index].answerid,
      },
      method: 'GET', 
      success: function(res){
        // 没点赞过
        if(res.data.data == false)
        {
          //更新数据库
          wx.request({
            url: config.PytheRestfulServerURL + '/likesnum',
            data: {
              answerId: that.data.answers[answer_index].answerid,
              userId: wx.getStorageSync(user.UserID),
              questionId:  that.data.answers[answer_index].questionid,
            },
            method: 'GET', 
            success: function(res){
              // success
              wx.showToast({
                title: '点赞+1',
                icon: 'success',
                duration: 1000
              });
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
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
    
  },

  //打赏答案
  rewardAnswer:function(e){
    var selected = e.currentTarget.dataset.selected;
    console.log(selected);
    var parametersJSON ={
      answerId: selected.answerid,
      payFee: true,
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
      gradeId: wx.getStorageSync(user.GradeID),
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


  onReady:function(){
    
    
    
    var that = this;
    var simple_params = {
      gradeId : wx.getStorageSync(user.GradeID),
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
    wx.setStorageSync('index_load_type', 'one');

  },

  onShow:function(){
    //判断注册了没有
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

    //判断是否从注册页面返回
    if(wx.getStorageSync('fromRegister')=='yes')
    {
      

      wx.setStorageSync('fromRegister', 'no');
    }
  },

  

})





