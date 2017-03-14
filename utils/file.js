
var config = require('./config')

const FILE_UPLOAD_URL = `${config.PytheRestfulServerURL}/file/uploadFile`;//文件上传服务

const FILE_DOWNLOAD_URL = `${config.PytheRestfulServerURL}/file/downloadFile`;//文件上传服务


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

module.exports = {
    uploadFile: uploadFile,
}