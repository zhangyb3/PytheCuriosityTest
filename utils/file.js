
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
  wx.request({
    url: FILE_PREDOWNLOAD_URL,
    data: {
      path: decodeURI(download_file),
      // fileType : fileType,
    },
    method: 'GET', 
    success: function(res){
      // 成功移动到缓冲区

      wx.downloadFile({
        url: FILE_DOWNLOAD_URL + decodeURI(download_file),
        type: fileType, // 下载资源的类型，用于客户端识别处理，有效值：image/audio/video
        success: function(res){
          console.log(res);
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function(res){
              console.log(res.savedFilePath);
              if(fileType == 'image')
              {
                that.setData({
                  img_src: res.savedFilePath,
                });
              }
              if(fileType == 'audio')
              {
                wx.playVoice({
                  filePath: res.savedFilePath,
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
              }
              return res.savedFilePath;
            },
            fail: function() {
              // fail
              
            },
            complete: function() {
              // complete
            }
          });
          
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
      wx.showModal({
        title: '提示',
        content: '文件不存在',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
  })
  
}

module.exports = {
    uploadFilePrepare: uploadFilePrepare,
    uploadFile: uploadFile,
    downloadFile: downloadFile,
}