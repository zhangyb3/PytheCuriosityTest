// pages/ask/ask_operation.js

var config = require("../../utils/config.js");
var fileSys = require("../../utils/file.js");
var base = require("../../utils/base.js");
var pay = require("../../utils/pay.js");
var user = require("../../utils/user.js");
var config = require("../../utils/config.js");
var netUtil=require("../../utils/netUtil.js");

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

    isPlaying: false,//是否正在播放

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
        subject: '请选择科目',
      },
    ],
    subject_index:0,

    preview_img_url: config.PytheFileServerURL ,

    hide_bounty_page: true,
    hasPaidReward: false,
    rewardTap1:true,
    rewardTap5:false,
    rewardTap10:false,

    commitDisabled: false,
  },

   //手指按下
  touchdownRecord: function () {
    console.log("手指按下了...")
    console.log("new date : " + new Date)
    var _this = this;
    playing.call(this);
    this.setData({
      isPlaying: true
    })
  },

  onLoad:function(parameters){
    console.log("from ask");
    // base.cleanCacheFile(20);
  
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
    if(parameters.status == 1)
    {
      this.data.ask_question.ask_teacherId = parameters.userid;
      this.data.ask_question.not_select_subject = true;
    }
    if(parameters.subjectId != null )
    {
      this.data.ask_question.subjectId = parameters.subjectId;
      // this.data.ask_question.ask_teacherId = -1;
    }
    if(parameters.subjectid != null )
    {
      this.data.ask_question.subjectId = parameters.subjectid;
      // this.data.ask_question.ask_teacherId = -1;
    }
    
    console.log(this.data.ask_question);
    this.setData({
      ask_question: this.data.ask_question,
    });
 
    
    var that = this;

    var subjectRange = ['请选择科目'];
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
    this.data.ask_question.text_content = null;
    var text_input = e.detail.value;
    console.log(text_input);
    this.data.ask_question.text_content = text_input;
  },

  recordSound:function(e){
    // console.log("录音功能");
    // this.setData({
    //   hide_record_sound_section : false,
    //   hide_textarea: true,
    // });
    wx.navigateTo({
      url: '../section/record_voice',
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
        wx.stopRecord();
        _this.setData({
          isSpeaking: false,
        })
        clearInterval(_this.timer)

        wx.getSavedFileList({
          success: function(res) {
            var filePathLength = res.fileList[0].filePath.length;
            if (res.fileList.length > 0 && res.fileList[0].filePath[filePathLength-1]=='k'){
              wx.removeSavedFile({
                filePath: res.fileList[0].filePath,
                complete: function(res) {
                  console.log(res)
                }
              })
            }
          }
        });

        wx.showModal({
          title: '提示',
          content: '录音错误!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              return
            }
          }
        });
       
      }
    })
    setTimeout(function() {
      //超时结束录音  
      wx.stopRecord()
      _this.setData({
        isSpeaking: false,
      })
      clearInterval(_this.timer)
    }, 60000);
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
  // //轻触结束录音并清理文件
  // cleanRecordVoice:function(res){
  //   wx.stopRecord();
  //   this.setData({
  //     isSpeaking: false,
  //   })
  //   clearInterval(this.timer)

  //   wx.getSavedFileList({
  //     success: function(res) {
  //       var filePathLength = res.fileList[0].filePath.length;
  //       if (res.fileList.length > 0 && res.fileList[0].filePath[filePathLength-1]=='k'){
  //         wx.removeSavedFile({
  //           filePath: res.fileList[0].filePath,
  //           complete: function(res) {
  //             console.log(res)
  //           }
  //         })
  //       }
  //     }
  //   });
  // },

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
        this.setData({
      isPlaying: false
    })
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
        fileSys.uploadFile(that.data.ask_question.voice_path,parameters,that);
        
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
  //启动清空方法
  truncateCanvas: function(){
    const ctx = wx.createCanvasContext('draw_canvas');
    
    ctx.clearRect(0, 0, 375, 750);
    ctx.draw();
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
            wx.setStorageSync('recordLocalDraw',res.savedFilePath);
            wx.setStorageSync('hasDrawnPicture', 'yes');
            // wx.showModal({
            //   title: '图示已保存',
            //   content: res.savedFilePath,
            //   success: function(res) {
            //     if (res.confirm) {
            //       console.log('用户点击确定')
            //     }
            //   }
            // });
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
                fileSys.uploadFile(that.data.ask_question.draw_path,parameters,that);
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
      sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
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
            wx.setStorageSync('recordLocalPhoto',savedFilePath);
            wx.setStorageSync('hasTakenPhoto', 'yes');
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
                fileSys.uploadFile(savedFilePath,parameters,that);
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
    var that = this;
    
    wx.showToast({
      title: '播放录音',
      icon: 'success',
      duration: 1000
    });
    that.setData({
      isPlaying: true
    })
    wx.playVoice({
      filePath: this.data.ask_question.voice_path,
      success: function(res){
        console.log("播放啦啦啦啦啦啦啦啦啦" );
        // success
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
        
      }  
    });
    setTimeout(function() {
      //超时结束播放特效  
      
      that.setData({
        isPlaying: false,
      })
      
      }, (that.data.ask_question.voice_timeLength-1)*1000);
  },

  showPhoto:function(e){
    console.log("显示图片" );
    

    console.log("显示图片" + this.data.ask_question.photo_path);
    
    var parametersJSON = {
      image_source : this.data.ask_question.photo_path,
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
  showDraw:function(e){
    console.log("显示手绘" );


    console.log("显示图片" + this.data.ask_question.draw_path);
    
    var parametersJSON = {
      image_source : this.data.ask_question.draw_path,
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
  returnLoadImagePage:function(e){
    this.setData({
      hide_textarea:false,
      hide_show_image_page: true,
      img_src:null,
    });
  },
  getImageSource:function(e){
    console.log(e.currentTarget.dataset.image_source);
  },

  

  selectReward1:function(e){
    console.log("￥ 1");
    this.setData({
      rewardTap1: true,
      rewardTap5: false,
      rewardTap10: false
    })
    wx.setStorageSync('rewardNum', 0.01);
    
    
    
  },
  selectReward5:function(e){
    this.setData({
      rewardTap1: false,
      rewardTap5: true,
      rewardTap10: false
    })

    console.log("￥ 5");
    wx.setStorageSync('rewardNum', 5);
    
    

  },
  selectReward10:function(e){
    this.setData({
      rewardTap1: false,
      rewardTap5: false,
      rewardTap10: true
    })
    console.log("￥ 10");
    wx.setStorageSync('rewardNum', 10);
    
    
    
  },

  commitConfirm:function(result){
    console.log('before commit question');
    wx.setStorageSync("rewardNum", 0.01);
    if(this.data.ask_question.text_content == '' || this.data.ask_question.text_content == null)
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
    // else if(this.data.ask_question.subjectId == null)
    // {
    //   wx.showModal({
    //     title: '提示',
    //     content: '题目科目不能为空',
    //     success: function(res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       }
    //     }
    //   });
    // }
    else
    {
      this.setData({
        hide_bounty_page: false,
        hide_textarea: true,
        commmitDisabled: true,
      });
    }

    


  },
  cancelBounty:function(e){
    this.setData({
      hide_bounty_page: true,
      hide_textarea: false,
      commitDisabled: false,
    });
  },
  confirmBounty:function(e){
    //防止多次提交
    this.setData({commitDisabled: true});
    var that = this;
      pay.orderPay(
        (payResult) => {
          console.log(payResult);
          if (payResult.errMsg == "requestPayment:ok") {
            that.data.hasPaidReward = true;
            commitQuestion(that);
            that.setData({
              hide_bounty_page: true,
              hide_textarea: false,

            });
          }
        },
        (payResult) => {
          console.log(payResult);
          that.setData({
            hide_bounty_page: true,
            hide_textarea: false,
            commitDisabled: false
          });
        },
      );
   
  },
  

  onShow:function(){
    // 页面显示
    if(wx.getStorageSync('hasRecordVoice') == 'yes')
    {
      this.data.ask_question.voice_path = wx.getStorageSync('recordLocalVoicePath');
      this.data.ask_question.voice_timeLength = wx.getStorageSync('recordLocalVoiceDuration');

      if(wx.getStorageSync('hasTakenPhoto') == 'yes')
      {
        this.data.ask_question.photo_path = wx.getStorageSync('recordLocalPhoto');
      }
      if(wx.getStorageSync('hasDrawnPicture') == 'yes')
      {
        this.data.ask_question.draw_path = wx.getStorageSync('recordLocalDraw');
      }
      
      this.setData({
        ask_question: this.data.ask_question,
        hide_voice_bubble: false,
      });
      console.log(this.data.ask_question.voice_path);
      wx.setStorageSync('hasRecordVoice', 'no');

      var that = this;
      wx.request({
        url: config.PytheRestfulServerURL + '/file/uploadFilePrepare',
        data: {
          userFilePath: this.data.ask_question.voice_path,
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
          fileSys.uploadFile(that.data.ask_question.voice_path,parameters,that);
          
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
  count = 0;
}

//上传问题
function commitQuestion(the) {
  var that = the;
  console.log("commit question");
    //先检查是否选好悬赏金额
    //接着开始请求支付
    //示支付结果而定是否上传ask_question
    if(that.data.hasPaidReward)
    {
      that.data.ask_question.studentId = wx.getStorageSync(user.StudentID);
      that.data.ask_question.rewardNum = wx.getStorageSync('rewardNum')
      // base.commitQuestion(this.data.ask_question);

      var questionParams= {
        studentId: wx.getStorageSync(user.StudentID),
        teacherId: that.data.ask_question.ask_teacherId,
        questionContent:{
          text: [
            that.data.ask_question.text_content,
          ],
          img: [
            that.data.ask_question.upload_photo_path,
          ],
          audio:[
            that.data.ask_question.upload_voice_path,
            that.data.ask_question.voice_timeLength,
          ],
          draw:[
            that.data.ask_question.upload_draw_path,
          ],
        },
        subjectId: that.data.ask_question.subjectId,
        
        // reward: wx.getStorageSync('rewardNum'),
        reward: wx.getStorageSync("rewardNum"),
      };
      
     
        base.commitQuestion(questionParams);
        // pay.recordQuestionPay(questionParams);

        wx.setStorageSync('hasTakenPhoto', 'no');
        wx.setStorageSync('hasDrawnPicture', 'no');
        that.data.hasPaidReward = false;
        wx.navigateTo({
          url: '../../pages/answer/answer',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      
    }
    
}
