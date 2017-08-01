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

    searchContent:'查询',

    hide_knowledge_list:false,
    hide_teacher_list: true,
    hide_org_list: true,

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },

  listenSearchInput:function(e){
    console.log(e.detail.value);
    this.setData({
      searchContent: e.detail.value,
    });
  },
  searchByContent:function(e){
    console.log(this.data.searchContent);

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
      this.data.list_mode = 'knowledge_list';
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
      this.data.list_mode = 'teacher_list';
    }
    
    this.setData({index_search_menu : index_search_menu});

  },

  orgFilter:function(e){
    var value = e.target.dataset.value; // 获取当前点击标签的值
    console.log(value);
    var index_search_menu = this.data.index_search_menu;
    if(index_search_menu[2].value == value)
    {
      console.log("teacher");
      this.data.index_search_menu[2].active = true;
      this.data.index_search_menu[0].active = false;
      this.data.index_search_menu[1].active = false;
      
      this.setData({hide_knowledge_list:true});
      this.setData({hide_teacher_list:true});
      
      this.setData({hide_org_list:false});
      this.data.list_mode = 'org_list';
    }
    
    this.setData({index_search_menu : index_search_menu});

  },

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})