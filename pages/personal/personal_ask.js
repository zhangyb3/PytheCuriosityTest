// pages/personal/personal_ask.js

var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");

Page({
  data:{
    personal_ask_list:[
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
  },
  onLoad:function(parameters){
    console.log("from personal");
    console.log(parameters);
    
  },

  selectOneQuestion:function(result){
    var question = result.currentTarget.dataset.item;
    console.log(JSON.stringify(question));
    var parametersString = netUtil.json2Form(question);
    wx.navigateTo({
      url: 'personal_ask_detail' + '?' + parametersString,
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