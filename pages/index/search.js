// pages/index/search.js
var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");
var user = require("../../utils/user.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

Page({
  data:{

    index_search_menu:[{
        name:"知识点",
        value:"knowledge",
        active:true
    },{
        name:"教师",
        value:"teacher",
        active:false
    },{
        name:"机构",
        value:"organization",
        active:false
    }],

    searchContent:'',

    hide_knowledge_list:false,
    hide_teacher_list: true,
    hide_org_list: true,

    infos: [],
    search_knowledge_list:[],
    search_teacher_list:[],
    search_org_list:[],

    index_search_page: true,

    list_mode: 'index_search_knowledge',
    list_type: 'index',
  },
  onLoad:function(parameters){
    console.log(parameters);
    this.data.searchContent = parameters.searchContent;
    searchByContent(this);
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },

  listenSearchInput:function(e){
    console.log(e.detail.value);
    this.data.searchContent = e.detail.value
  },
  searchByContent:function(e){
    searchByContent(this);
  },
  cancelSearchInput:function(e){
    this.setData({
      searchContent: '',
    });
  },

  knowledgeFilter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var index_search_menu = this.data.index_search_menu;
    if(index_search_menu[0].value == value)
    {
      console.log("knowledge");
      this.data.index_search_menu[0].active = true;
      this.data.index_search_menu[1].active = false;
      this.data.index_search_menu[2].active = false;
      
      this.setData({hide_teacher_list:true});
      this.setData({hide_org_list:true});
      
      this.setData({hide_knowledge_list:false});
      this.data.list_mode = 'index_search_knowledge';
      // this.setData({
      //   search_knowledge_list: this.data.search_knowledge_list
      // });
    }
    
    this.setData({index_search_menu : index_search_menu});
    
  },

  teacherFilter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var index_search_menu = this.data.index_search_menu;
    if(index_search_menu[1].value == value)
    {
      console.log("teacher");
      this.data.index_search_menu[1].active = true;
      this.data.index_search_menu[0].active = false;
      this.data.index_search_menu[2].active = false;
      
      this.setData({hide_knowledge_list:true});
      this.setData({hide_org_list:true});
      
      this.setData({hide_teacher_list:false});
      this.data.list_mode = 'index_search_teacher';
      // this.setData({
      //   search_teacher_list: this.data.teacher_list
      // });
    }
    
    this.setData({index_search_menu : index_search_menu});

  },

  orgFilter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var index_search_menu = this.data.index_search_menu;
    if(index_search_menu[2].value == value)
    {
      console.log("organization");
      this.data.index_search_menu[2].active = true;
      this.data.index_search_menu[0].active = false;
      this.data.index_search_menu[1].active = false;
      
      this.setData({hide_knowledge_list:true});
      this.setData({hide_teacher_list:true});
      
      this.setData({hide_org_list:false});
      this.data.list_mode = 'index_search_org';
      // this.setData({
      //   search_org_list: this.data.search_org_list
      // });
    }
    
    this.setData({index_search_menu : index_search_menu});

  },

  askOneTeacher:function(e){
    var teacher = e.currentTarget.dataset.teacher;
    console.log(teacher);

    //先判断是否已注册
    // if(wx.getStorageSync('alreadyRegister') == 'no')
    // {
    //   this.setData({
    //     hide_login: false,
    //   });
    //   loadingSelections.call(this);
    // }
    // if(wx.getStorageSync('alreadyRegister') == 'yes')
    {
      console.log("navigate to ask operation page");
      teacher['teacherid'] = teacher.userid;
      teacher['subjectId'] = teacher.subjectid;
      var parametersJSON = teacher;
      
      console.log(parametersJSON);
      var parameters = netUtil.json2Form(parametersJSON);
      // console.log(parameters);
      wx.navigateTo({
        url: '../ask/ask_operation' + '?' + parameters,
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
    }
  },

  askOneOrg:function(e){
    var org = e.currentTarget.dataset.org;
    console.log(org);
    wx.navigateTo({
      url: 'orgInfo?' 
          + 'orgId=' + org.id + '&'
          + 'orgManagerId=' + org.managerId + '&'
          ,
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

  likeTeacher:function(e){
    var teacher = e.currentTarget.dataset.teacher;
    console.log('student ' + wx.getStorageSync(user.StudentID) + " like teacher " + teacher.username);

    var that = this; 
    
    if(that.data.search_teacher_list[teacher_index].collectOrNot == false)
    {
      //通知数据库更新纪录
      wx.request({
        url: config.PytheRestfulServerURL + '/question/teacher/likes',
        data: {
          userId: wx.getStorageSync(user.UserID),
          // teacherId: teacher.teacherid,
          teacherId: teacher.userid,
        },
        method: 'GET', 
        success: function(res){
          

          console.log(res);
          if(res.data.data == 1)
          {
            that.data.ask_teacher_list[teacher_index].popularity++;
            that.data.ask_teacher_list[teacher_index].isClick = 0;
            that.setData({
              ask_teacher_list: that.data.ask_teacher_list,
            });
            wx.showToast({
              title: '点赞+1',
              icon: 'success',
              duration: 1000
            });
          }

          if(res.data.data == '关注成功')
          {
            that.data.search_teacher_list[teacher_index].collectOrNot = true;
            that.setData({
              search_teacher_list: that.data.search_teacher_list,
            });
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1000
            });
          }
          
        },
        fail: function(res) {
          console.log(res);
        }
      });
    }   

  },

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})


function searchByContent(the)
{
  var search_content = the.data.searchContent;
  console.log(search_content);
  
  var that = the;
  var searchParameters = {
    query: search_content,
    subjectId: -1,
    userId: -1,
    pageNum: 1,
    pageSize: 10
  };
  if(wx.getStorageSync(user.StudentID) != 'StudentID')
  {
    searchParameters.userId = wx.getStorageSync(user.StudentID);
  }

  the.setData({
    search_knowledge_list: [],
    search_teacher_list: [],
    search_org_list: [],
  });

  //三种列表
  listViewUtil.loadList(that,'index_search_knowledge',config.PytheRestfulServerURL,
  "/index/search/knowledge",
  10,
      searchParameters,
      function (netData){
        //取出返回结果的列表
        return netData.data;
      },
      function(item){
        
      },
      {},
      'GET',
  );

  listViewUtil.loadList(that,'index_search_teacher',config.PytheRestfulServerURL,
  "/index/search/teacher",
  10,
      searchParameters,
      function (netData){
        //取出返回结果的列表
        return netData.data;
      },
      function(item){
        
      },
      {},
      'GET',
  );

  listViewUtil.loadList(that,'index_search_org',config.PytheRestfulServerURL,
  "/index/search/organization",
  10,
      searchParameters,
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