// pages/personal/personal_answer.js

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");
var fileSys = require("../../utils/file.js");

Page({
  data:{
    personal_answer_menu:[
    {
        name:"待教",
        value:"not answer",
        active:true
    },
    {
        name:"已教",
        value:"already answer",
        active:false
    }
    ],

    personal_answer_list:[
      
    ],

    personal_not_answer_list:[
      
    ],

    list_mode:'my_unanswer',

    hide_show_image_page: true,
    hide_select_item: true,
    scrollHeight:0,

    hide_personal_answer_list:true,
    hide_personal_not_answer_list:false,
    preview_img_url: config.PytheFileServerURL ,

    finished: false,
    answer_page: true,
    userRole: 0,

    requestingResultList: false,
    
  },
  onLoad:function(parameters){
    console.log("from personal");
    console.log(parameters);
    
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          // scrollHeight: res.windowHeight - (100 * res.windowWidth / 750) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
          // scrollHeight: res.windowHeight - (50 * res.windowHeight / 750)
          scrollHeight: res.windowHeight,
        });
      }
    })
  },



  selectAlreadyAnswer:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var personal_answer_menu = this.data.personal_answer_menu;
    if(personal_answer_menu[1].value == value)
    {
      console.log("已答");
      this.data.personal_answer_menu[1].active = true;
      this.data.personal_answer_menu[0].active = false;
      
      this.setData({hide_personal_answer_list:false});
      
      this.setData({hide_personal_not_answer_list:true});

      
      this.data.list_mode = 'my_answered';
      if(wx.getStorageSync(user.Status) == 1)
      {
        this.data.list_mode = 'teacher_answered';
      }
      if(wx.getStorageSync(user.Status) == 0)
      {
        this.data.list_mode = 'student_answered';
      }
    }
    else
    {
      this.data.personal_answer_menu[1].active = false;
      this.data.personal_answer_menu[0].active = true;
    }
    this.setData({personal_answer_menu : personal_answer_menu});
    
  },

  selectNotAnswer:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var personal_answer_menu = this.data.personal_answer_menu;
    if(personal_answer_menu[0].value == value)
    {
      console.log("未答");
      this.data.personal_answer_menu[0].active = true;
      this.data.personal_answer_menu[1].active = false;
      
      this.setData({hide_personal_answer_list:true});
      
      this.setData({hide_personal_not_answer_list:false});

      this.data.list_mode = 'my_unanswer';
      if(wx.getStorageSync(user.Status) == 1)
      {
        this.data.list_mode = 'teacher_unanswer';
      }
      if(wx.getStorageSync(user.Status) == 0)
      {
        this.data.list_mode = 'student_unanswer';
      }
    }
    else
    {
      this.data.personal_answer_menu[0].active = false;
      this.data.personal_answer_menu[1].active = true;
    }
    this.setData({personal_answer_menu : personal_answer_menu});

  },

  selectOneNotAnswer:function(result){
    var index = result.currentTarget.dataset.index;
    var parametersJSON = result.currentTarget.dataset.item;
    parametersJSON.question_id = parametersJSON.questionid;
    parametersJSON.subject_id = parametersJSON.subjectid;
    parametersJSON.student_id = parametersJSON.studentid;
    parametersJSON.text_content = parametersJSON.questioncontent.text[0];
    parametersJSON.photo_path = parametersJSON.questioncontent.img[0];
    parametersJSON.draw_path = parametersJSON.questioncontent.draw[0];
    parametersJSON.audio_path = parametersJSON.questioncontent.audio[0];
    parametersJSON.audio_duration = parametersJSON.questioncontent.audio[1];
    console.log(parametersJSON);
    var parameters = netUtil.json2Form(parametersJSON);
    console.log(parameters);

    if(wx.getStorageSync('alreadyRegister') == 'yes' && wx.getStorageSync(user.Status) == 1)
    {
      wx.navigateTo({
        url: '../answer/answer_operation' + '?' + parameters,
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      });
    }
    
  },

  selectOneItem:function(result){
    

    if(this.data.hide_personal_answer_list)
    {
      var index = result.currentTarget.dataset.index;
      var parametersJSON = result.currentTarget.dataset.item;
      parametersJSON.question_id = parametersJSON.questionid;
      parametersJSON.subject_id = parametersJSON.subjectid;
      parametersJSON.student_id = parametersJSON.studentid;
      parametersJSON.text_content = parametersJSON.questioncontent.text[0];
      parametersJSON.photo_path = parametersJSON.questioncontent.img[0];
      parametersJSON.draw_path = parametersJSON.questioncontent.draw[0];
      parametersJSON.audio_path = parametersJSON.questioncontent.audio[0];
      parametersJSON.audio_duration = parametersJSON.questioncontent.audio[1];
      console.log(parametersJSON);
      var parameters = netUtil.json2Form(parametersJSON);
      console.log(parameters);

      if(wx.getStorageSync(user.Status) == 1 )
      {
        wx.navigateTo({
          url: '../answer/answer_operation' + '?' + parameters,
          success: function (res) {
            // success
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        });
      }
      else
      {
        wx.showModal({
          title: '提示',
          content: '学生尚未开通答题功能',
        })
      }
      
    }
    if(this.data.hide_personal_not_answer_list)
    {
      var selectItem,itemIndex;
      selectItem = result.currentTarget.dataset.item;
      itemIndex = result.currentTarget.dataset.index;
      console.log(JSON.stringify(selectItem) + "," + itemIndex);

      // this.setData({hide_select_item:false});
      var that = this;
      //请求具体数据
      // base.getDetailContent(this,selectItem);

      wx.navigateTo({
        url: '../section/concrete_content?selectItem=' + JSON.stringify(selectItem) + '&from_page=' + 'answer_page',
        success: function(res){
          // success
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      });


    }

    

  },

  returnIndexPage: function(e) {
      console.log("return to index page");
      
      this.setData({
          hide_select_item: true,
          hide_show_image_page: true,
          img_src:null,
      });
  },


  playVoiceRecord:function(e){
    var that = this;
    that.setData({
      isPlaying: true
    })
    wx.showToast({
      title: '下载录音',
      icon: 'success',
      duration: 1000
    });
    var that = this;
    
    var voiceRemotePath = e.currentTarget.dataset.voice;
    
    fileSys.downloadFile(that,decodeURI(voiceRemotePath),'audio');
    

  },

  showPhoto:function(e){
    var photo = decodeURIComponent(e.currentTarget.dataset.photo);
    console.log("显示图片" + photo);
    fileSys.downloadFile(this,photo,'image',
      (successReturn)=>{
        console.log(successReturn);
        var parametersJSON = {
          image_source : successReturn,
        };
        var parameters = netUtil.json2Form(parametersJSON);
        wx.navigateTo({
          url: '../section/image_frame'+'?'+ parameters,
          success: function(res){
            // success
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        });
      },
      (failReturn)=>{

      }
    );
    
    
    
   

  },
  showDraw:function(e){
    var draw = decodeURIComponent(e.currentTarget.dataset.draw);
    console.log("显示手绘" + draw);
    fileSys.downloadFile(this,draw,'image',
      (successReturn)=>{
        console.log(successReturn);
        var parametersJSON = {
          image_source : successReturn,
        };
        var parameters = netUtil.json2Form(parametersJSON);
        wx.navigateTo({
          url: '../section/image_frame'+'?'+ parameters,
          success: function(res){
            // success
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        });
      },
      (failReturn)=>{

      }
    );
    
  },

  onReady:function(){
    // 页面渲染完成
    this.setData({
      alreadyRegister: wx.getStorageSync('alreadyRegister'),
    });
  },
  onShow:function(){
    // 页面显示
    //加载已答列表
    var that = this;
    that.data.finished = false;
    if(wx.getStorageSync(user.Status) == 1)
    {
      that.setData({
        userRole: 1,
      });
      var myAnsweredParams = {
        teacherId : wx.getStorageSync(user.TeacherID),
        pageSize : 10,
        pageNum : 1,
        
      };    
      listViewUtil.loadList(that,'teacher_answered',config.PytheRestfulServerURL,
      base.TEACHER_ANSWERED_URL_DETAIL,
      10,
          myAnsweredParams,
          function (netData){
            //取出返回结果的列表
            return netData.data;
          },
          function(item){
            
          },
          {},
          'GET',
      );

      //加载未答列表
      var that = this;
      var myUnanswerParams = {
        teacherId : wx.getStorageSync(user.TeacherID),
        pageSize : 10,
        pageNum : 1,
        
      };    
      listViewUtil.loadList(that,'teacher_unanswer',config.PytheRestfulServerURL,
      base.TEACHER_UNANSWER_URL_DETAIL,
      10,
          myUnanswerParams,
          function (netData){
            //取出返回结果的列表
            return netData.data;
          },
          function(item){
          
          },
          {},
          'GET',
      );
    }
    if(wx.getStorageSync(user.Status) == 0)
    {
      that.setData({
        userRole: 0,
      });
      var myAnsweredParams = {
        studentId : wx.getStorageSync(user.TeacherID),
        pageSize : 10,
        pageNum : 1,
        
      };    
      listViewUtil.loadList(that,'student_answered',config.PytheRestfulServerURL,
      base.STUDENT_ANSWERED_URL_DETAIL,
      10,
          myAnsweredParams,
          function (netData){
            //取出返回结果的列表
            return netData.data;
          },
          function(item){
            
          },
          {},
          'GET',
      );

      //加载未答列表
      var that = this;
      var myUnanswerParams = {
        studentId : wx.getStorageSync(user.TeacherID),
        pageSize : 10,
        pageNum : 1,
        
      };    
      listViewUtil.loadList(that,'student_unanswer',config.PytheRestfulServerURL,
      base.STUDENT_UNANSWER_URL_DETAIL,
      10,
          myUnanswerParams,
          function (netData){
            //取出返回结果的列表
            return netData.data;
          },
          function(item){
          
          },
          {},
          'GET',
      );
    }

    this.setData({
      finished: this.data.finished,
      answer_page: this.data.answer_page,
      userRole: this.data.userRole,
    });
    
  },


  abandonQuestion:function(e){
    var question = e.currentTarget.dataset.question;
    console.log("abandon " + JSON.stringify(question));

    abandonQuestionToRefund(this, question);


  },


  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})

function handleQuestionBillData(the, question)
{
  var that = the;
  wx.request({
    url: config.PytheRestfulServerURL + '/bill/mapQuestion',
    data: {
      questionId: question.questionid,
      studentId: wx.getStorageSync(user.StudentID),
    },
    method: 'POST',
    success: function(res){
      // success
      console.log(res.data.data);
      var bill = res.data.data;
      
       wx.showModal({
        title: '结束提问？',
        content: '结束提问后会自动退还赏金',
        success: function(res) {
          if (res.confirm) {
           refund(that, bill);
           
          } 
        }
      });

    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
  
}

function refund(the, bill)
{
  var that = the;
  wx.request({
    url: config.PytheRestfulServerURL + '/user/pay/refund',
    data: {
      out_trade_no: bill.outTradeNo,
      total_fee: bill.money * 100,
      refund_fee: bill.money * 100 / 2,
    },
    method: 'POST', 
    success: function(res){
      // success
      that.onShow();
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
}

function abandonQuestionToRefund(the, question)
{
  handleQuestionBillData(the, question);
}
