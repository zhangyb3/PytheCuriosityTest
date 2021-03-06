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
var fileSys = require("../../utils/file.js");

var selectItem;
var itemIndex;


Page({
  data: {
    
    hide_subject_selection:false,
    hide_grade_selection:false,
    select_student:true,
    select_teacher:false,

    subject_name: '科目',
    subject_infos: [
    ],

    answers:[],
    hide_select_item: true,
    motto: 'Hello World',
    userInfo: {},
    val:[],
    
    preview_img_url: config.PytheFileServerURL ,
    hide_show_image_page: true,
    isPlaying: false, //是否正在播放


    hide_login:true,
    scrollHeight:0,

    hide_loading: true,

    index_page: true,
    finished: true,

    requestingResultList: false,
    
  },


  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          // scrollHeight: res.windowHeight - (100 * res.windowWidth / 750) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750,
          // scrollHeight: res.windowHeight - (50 * res.windowHeight / 750),
          scrollHeight: res.windowHeight,
        });
      }
    })

    this.setData({
      hide_register_lock_cover: false,
    });
    
    this.setData({hide_pop_subject_list:true});
    this.setData({hide_select_item:true});

    console.log('onLoad');

    
    wx.getSavedFileList({
      success: function(res) {
        console.log(res.fileList);
        res.fileList.forEach(function(file){
            wx.removeSavedFile({
              filePath: file.filePath,
              complete: function(res) {
                console.log(res);
              }
            });
          }
        );
      }
    })

    wx.setStorageSync('lastRemoteAudio', 'no');
    wx.setStorageSync('lastRemoteImg', 'no');
    wx.setStorageSync('playingVoice', 'no');
    // wx.setStorageSync('alreadyRegister', 'no');


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
      query: encodeURIComponent(this.data.search_content_text),
      pageSize: 10,
      pageNum: 1,
    };

    // listViewUtil.loadList(that,'index',config.PytheSearchServerURL,
    // "",
    // 10,
    //     searchParameters,
    //     function (netData){
    //       //取出返回结果的列表
    //       return netData.data;
    //     },
    //     function(item){
         
    //     },
    //     {},
    //     'GET',
    // );

    wx.navigateTo({
      url: 'search?searchContent='+this.data.search_content_text,
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })

  },


  filterSubject:function(subject_data){
    // this.setData({hide_login_item:false});
    // if(this.data.hide_login_item)
    // {
    //   this.setData({hide_login_item:false});
    // }
    // else
    // {
    //   this.setData({hide_login_item:true});
    // }
    console.log("subject filter");
    if(this.data.hide_pop_subject_list)
    {
      this.setData({hide_pop_subject_list:false});
    }
    else
    {
      this.setData({hide_pop_subject_list:true});
    }
    
    //加载科目列表

    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/index/subject',
    data: {
      gradeId: wx.getStorageSync(user.GradeID),
    },
      method: 'GET', 
      success: function(res){
        
      
        that.data.subject_infos = res.data;
        that.setData({
          subject_infos : that.data.subject_infos,
        });
      },
      fail: function() {

      },
      complete: function() {
      
      }
    });
  },

  selectOneItem:function(e){
    
    selectItem = e.currentTarget.dataset.item;
    itemIndex = e.currentTarget.dataset.index;
    console.log(JSON.stringify(selectItem) + "," + itemIndex);

    // this.setData({hide_select_item:false});
    // this.setData({hide_loading:false});
    selectItem.playingVoice = false;


    //进入详细列表	
    // base.cleanCacheFile(20);
    //base.getDetailContent(this,selectItem);
    wx.navigateTo({
      url: '../section/concrete_content?selectItem=' + encodeURIComponent(JSON.stringify(selectItem)) 
      
      + '&from_page=' + 'home_page',
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

  //点赞答案
  likeAnswer:function(e){
    var answer_index = e.currentTarget.dataset.answer_index;
    
    //点赞+1并更新数据库
    console.log(this.data.answers[answer_index]);
    

    var that = this;
    
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
        console.log(res.data.data);

        if(res.data.data.data == '点赞成功')
        {
          that.data.answers[answer_index].likesnum++;
          that.data.answers[answer_index].isClick = 1;
          that.setData({
            answers: that.data.answers,
          });
          wx.showToast({
            title: '点赞+1',
            icon: 'success',
            duration: 1000
          });
        }

      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
        
    
  },

  //打赏答案
  rewardAnswer:function(e){
    var selected = e.currentTarget.dataset.selected;
    var question = e.currentTarget.dataset.question;
    console.log(selected);
    var parametersJSON ={
      questionId: question.questionid,
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
  returnLoadImagePage:function(e){
    this.setData({
      hide_show_image_page: true,
      img_src:null,
      // hide_textarea : false,
    });
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
          hide_show_image_page: true,
          img_src:null,
      });
  },

  //login遮罩层消失
  returnLoginIndexPage: function(e) {
      console.log("return to index page");
      this.setData({
          hide_login_item: true,
      });
  },

  //科目筛选列表
  getSelectSubjectList:function(e){
    
    var selected_subject = e.currentTarget.dataset.name;
    console.log(selected_subject);
    this.setData({
      hide_pop_subject_list:true,
      subject_name : selected_subject,
    });

    var that = this;
    var subjectParamters = {
      subjectId: e.currentTarget.dataset.subject_id,
      pageSize: 5,
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


    {
      var simple_params = {
        gradeId: wx.getStorageSync(user.GradeID),
        pageSize: 10,
        pageNum: 1,

      };
      this.setData({
        hide_loading: false,
      });
      listViewUtil.loadList(that, 'index', config.PytheRestfulServerURL,
        "/index/defaultList",
        10,
        simple_params,
        function (netData) {
          //取出返回结果的列表
          return netData.data;
        },
        function (item, that) {
          that.setData({
            hide_loading: true,
          });
        },
        {},
        'GET',
      );
      wx.setStorageSync('index_load_type', 'one');
    }




    this.setData({
      hide_register_lock_cover: true,
    });
    

  },

  onShow:function(){


   
    

  },

  

})





