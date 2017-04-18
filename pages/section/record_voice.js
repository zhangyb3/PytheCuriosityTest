// page/recorder/index.js

var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");
var user = require("../../utils/user.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

const SAVE_VOICE = "选择录音"

var playTimeInterval
var recordTimeInterval

Page({
  onReady: function(e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  data: {
    recording: false,
    playing: false,
    hasRecord: false,
    recordTime: 0,
    playTime: 0,
    formatedRecordTime: '00:00:00',
    formatedPlayTime: '00:00:00',
    saveVoice: SAVE_VOICE
  },

  
  startRecord: function() {
    this.setData({
      recording: true
    })

    var that = this
    recordTimeInterval = setInterval(function() {
      var recordTime = that.data.recordTime += 1
      that.setData({
        formatedRecordTime: utils.formatTime(that.data.recordTime),
        recordTime: recordTime
      })
    }, 1000)

    wx.startRecord({
      success: function(res) {

        // @ tempFilePath: wxfile://    本地临时录音的路径 
        // @ errMsg:  startRecord : ok  应该是返回信息
        that.setData({
          hasRecord: true,
          tempVoiceFilePath: res.tempFilePath,
          formatedPlayTime: utils.formatTime(that.data.playTime)
        })
      },
      complete: function() {
        that.setData({
          recording: false
        })
        clearInterval(recordTimeInterval)

      },
      fail: function(res) {
        wx.showToast({
          title: res.message,
          duration: 2000
        })
      }
    })
  },
  stopRecord: function() {
    wx.stopRecord()    
  },
  stopRecordUnexpectedly: function() {
    var that = this
    wx.stopRecord({
      success: function() {
        console.log('stop record success')
        clearInterval(recordTimeInterval)
        that.setData({
          recording: false,
          hasRecord: false,
          recordTime: 0,
          formatedRecordTime: utils.formatTime(0)
        })
      }
    })
  },
  playVoice: function() {
    var that = this
    playTimeInterval = setInterval(function() {
      var playTime = that.data.playTime + 1
      console.log('update playTime', playTime)
      that.setData({
        playing: true,
        formatedPlayTime: utils.formatTime(playTime),
        playTime: playTime
      })
    }, 1000)
    console.log("this.data.tempVoiceFilePath:" + this.data.tempVoiceFilePath)
    wx.playVoice({
      filePath: this.data.tempVoiceFilePath,
      success: function() {
        clearInterval(playTimeInterval)
        var playTime = 0
        
        that.setData({
          playing: false,
          formatedPlayTime: utils.formatTime(playTime),
          playTime: playTime
        })
      }
    })
  },
  pauseVoice: function() {
    clearInterval(playTimeInterval)
    wx.pauseVoice()
    this.setData({
      playing: false
    })
  },
  stopVoice: function() {
    clearInterval(playTimeInterval)
    this.setData({
      playing: false,
      formatedPlayTime: utils.formatTime(0),
      playTime: 0
    })
    wx.stopVoice()
  },
  saveVoice: function() {
      var that = this
        wx.saveFile({
          tempFilePath: this.data.tempVoiceFilePath,
          success: function(res) {
            // @ savedFilePath: wxfile://    本地临时录音的路径 
            // @ errMsg:  saveFile : ok  应该是返回信息
            wx.showModal({
              title: "保存成功",
              content: "文件路径是" + res.savedFilePath
            })
            
            that.setData({
              voiceFilePath: res.savedFilePath,
              voiceDuration: that.data.recordTime,
            })

            wx.setStorageSync('recordLocalVoicePath', that.data.voiceFilePath);
            wx.setStorageSync('recordLocalVoiceDuration', that.data.voiceDuration);
            wx.setStorageSync('hasRecordVoice', 'yes');

            console.log("that.data.voiceFilePath:"+that.data.voiceFilePath)

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
        })
  },
  clear: function() {
    clearInterval(playTimeInterval)
    wx.stopVoice()
    this.setData({
      playing: false,
      hasRecord: false,
      tempVoiceFilePath: '',
      formatedRecordTime: utils.formatTime(0),
      recordTime: 0,
      playTime: 0
    })
  }
})