
var config = require('./config')

const FILE_UPLOAD_URL = `${config.PytheRestfulServerURL}/file/uploadFile`;//文件上传服务

const FILE_DOWNLOAD_URL = `${config.PytheFileServerURL}`;//文件下载服务

const FILE_PREDOWNLOAD_URL = `${config.PytheRestfulServerURL}/file/downloadFile`;//文件下载服务启动前先移动到缓冲区


function uploadFile(filePath, parameters)
{
    console.log('upload file ' + filePath);
    console.log(' to ' + FILE_UPLOAD_URL);
    wx.uploadFile({
      url: FILE_UPLOAD_URL,
      filePath:filePath,
      name:parameters.userFilePath,
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
      path: download_file,
      // fileType : fileType,
    },
    method: 'GET', 
    success: function(res){
      // 成功移动到缓冲区

      wx.downloadFile({
        url: FILE_DOWNLOAD_URL + '/' + fileType + '/' + download_file,
        type: fileType, // 下载资源的类型，用于客户端识别处理，有效值：image/audio/video
        success: function(res){
          console.log(res);
          that.setData({
            img_src: res.tempFilePath,
          });
          return res.tempFilePath;
        },
        fail: function(res) {
          console.log(res);
          
        },
        complete: function(res) {
          console.log(res);
        }
      })

    },
    fail: function(res) {
      // fail
      console.log(res);
    }
  })
  
}

module.exports = {
    uploadFile: uploadFile,
    downloadFile: downloadFile,
}