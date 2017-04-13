// pages/ask/ask_operation.js

var config = require("../../utils/config.js");
var fileSys = require("../../utils/file.js");
var base = require("../../utils/base.js");
var pay = require("../../utils/pay.js");
var user = require("../../utils/user.js");
var config = require("../../utils/config.js");

Page({
  data:{
    hide_show_image_page: true,
    hide_record_sound_section : true,
    hide_take_photo_section : true,
    hide_draw_picture_section : true,
    hide_textarea : false,
    soundData:{

      loop: 1,//帧动画初始图片
      isSpeaking: false,//是否正在说话
      speakingTimeLength: 0,//说话时长
      voices: [],//音频数组
    },

    pen:{
      lineWidth: 2,
      color: 'black',
    },
    photoFilePath: null,
    pictureFilePath: null,

    ask_question:{
      voice_path: null,
      voice_timeLength: 0,
      draw_path: null,
      subjectId: null,
      not_select_subject: false,
    },

    subjects: [
      {
        subjectId: null,
        subject: '请选择',
      },
    ],
    subject_index:0,

    preview_img_url: config.PytheFileServerURL ,

    hasPaidReward: false,
  },
  onLoad:function(parameters){
    console.log("from ask");
  
    this.setData({
      hide_record_sound_section : true,
      hide_take_photo_section : true,
      hide_draw_picture_section : true,
      hide_textarea: false,
    });
    
    console.log(parameters);
    this.data.ask_question.studentId = wx.getStorageSync(user.StudentID);

    if(parameters.teacherid != null)
    {
      this.data.ask_question.ask_teacherId = parameters.teacherid;
      this.data.ask_question.not_select_subject = true;
    }
    if(parameters.subjectId != null)
    {
      this.data.ask_question.question_subjectId = parameters.subjectId;
      this.data.ask_question.ask_teacherId = -1;
    }
    console.log(this.data.ask_question);
    this.setData({
      ask_question: this.data.ask_question,
    });
 
    
    var that = this;

    var subjectRange = ['请选择'];
    //加载动态课程列表,年级列表
    wx.request({
      url: config.PytheRestfulServerURL + '/user/register/subject',
      data: {

      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res.data.data.data);
        
        for(var count = 0; count < res.data.data.data.length; count++)
        {
          
          subjectRange[count+1] = res.data.data.data[count].subject;
          that.data.subjects[count+1] = res.data.data.data[count];
          console.log(subjectRange);
        }
        
        that.setData({
          subjectRange: subjectRange,
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

  getQuestionText:function(e){
    var text_input = e.detail.value;
    console.log(text_input);
    this.data.ask_question.text_content = text_input;
  },

  recordSound:function(e){
    console.log("录音功能");
    this.setData({
      hide_record_sound_section : false,
      hide_textarea: true,
    });
     
  },
  

  //手指按下开始录音
  startRecordVoice: function () {
    console.log("手指按下了...")
    console.log("new date : " + new Date)
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true,
    })
    //开始录音
    wx.startRecord({
      success: function (res) {
        //临时路径,下次进入小程序时无法正常使用
        var tempFilePath = res.tempFilePath
        console.log("tempFilePath: " + tempFilePath)
        //持久保存
        wx.saveFile({
          tempFilePath: tempFilePath,
          timeLength : _this.data.soundData.speakingTimeLength,
          success: function (res) {
            //持久路径
            //本地文件存储的大小限制为 100M
            var savedFilePath = res.savedFilePath;
            var timeLength = res.timeLength;
            console.log("savedFilePath: " + savedFilePath);
            console.log("timeLength: " + timeLength);
          }
        })
        wx.showToast({
          title: '录音成功',
          icon: 'success',
          duration: 1000
        })
        //获取录音音频列表
        wx.getSavedFileList({
          success: function (res) {
            var voices = [];
            
            /**
             * 只显示最新的录音
             */
            //格式化时间
            var i = res.fileList.length-1;
            var createTime = new Date(res.fileList[i].createTime)
            //将音频大小B转为KB
            var size = (res.fileList[i].size / 1024).toFixed(2);
            var voice = { filePath: res.fileList[i].filePath, createTime: createTime, size: size , timeLength: _this.data.speakingTimeLength };
            voices = voices.concat(voice);

            _this.setData({
              voices: voices,
              
            });

            
          }
        })


      },
      fail: function (res) {
        //录音失败
        wx.showModal({
          title: '提示',
          content: '录音的姿势不对!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              return
            }
          }
        })
      }
    })
  },


  //手指松开结束录音
  finishRecordVoice: function () {
    console.log("手指抬起了...")
    this.setData({
      isSpeaking: false,
    })
    clearInterval(this.timer)
    wx.stopRecord()
  },


  //点击播放录音
  gotoPlayVoice: function (e) {
    var filePath = e.currentTarget.dataset.key;
    //点击开始播放
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    wx.playVoice({
      filePath: filePath,
      success: function () {
        wx.showToast({
          title: '播放结束',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  //选择录音
  selectVoiceRecord:function(e){
    var that = this;
    this.setData({
      hide_record_sound_section: true,
      hide_textarea: false,
    });
    var voicePath = e.currentTarget.dataset.key;
    this.data.ask_question.voice_path = voicePath;
    this.setData({
      ask_question: this.data.ask_question,
      hide_voice_bubble: false,
    });
    console.log(this.data.ask_question.voice_path);
    

    wx.request({
      url: config.PytheRestfulServerURL + '/file/uploadFilePrepare',
      data: {
        userFilePath: voicePath,
        fileType: 'audio',
      },
      method: 'POST', 
      success: function(res){
        // success
        console.log(res.data.data)
        var result = JSON.parse(res.data.data);
        that.data.ask_question.upload_voice_path = result.path;

        //上传录音
        var parameters = {
          path : that.data.ask_question.upload_voice_path,
          fileType : 'audio',
        };
        that.data.ask_question.photo_path = fileSys.uploadFile(that.data.ask_question.voice_path,parameters);
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });

    
  },

  drawPicture:function(e){
    console.log("画板功能");
    this.setData({
      hide_draw_picture_section : false,
      hide_textarea: true,
    });
  },



  returnOperationPage:function(e){
    
    this.setData({
      hide_record_sound_section : true,
      hide_take_photo_section : true,
      hide_draw_picture_section : true,
      hide_textarea: false,
      ask_question: this.data.ask_question,
    });
  },

  onReady:function(){
    // 页面渲染完成
    
  },

  startX: 0, //保存X坐标轴变量
  startY: 0, //保存X坐标轴变量
  isClear : false, //是否启用橡皮擦标记
  drawTouchStart: function (e) {
    //得到触摸点的坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    this.context = wx.createContext()

    if(this.isClear){ //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
        this.context.setStrokeStyle('white') //设置线条样式 此处设置为画布的背景颜色  橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果
        this.context.setLineCap('round') //设置线条端点的样式
        this.context.setLineJoin('round') //设置两线相交处的样式
        this.context.setLineWidth(20) //设置线条宽度
        this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
        this.context.beginPath() //开始一个路径
        this.context.arc(this.startX,this.startY,5,0,2*Math.PI,true);  //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形
        this.context.fill();  //对当前路径进行填充
        this.context.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
    }else{
        this.context.setStrokeStyle(this.data.pen.color)
        this.context.setLineWidth(this.data.pen.lineWidth)
        this.context.setLineCap('round') // 让线条圆润
        this.context.beginPath()

    }
  },


  //手指触摸后移动
  drawTouchMove: function (e) {

    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y

    if(this.isClear){ //判断是否启用的橡皮擦功能  ture表示清除  false表示画画

      this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
      this.context.moveTo(this.startX,this.startY);  //把路径移动到画布中的指定点，但不创建线条
      this.context.lineTo(startX1,startY1);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
      this.context.stroke();  //对当前路径进行描边
      this.context.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息

      this.startX = startX1;
      this.startY = startY1;

    }else{
      this.context.moveTo(this.startX, this.startY)
      this.context.lineTo(startX1, startY1)
      this.context.stroke()

      this.startX = startX1;
      this.startY = startY1;

    }
    //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
    wx.drawCanvas({
        canvasId: 'draw_canvas',
        reserve: true,
        actions: this.context.getActions() // 获取绘图动作数组
    })
  },

  //手指触摸动作结束
  drawTouchEnd: function () {
      
  },
  //启动橡皮擦方法
  clearCanvas: function(){
      if(this.isClear){
        this.isClear = false;
      }else{
        this.isClear = true;
      }
  },
  
  penColorSelect: function(e){ //更改画笔颜色的方法
    console.log(e.currentTarget.dataset.pen_color);
    this.data.pen.color = e.currentTarget.dataset.pen_color;
    // this.setData({color:e.currentTarget.dataset.penColor});
    this.isClear = false;
  },

  drawPictureCancel:function(e){
    console.log('cancel draw');
    this.setData({
      hide_record_sound_section : true,
      hide_take_photo_section : true,
      hide_draw_picture_section : true,
      hide_textarea: false,
    });
  },
  drawPictureConfirm:function(e){
    var that = this;
    
    wx.canvasToTempFilePath({
      canvasId: 'draw_canvas',
      success(res) {
        console.log(res.tempFilePath);
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function(res){
            // success
            console.log(res.savedFilePath);
            that.data.ask_question.draw_path = res.savedFilePath;
            wx.showModal({
              title: '图示已保存',
              content: res.savedFilePath,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
            that.setData({
              hide_record_sound_section : true,
              hide_take_photo_section : true,
              hide_draw_picture_section : true,
              hide_textarea: false,
              ask_question: that.data.ask_question,
            });
            

            that.data.ask_question.upload_draw_path = null;
            //获得上传文件在文件服务器的路径
            wx.request({
              url: config.PytheRestfulServerURL + '/file/uploadFilePrepare',
              data: {
                userFilePath: that.data.ask_question.draw_path,
                fileType: 'image',
              },
              method: 'POST', 
              success: function(res){
                // success
                console.log(res.data.data)
                var result = JSON.parse(res.data.data);
                that.data.ask_question.upload_draw_path = result.path;
                var parameters = {
                  path : that.data.ask_question.upload_draw_path,
                  fileType : 'image',
                };
                fileSys.uploadFile(that.data.ask_question.draw_path,parameters);
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            });
            
            
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      },
      fail(res) {
        console.log("draw fail:" + res);
      }, 
    });
  },


  takePhoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0]);
        wx.saveFile({
          tempFilePath: tempFilePaths[0],
          success: function(res){
            // success
            var savedFilePath = res.savedFilePath;
            that.data.ask_question.photo_path = savedFilePath;
            that.setData({
              ask_question : that.data.ask_question,
              // img_src : savedFilePath,
            })
            
            //获得上传文件在文件服务器的路径
            wx.request({
              url: config.PytheRestfulServerURL + '/file/uploadFilePrepare',
              data: {
                userFilePath: savedFilePath,
                fileType: 'image',
              },
              method: 'POST', 
              success: function(res){
                // success
                console.log(res.data.data)
                var result = JSON.parse(res.data.data);
                that.data.ask_question.upload_photo_path = result.path;
                
                var parameters = {
                  path : that.data.ask_question.upload_photo_path,
                  fileType : 'image',
                  whatFile : 'photo',
                  
                };
                //上传文件
                fileSys.uploadFile(savedFilePath,parameters);
                  },
                  fail: function() {
                    // fail
                  },
                  complete: function() {
                    // complete
                  }
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
    })
  },

  playQuestionVoiceRecord:function(e){
    wx.showToast({
      title: '播放录音',
      icon: 'success',
      duration: 1000
    });
    wx.playVoice({
      filePath: this.data.ask_question.voice_path,
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

  showPhoto:function(e){
    console.log("显示图片" );
    this.setData({
      hide_show_image_page: false,
      img_src: this.data.ask_question.photo_path,
    });
    
  },
  showDraw:function(e){
    console.log("显示手绘" );
    this.setData({
      hide_show_image_page: false,
      img_src: this.data.ask_question.draw_path,
    });
    
  },
  returnLoadImagePage:function(e){
    this.setData({
      hide_show_image_page: true,
    });
  },
  getImageSource:function(e){
    console.log(e.currentTarget.dataset.image_source);
  },

  //问老师需要选中科目
  subjectChange: function(e) {
    console.log('科目', this.data.subjects[e.detail.value])
    this.setData({
      subject_index: e.detail.value
    })

    this.data.ask_question.subjectId = this.data.subjects[e.detail.value].subjectid;
  },

  selectReward1:function(e){
    console.log("￥ 1");
    wx.setStorageSync('rewardNum', 0.01);
    
    pay.orderPay(
      (payResult)=>{
        console.log(payResult);
        if(payResult.errMsg == "requestPayment:ok")
        {
          this.data.hasPaidReward = true;
        }
      },
      (payResult)=>{
        console.log(payResult);
      },
    );
    
  },
  selectReward5:function(e){
    console.log("￥ 5");
    wx.setStorageSync('rewardNum', 5);
    
    pay.orderPay(
      (payResult)=>{
        console.log(payResult);
        if(payResult.errMsg == "requestPayment:ok")
        {
          this.data.hasPaidReward = true;
        }
      },
      (payResult)=>{
        console.log(payResult);
      },
    );

  },
  selectReward10:function(e){
    console.log("￥ 10");
    wx.setStorageSync('rewardNum', 10);
    
    pay.orderPay(
      (payResult)=>{
        console.log(payResult);
        if(payResult.errMsg == "requestPayment:ok")
        {
          this.data.hasPaidReward = true;
        }
      },
      (payResult)=>{
        console.log(payResult);
      },
    );
    
  },

  commitQuestion:function(result){
    console.log("commit question");
    //先检查是否选好悬赏金额
    //接着开始请求支付
    //示支付结果而定是否上传ask_question
    if(this.data.hasPaidReward)
    {
      this.data.ask_question.studentId = wx.getStorageSync(user.StudentID);
      this.data.ask_question.rewardNum = wx.getStorageSync('rewardNum')
      // base.commitQuestion(this.data.ask_question);

      var questionParams= {
        studentId: wx.getStorageSync(user.StudentID),
        teacherId: this.data.ask_question.ask_teacherId,
        questionContent:{
          text: [
            this.data.ask_question.text_content,
          ],
          img: [
            this.data.ask_question.upload_photo_path,
          ],
          audio:[
            this.data.ask_question.upload_voice_path,
            this.data.ask_question.voice_timeLength,
          ],
          draw:[
            this.data.ask_question.upload_draw_path,
          ],
        },
        subjectId: this.data.ask_question.subjectId,
        
        // reward: wx.getStorageSync('rewardNum'),
        reward: wx.getStorageSync("rewardNum"),
      };
      
      if(questionParams.questionContent.text[0]!=null)
      {
        base.commitQuestion(questionParams);
        this.data.hasPaidReward = false;
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
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
      }
      else
      {
        wx.showModal({
          title: '提示',
          content: '题目内容不能为空',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      }
    }
    else
    {
      wx.showModal({
        title: '提示',
        content: '请选择悬赏金额',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
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


//麦克风帧动画
function speaking() {
  var _this = this;
  //话筒帧动画
  var i = 1;
  var count = 0;
  this.timer = setInterval(function () {
    count++;
    i++;
    i = i % 5;
    _this.setData({
      loop: i,
      voice_timeLength: count/10,
      speakingTimeLength: count/10,
    })
    _this.data.ask_question.voice_timeLength = count/10;
  }, 100);
}