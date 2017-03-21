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

    infos:[
      {
        avatar: null,
        answer_content: "美國總統川普(Donald Trump)上任第一個完整工作日(1月23日)簽署了三項行政命令、其中之一就是實現他去年提出的上任100天行動計畫：美國聯邦政府員工(軍人除外)總數將全面予以凍結、透過「遇缺不補」的方式逐年縮減規模。從英國智庫最新建議來看，川普應該好好利用彼得提爾(Peter Thiel)在人工智慧(AI)領域的人脈加速提升美國公共部門效率。英國電訊報報導，根據公共服務智庫《Reform》最新發表的報告，公家機關可望成為下一個優步(Uber)、預估到2030年英國中央政府13.7萬名行政公務員的工作都可由人工智慧聊天機器人來取代、預估一年可省下26億英鎊公帑。這份報告並且預估，30%的護士工作可以被自動化、部分專科的醫師工作也有3成可被人工智慧所取代。為減輕急診室的工作壓力，英國國家健康服務(NHS，公醫制度)已宣布將採用人工智慧去評估、篩檢病人病情。管理顧問機構德勤(Deloitte)也預測，未來10-20年超過三分之一的工作恐將面臨自動化的威脅。英國衛報去年10月報導，根據牛津大學、德勤的研究，自動化恐將令逾85萬名公務員丟掉飯碗。報導指出，公共部門高達130萬份行政工作最有可能(機率高達77%)被自動化",
        teacher_name: "王思聪",
        is_like: false,
        like_num: 88,
        reward_num: 10.00,
        question_content: "传言大陆正研究给予台湾地区民众“国民待遇”。国台办发言人安峰山昨天（8日）指出，中共中央举行的2017年对台工作会议，政策措施涉及台人在大陆的就业、社会保障、生活便利等，有关部门正按照会议精神研究，待成"
      },
      {
        avatar: null,
        answer_content: "传言大陆正研究给予台湾地区民众“国民待遇”。国台办发言人安峰山昨天（8日）指出，中共中央举行的2017年对台工作会议，政策措施涉及台人在大陆的就业、社会保障、生活便利等，有关部门正按照会议精神研究，待成",
        teacher_name: "周杰伦",
        is_like: true,
        like_num: 0,
        reward_num: 10.00,
        question_content: "十万个发了多少解放啦见识到了积分拉斯 为什么",
        voice_path:'template',
      },
      {
        avatar: null,
        answer_content: "传言大陆正研究给予台湾地区民众“国民待遇”。国台办发言人安峰山昨天（8日）指出，中共中央举行的2017年对台工作会议，政策措施涉及台人在大陆的就业、社会保障、生活便利等，有关部门正按照会议精神研究，待成",
        teacher_name: "周杰伦",
        is_like: true,
        like_num: 0,
        reward_num: 10.00,
        question_content: "十万个为什么大家好沙发还是都快来撒回复",
        voice_path:'template',
      }
    ]
    
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
    
    // listViewUtil.loadList(that,'index',config.PytheRestfulServerURL,
    // "/index/defaultList",
    // 10,
    //     simple_params,
    //     function (netData){
          //取出返回结果的列表
    //       return netData.data;
    //     },
    //     function(item){
         
    //     },
    //     {},
    //     'GET',
    // );
    
    


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





