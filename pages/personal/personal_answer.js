// pages/personal/personal_answer.js

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

Page({
  data:{
    personal_answer_menu:[{
        name:"已答",
        value:"already answer",
        active:true
    },{
        name:"未答",
        value:"not answer",
        active:false
    }],

    personal_answer_list:[
      {
        avatar: null,
        answer_content: "美國總統川普(Donald Trump)上任第一個完整工作日(1月23日)簽署了三項行政命令、其中之一就是實現他去年提出的上任100天行動計畫：美國聯邦政府員工(軍人除外)總數將全面予以凍結、透過「遇缺不補」的方式逐年縮減規模。從英國智庫最新建議來看，川普應該好好利用彼得提爾(Peter Thiel)在人工智慧(AI)領域的人脈加速提升美國公共部門效率。英國電訊報報導，根據公共服務智庫《Reform》最新發表的報告，公家機關可望成為下一個優步(Uber)、預估到2030年英國中央政府13.7萬名行政公務員的工作都可由人工智慧聊天機器人來取代、預估一年可省下26億英鎊公帑。這份報告並且預估，30%的護士工作可以被自動化、部分專科的醫師工作也有3成可被人工智慧所取代。為減輕急診室的工作壓力，英國國家健康服務(NHS，公醫制度)已宣布將採用人工智慧去評估、篩檢病人病情。管理顧問機構德勤(Deloitte)也預測，未來10-20年超過三分之一的工作恐將面臨自動化的威脅。英國衛報去年10月報導，根據牛津大學、德勤的研究，自動化恐將令逾85萬名公務員丟掉飯碗。報導指出，公共部門高達130萬份行政工作最有可能(機率高達77%)被自動化",
        teacher_name: "自己",
        is_like: false,
        like_num: 88,
        reward_num: 10.00,
        question_content: "传言大陆正研究给予台湾地区民众“国民待遇”。国台办发言人安峰山昨天（8日）指出，中共中央举行的2017年对台工作会议，政策措施涉及台人在大陆的就业、社会保障、生活便利等，有关部门正按照会议精神研究，待成"
      },
      {
        avatar: null,
        answer_content: "传言大陆正研究给予台湾地区民众“国民待遇”。国台办发言人安峰山昨天（8日）指出，中共中央举行的2017年对台工作会议，政策措施涉及台人在大陆的就业、社会保障、生活便利等，有关部门正按照会议精神研究，待成",
        teacher_name: "自己",
        is_like: true,
        like_num: 0,
        reward_num: 10.00,
        question_content: "十万个为什么",
        voice_path:'template',
      }
    ],

    personal_not_answer_list:[
      {
        avatar: null,
        questionid:"template",
        teacher_name: "自己",
        is_like: false,
        like_num: 88,
        reward_num: 10.00,
        questioncontent: "传言大陆正研究给予台湾地区民众“国民待遇”。国台办发言人安峰山昨天（8日）指出，中共中央举行的2017年对台工作会议，政策措施涉及台人在大陆的就业、社会保障、生活便利等，有关部门正按照会议精神研究，待成",
        voice_path:"template",
        voice_timeLength:9.99,
      },
      {
        avatar: null,
        
        teacher_name: "自己",
        is_like: true,
        like_num: 0,
        reward_num: 10.00,
        questioncontent: "十万个为什么"
      }
    ],

    hide_show_image_page: true,


    hide_personal_answer_list:false,
    hide_personal_not_answer_list:true,

  },
  onLoad:function(parameters){
    console.log("from personal");
    console.log(parameters);
    
    //加载个人已答列表
    var that = this;
    var myAnsweredParams = {
      teacherId : wx.getStorageSync(user.TeacherID),
      pageSize : 3,
      pageNum : 1,
      
    };    
    listViewUtil.loadList(that,'my_answered',config.PytheRestfulServerURL,
    base.MY_ANSWERED_URL_DETAIL,
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

    //加载个人未答列表
    var that = this;
    var myUnanswerParams = {
      teacherId : wx.getStorageSync(user.TeacherID),
      pageSize : 3,
      pageNum : 1,
      
    };    
    listViewUtil.loadList(that,'my_unanswer',config.PytheRestfulServerURL,
    base.MY_UNANSWER_URL_DETAIL,
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

  },



  selectAlreadyAnswer:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var personal_answer_menu = this.data.personal_answer_menu;
    if(personal_answer_menu[0].value == value)
    {
      console.log("已答");
      this.data.personal_answer_menu[0].active = true;
      this.data.personal_answer_menu[1].active = false;
      
      this.setData({hide_personal_answer_list:false});
      
      this.setData({hide_personal_not_answer_list:true});
    }
    else
    {
      this.data.personal_answer_menu[0].active = false;
      this.data.personal_answer_menu[1].active = true;
    }
    this.setData({personal_answer_menu : personal_answer_menu});
    
  },

  selectNotAnswer:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var personal_answer_menu = this.data.personal_answer_menu;
    if(personal_answer_menu[1].value == value)
    {
      console.log("未答");
      this.data.personal_answer_menu[1].active = true;
      this.data.personal_answer_menu[0].active = false;
      
      this.setData({hide_personal_answer_list:true});
      
      this.setData({hide_personal_not_answer_list:false});
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
    console.log(parametersString);
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
  }
})