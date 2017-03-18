// pages/answer/answer.js


var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");

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
    
    questionsForAnswer:[
      {
        avatar: null,
        answer_content: "美國總統川普(Donald Trump)上任第一個完整工作日(1月23日)簽署了三項行政命令、其中之一就是實現他去年提出的上任100天行動計畫：美國聯邦政府員工(軍人除外)總數將全面予以凍結、透過「遇缺不補」的方式逐年縮減規模。從英國智庫最新建議來看，川普應該好好利用彼得提爾(Peter Thiel)在人工智慧(AI)領域的人脈加速提升美國公共部門效率。英國電訊報報導，根據公共服務智庫《Reform》最新發表的報告，公家機關可望成為下一個優步(Uber)、預估到2030年英國中央政府13.7萬名行政公務員的工作都可由人工智慧聊天機器人來取代、預估一年可省下26億英鎊公帑。這份報告並且預估，30%的護士工作可以被自動化、部分專科的醫師工作也有3成可被人工智慧所取代。為減輕急診室的工作壓力，英國國家健康服務(NHS，公醫制度)已宣布將採用人工智慧去評估、篩檢病人病情。管理顧問機構德勤(Deloitte)也預測，未來10-20年超過三分之一的工作恐將面臨自動化的威脅。英國衛報去年10月報導，根據牛津大學、德勤的研究，自動化恐將令逾85萬名公務員丟掉飯碗。報導指出，公共部門高達130萬份行政工作最有可能(機率高達77%)被自動化",
        teacher_name: "自己",
        is_like: false,
        like_num: 88,
        reward_num: 10.00,
        question_content: "传言大陆正研究给予台湾地区民众“国民待遇”。国台办发言人安峰山昨天（8日）指出，中共中央举行的2017年对台工作会议，政策措施涉及台人在大陆的就业、社会保障、生活便利等，有关部门正按照会议精神研究，待成",
        voice_path:'template',
      },
      {
        avatar: null,
        answer_content: "传言大陆正研究给予台湾地区民众“国民待遇”。国台办发言人安峰山昨天（8日）指出，中共中央举行的2017年对台工作会议，政策措施涉及台人在大陆的就业、社会保障、生活便利等，有关部门正按照会议精神研究，待成",
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
    // 页面初始化 options为页面跳转所带来的参数
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
    // console.log(value);
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
    
    var selected_subject = e.currentTarget.dataset.name;
    console.log(selected_subject);
    
    this.setData({hide_pop_subject_list:true});

    var answer_page_menu = this.data.answer_page_menu;
    this.data.answer_page_menu[0].active = false;
    this.data.answer_page_menu[1].active = false;
    this.setData({answer_page_menu : answer_page_menu});

    wx.request({
      url: 'https://URL',
      data: {},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
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

  selectSortAttribute:function(e){
    
    var selected_sort_attribute = e.currentTarget.dataset.name;
    console.log(selected_sort_attribute);
    
    this.setData({hide_pop_sort_attribute_list:true});

    var answer_page_menu = this.data.answer_page_menu;
    this.data.answer_page_menu[0].active = false;
    this.data.answer_page_menu[1].active = false;
    this.setData({answer_page_menu : answer_page_menu});

    wx.request({
      url: 'https://URL',
      data: {},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
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