// pages/answer/answer_operation.js

var context;
var config = require("../../utils/config.js");
var fileSys = require("../../utils/file.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");
var utils = require("../../utils/util.js");
var netUtil=require("../../utils/netUtil.js");
var wxTimer = require("../../utils/wxTimer.js");

Page({
  
  operation_type: 'answer operation',
  data:{
    hide_show_image_page: true,
    hide_record_sound_section : true,
    hide_take_photo_section : true,
    hide_draw_picture_section : true,
    hide_voice_bubble: true,
    hide_textarea : false,
    hide_knowledge_list: true,
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
    answer_question:
    {
      question_content: null,
    },
    question_answer:{
      voice_path: null,
      voice_timeLength: 0,
      draw_path:null,
      photo_path:null,
      knowledge_level1:'',
      knowledge_level2:'选择知识点',
      knowledgeId:-1,
    },

    knowledge1s: [
      // {
      //   knowledgeId: null,
      //   level1: '请选择',
      // },       
    ],
    knowledge1_index:0,

    knowledge2s: [
      // {
      //   knowledgeId: null,
      //   level2: '请选择',
      // },       
    ],
    knowledge2_index:0,

    

    preview_img_url: config.PytheFileServerURL ,
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
    console.log("from answer");
    // base.cleanCacheFile(20);
 
  
    this.setData({
      hide_record_sound_section : true,
      hide_take_photo_section : true,
      hide_draw_picture_section : true,
      hide_voice_bubble: true,
      hide_textarea : false,
      hide_knowledge_list: true,
    });
    
    console.log(parameters);
    this.data.question_answer.studentId = parameters.studentid;
    this.data.question_answer.questionId = parameters.questionid;
    this.data.question_answer.teacherId = wx.getStorageSync(user.TeacherID);

    var answer_question = parameters; 
    answer_question.text_content = decodeURIComponent(answer_question.text_content);
    answer_question.photo_path = decodeURIComponent(answer_question.photo_path);
    answer_question.draw_path = decodeURIComponent(answer_question.draw_path);
    this.data.question_answer.questionId = answer_question.questionid;
    this.setData({
      answer_question : answer_question,
      question_answer : this.data.question_answer,
    });


    

  },

  getAnswerText:function(e){
    var text_input = e.detail.value;
    console.log(text_input);
    this.data.question_answer.text_content = text_input;
  },

  recordSound:function(e){
    // console.log("录音功能");
    // this.setData({
    //   hide_record_sound_section : false,
    //   hide_textarea : true,
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
            // for (var i = res.fileList.length-1; i >= 0 ; i--) {
            //   //格式化时间
            //   var createTime = new Date(res.fileList[i].createTime)
            //   //将音频大小B转为KB
            //   var size = (res.fileList[i].size / 1024).toFixed(2);
            //   var voice = { filePath: res.fileList[i].filePath, createTime: createTime, size: size , timeLength: _this.data.speakingTimeLength };
            //   console.log("文件路径: " + res.fileList[i].filePath)
            //   console.log("文件时间: " + createTime)
            //   console.log("文件大小: " + size)
            //   voices = voices.concat(voice);
            // }

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

    var that = this;
    that.setData({
      isPlaying: true
    })

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
      hide_textarea : false,
    });
    var voicePath = e.currentTarget.dataset.key;
    this.data.question_answer.voice_path = voicePath;
    this.setData({
      question_answer: this.data.question_answer,
      hide_voice_bubble: false,
    });
    console.log(this.data.question_answer);
    
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
        that.data.question_answer.upload_voice_path = result.path;

        //上传录音
        var parameters = {
          path : that.data.question_answer.upload_voice_path,
          fileType : 'audio',
        };
        fileSys.uploadFile(that.data.question_answer.voice_path,parameters);
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
      hide_textarea : true,
    });
  },

  // drawTouchStart:function(e){
  //   console.log("动笔");
  //   context.setStrokeStyle(this.data.pen.color);
  //   context.setLineWidth(this.data.pen.lineWidth);
  //   context.moveTo(e.touches[0].x, e.touches[0].y);
  // },

  // drawTouchMove:function(e){
  //   console.log("移笔");
  //   context.lineTo(e.touches[0].x, e.touches[0].y);
  // },

  // drawTouchEnd:function(e){
  //   console.log("停笔");
  //   context.stroke();
  //   wx.drawCanvas({
  //     canvasId: 'draw_anvas',
  //     actions: context.getActions(), // 获取绘图动作数组
  //   })
  // },

  // drawPictureConfirm:function(e){
    
  // },


  returnOperationPage:function(e){
    
    this.setData({
      hide_record_sound_section : true,
      hide_take_photo_section : true,
      hide_draw_picture_section : true,
      hide_textarea : false,
      hide_knowledge_list: true,
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
            that.data.question_answer.draw_path = res.savedFilePath;
            wx.setStorageSync('recordLocalDraw',res.savedFilePath);
            wx.setStorageSync('hasDrawnPicture', 'yes');
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
              question_answer: that.data.question_answer,
            });
            

            that.data.question_answer.upload_draw_path = null;
            //获得上传文件在文件服务器的路径
            wx.request({
              url: config.PytheRestfulServerURL + '/file/uploadFilePrepare',
              data: {
                userFilePath: that.data.question_answer.draw_path,
                fileType: 'image',
              },
              method: 'POST', 
              success: function(res){
                // success
                console.log(res.data.data)
                var result = JSON.parse(res.data.data);
                that.data.question_answer.upload_draw_path = result.path;

                var parameters = {
                  path : that.data.question_answer.upload_draw_path,
                  fileType : 'image',
                };
                fileSys.uploadFile(that.data.question_answer.draw_path,parameters);
                
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
    var that = this
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
            that.data.question_answer.photo_path = savedFilePath;
            wx.setStorageSync('recordLocalPhoto',savedFilePath);
            wx.setStorageSync('hasTakenPhoto', 'yes');
            that.setData({
              question_answer : that.data.question_answer,
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
                that.data.question_answer.upload_photo_path = result.path;
                var parameters = {
                  path : that.data.question_answer.upload_photo_path = result.path,
                  fileType : 'image',
                  whatFile : 'photo',

                };
                //上传文件
                fileSys.uploadFile(that.data.question_answer.photo_path,parameters);
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
      title: '下载录音',
      icon: 'success',
      duration: 1000
    });
    
    
    var questionVoiceRemotePath = e.currentTarget.dataset.question_voice;
    
    fileSys.downloadFile(that,decodeURI(questionVoiceRemotePath),'audio');
    
   
    
  },

  playAnswerVoiceRecord:function(e){
    
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
      filePath: this.data.question_answer.voice_path,
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
      
      }, (that.data.question_answer.voice_timeLength-1)*1000);
  },

  showQuestionPhoto:function(e){
    var question_photo = decodeURIComponent(e.currentTarget.dataset.question_photo);
    console.log("显示图片" + question_photo);
    // var questionPhotoPath = fileSys.downloadFile(this,question_photo,'image');
    // this.data.answer_question.photo_path = questionPhotoPath;
    // this.setData({
    //   hide_textarea: true,
    //   hide_show_image_page: false,
    //   img_src: questionPhotoPath,
    // });
    fileSys.downloadFile(this,question_photo,'image',
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
  showQuestionDraw:function(e){
    var question_draw = decodeURIComponent(e.currentTarget.dataset.question_draw);
    console.log("显示手绘" + question_draw);
    // var questionDrawPath = fileSys.downloadFile(this,question_draw,'image');
    // this.data.answer_question.draw_path = questionDrawPath;
    // this.setData({
    //   hide_textarea: true,
    //   hide_show_image_page: false,
    //   img_src: questionDrawPath,
    // });
    fileSys.downloadFile(this,question_draw,'image',
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

  showAnswerPhoto:function(e){
    console.log("显示图片" );
    this.data.question_answer.photo_path = e.currentTarget.dataset.answer_photo;
    this.setData({
      hide_textarea: true,
      hide_show_image_page: false,
      img_src: this.data.question_answer.photo_path,
    });

  },
  showAnswerDraw:function(e){
    console.log("显示手绘" );
    this.data.question_answer.draw_path = e.currentTarget.dataset.answer_draw;
    this.setData({
      hide_show_image_page: false,
      img_src: this.data.question_answer.draw_path,
    });
  },
  returnLoadImagePage:function(e){
    this.setData({
      hide_show_image_page: true,
      img_src:null,
      hide_textarea : false,
    });
  },
  getImageSource:function(e){
    console.log(e.currentTarget.dataset.image_source);
  },


  selectKnowledge:function(e){
    console.log("选择知识点");
    this.setData({
      hide_textarea : true,
      hide_knowledge_list: false,  
      // knowledge1s: this.data.knwoledge1s,    
    });
  },
  
  //选择一级知识点
  knowledge1Change: function(e) {
    
    // console.log('一级知识点', this.data.knowledge1s[e.detail.value])
    console.log('一级知识点', this.data.knowledge1s[e.currentTarget.dataset.index])
    this.setData({
      // knowledge1_index: e.detail.value,
      knowledge1_index: e.currentTarget.dataset.index,
    })

    // this.data.question_answer.knowledge_level1 = this.data.knowledge1s[e.detail.value].level1;
    this.data.question_answer.knowledge_level1 = this.data.knowledge1s[e.currentTarget.dataset.index].level1;

    //选中后加载二级知识点
    var that = this;
    var knowledge2Range = [];
    that.setData({
      knowledge2Range: knowledge2Range,
    });
    
    //加载动态课程列表,年级列表
    wx.request({
      url: config.PytheRestfulServerURL + '/answer/knowledgeList/two',
      data: {
        level1: that.data.question_answer.knowledge_level1
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res.data);
        
        for(var count = 0; count < res.data.data.length; count++)
        {
          
          knowledge2Range[count] = res.data.data[count].level2;
          that.data.knowledge2s[count] = res.data.data[count];
          console.log(knowledge2Range);
        }
        
        that.setData({
          knowledge2Range: knowledge2Range,
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

  //选择二级知识点
  knowledge2Change: function(e) {
    // console.log('二级知识点', this.data.knowledge2s[e.detail.value])
    console.log('二级知识点', this.data.knowledge2s[e.currentTarget.dataset.index])
    this.setData({
      // knowledge2_index: e.detail.value,
      knowledge2_index: e.currentTarget.dataset.index,
    })

    // this.data.question_answer.knowledge_level2 = this.data.knowledge2s[e.detail.value].level2;
    this.data.question_answer.knowledge_level2 = this.data.knowledge2s[e.currentTarget.dataset.index].level2;
    this.data.question_answer.knowledgeId = this.data.knowledge2s[e.currentTarget.dataset.index].knowledgeid;
    this.setData({
      hide_textarea: false,
      hide_knowledge_list: true,
      knowledge_point: this.data.question_answer.knowledge_level2
    });
  },


  commitAnswer:function(result){
    console.log("commit answer");
    //上传quesition_answer
    this.data.question_answer.questionId = this.data.answer_question.question_id;
    this.data.question_answer.studentId = this.data.answer_question.student_id;
    this.data.question_answer.teacherId = wx.getStorageSync(user.TeacherID);
    var answerParams = {
      questionId: this.data.question_answer.questionId,
      teacherId: this.data.question_answer.teacherId,
      studentId: this.data.question_answer.studentId,
      knowledgeId: this.data.question_answer.knowledgeId,
      answerContent:{
          text: [
            this.data.question_answer.text_content,
          ],
          img: [
            this.data.question_answer.upload_photo_path,
          ],
          audio:[
            this.data.question_answer.upload_voice_path,
            this.data.question_answer.voice_timeLength,
          ],
          draw:[
            this.data.question_answer.upload_draw_path,
          ],
        },
    };

    if(answerParams.answerContent.text[0]!=null && answerParams.knowledgeId!=null)
    {
      base.commitAnswer(answerParams);
      wx.setStorageSync('hasTakenPhoto', 'no');
      wx.setStorageSync('hasDrawnPicture', 'no');
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
        content: '答案内容和知识点不能为空',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }

  },

  onReady:function(){

    var that = this;
    var knowledge1Range = [];
    var knowledge2Range = [];
    that.setData({
      subject_id: that.data.answer_question.subject_id,
      knowledge1Range: knowledge1Range,
      knowledge2Range: knowledge2Range,
    });

    //加载知识点列表
    wx.request({
      url: config.PytheRestfulServerURL + '/answer/knowledgeList/one',
      data: {
        subjectId: this.data.answer_question.subject_id,
        studentId: this.data.answer_question.student_id,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res.data);
        
        for(var count = 0; count < res.data.data.length; count++)
        {
          
          knowledge1Range[count] = res.data.data[count].level1;
          that.data.knowledge1s[count] = res.data.data[count];
          console.log(knowledge1Range);
        }
        
        that.setData({
          knowledge1Range: knowledge1Range,
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

  onShow:function(){
    // 页面显示
    if(wx.getStorageSync('hasRecordVoice') == 'yes')
    {
      this.data.question_answer.voice_path = wx.getStorageSync('recordLocalVoicePath');
      this.data.question_answer.voice_timeLength = wx.getStorageSync('recordLocalVoiceDuration');

      if(wx.getStorageSync('hasTakenPhoto') == 'yes')
      {
        this.data.question_answer.photo_path = wx.getStorageSync('recordLocalPhoto');
      }
      if(wx.getStorageSync('hasDrawnPicture') == 'yes')
      {
        this.data.question_answer.draw_path = wx.getStorageSync('recordLocalDraw');
      }

      this.setData({
        question_answer: this.data.question_answer,
        hide_voice_bubble: false,
      });
      console.log(this.data.question_answer.voice_path);
      wx.setStorageSync('hasRecordVoice', 'no');

      var that = this;
      wx.request({
        url: config.PytheRestfulServerURL + '/file/uploadFilePrepare',
        data: {
          userFilePath: this.data.question_answer.voice_path,
          fileType: 'audio',
        },
        method: 'POST', 
        success: function(res){
          // success
          console.log(res.data.data)
          var result = JSON.parse(res.data.data);
          that.data.question_answer.upload_voice_path = result.path;

          //上传录音
          var parameters = {
            path : that.data.question_answer.upload_voice_path,
            fileType : 'audio',
          };
          fileSys.uploadFile(that.data.question_answer.voice_path,parameters);
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
    _this.data.question_answer.voice_timeLength = count/10;
  }, 100);
  count = 0;
}