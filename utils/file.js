
var config = require('./config')

const FILE_UPLOAD_URL = `${config.PytheRestfulServerURL}/file/uploadFile`;//文件上传服务

const FILE_PREUPLOAD_URL = `${config.PytheRestfulServerURL}/file/uploadFilePrepare`;//文件上传服务

const FILE_DOWNLOAD_URL = `${config.PytheFileServerURL}`;//文件下载服务

const FILE_PREDOWNLOAD_URL = `${config.PytheRestfulServerURL}/file/downloadFile`;//文件下载服务启动前先移动到缓冲区

function uploadFilePrepare(filePath, fileType)
{
  wx.request({
    url: FILE_PREUPLOAD_URL,
    data: {
      userFilePath: filePath,
      fileType: fileType,
    },
    method: 'POST', 
    success: function(res){
      // success
      
      return JSON.parse(res.data.data);
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
}

function uploadFile(filePath, parameters)
{
  
    console.log('upload file ' + filePath);
    console.log(' to ' + FILE_UPLOAD_URL);
    wx.uploadFile({
      url: FILE_UPLOAD_URL,
      filePath:filePath,
      name:parameters.path,
      // header: {}, // 设置请求的 header
      formData: parameters,
      success: function(res){
        console.log(res);
        
      },
      fail: function() {
        // console.log(res);
      },
      complete: function() {
        // console.log(res);
      }
    })
}

function downloadFile(that,download_file,fileType)
{
  if(fileType == 'audio' && decodeURIComponent(download_file) == wx.getStorageSync('lastRemoteAudio') && wx.getStorageSync('playingVoice') == 'no')
  {
    wx.playVoice({
      filePath: wx.getStorageSync('tempAudio'),
      success: function(res){
        // success
        wx.setStorageSync('playingVoice', 'yes');
        wx.showToast({
          title: '继续播放',
          icon: 'success',
          duration: 1000
        });
        
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
        wx.setStorageSync('playingVoice', 'no');
      }
    })
  }
  else if(fileType == 'audio' && decodeURIComponent(download_file) == wx.getStorageSync('lastRemoteAudio') && wx.getStorageSync('playingVoice') == 'yes')
  {
    wx.pauseVoice({
      success: function(res){
        // success
        wx.setStorageSync('playingVoice', 'no');
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  }
  else if(fileType == 'image' && decodeURIComponent(download_file) == wx.getStorageSync('lastRemoteImg'))
  {
    that.setData({
      img_src: wx.getStorageSync('tempImg'),
    });
  }
  else
  {
    wx.request({
      url: FILE_PREDOWNLOAD_URL,
      data: {
        path: decodeURIComponent(download_file),
        // fileType : fileType,
      },
      method: 'GET', 
      success: function(res){
        // 成功移动到缓冲区

        wx.downloadFile({
          url: FILE_DOWNLOAD_URL + decodeURIComponent(download_file),
          type: fileType, // 下载资源的类型，用于客户端识别处理，有效值：image/audio/video
          success: function(res){
            console.log(res);

            if(fileType == 'image')
            {
              that.setData({
                img_src: res.tempFilePath,
              });
              var tempFilePath = res.tempFilePath;
              wx.saveFile({
                tempFilePath: tempFilePath,
                success: function(res){
                  // success
                  wx.setStorageSync('tempImg', res.savedFilePath);
                },
                
              });
              wx.setStorageSync('lastRemoteImg', decodeURIComponent(download_file));
            }
            if(fileType == 'audio')
            {
              var tempFilePath = res.tempFilePath;
              wx.playVoice({
                filePath: res.tempFilePath,
                success: function(res){
                  // success
                  wx.setStorageSync('playingVoice', 'yes');
                  wx.saveFile({
                    tempFilePath: tempFilePath,
                    success: function(res){
                      // success
                      wx.setStorageSync('tempAudio', res.savedFilePath);
                    },
                
                  });
                  wx.setStorageSync('lastRemoteAudio', decodeURIComponent(download_file));
                },
                fail: function() {
                  // fail
                },
                complete: function() {
                  // complete
                  wx.setStorageSync('playingVoice', 'no');
                }
              })
            }

            
            
          },
          fail: function(res) {
            console.log(res);
            wx.showModal({
              title: '提示',
              content: '下载失败',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          },
          complete: function(res) {
            console.log(res);
          }
        })

      },
      fail: function(res) {
        // fail
        console.log(res);
        // wx.showModal({
        //   title: '提示',
        //   content: '文件不存在',
        //   success: function(res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //     }
        //   }
        // });
      }
    })
  }
  
  
}

module.exports = {
    uploadFilePrepare: uploadFilePrepare,
    uploadFile: uploadFile,
    downloadFile: downloadFile,
}