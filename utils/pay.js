var config = require('./config')
var user = require('./user')

const ORDER_URL = `${config.PytheRestfulServerURL}/user/pay/information`;//下单

const ENCHASHMENT_URL = `${config.PytheRestfulServerURL}/user/pay/transfer`;

/**
 * 下单
 */
var requestOrder = (success, fail) => {
    var sessionID = wx.getStorageSync(user.SessionID);
    var openID = wx.getStorageSync(user.OpenID);
    wx.request({
      url: ORDER_URL,
      data: {

          session_id : sessionID, 
          mch_id : config.MerchantID,
          body : "pythe_test",
          total_fee : wx.getStorageSync('rewardNum')*100,
          notify_url : "https://www.haowen.mobi/",
          trade_type : "JSAPI",
          openId : openID

      },
      method: 'POST',
      success: function(res){
          console.log("order result : " + res.data.msg);
          typeof success == "function" && success(res.data);
      },
      fail: function(res) {
          typeof fail == "function" && fail(res.data);
      },
      complete: function() {
        // complete
      }
    })
}

/**
 * 付款
 */
var orderPay = (success, fail) => {
    requestOrder((prepay_result) => {
        console.log("预支付结果" + prepay_result.data);
        var prepay_result_data = JSON.parse(prepay_result.data);
        wx.requestPayment({
          timeStamp: prepay_result_data.timeStamp,
          nonceStr: prepay_result_data.nonceStr,
          package: 'prepay_id=' + prepay_result_data.prepay_id,
          signType: 'MD5',
          paySign: prepay_result_data.paySign,
          success: function(res){
              console.log(res);       
              wx.setStorageSync('last_pay_id', prepay_result_data.prepay_id);  
              wx.setStorageSync('last_out_trade_no', prepay_result_data.out_trade_no);     

              
              typeof success == "function" && success(res);
          },
          fail: function(res) {
              console.log(res);
              typeof fail == "function" && fail(res);
          },
        })
        
    }, 
    () => {
        console.log("下单出错");
    });
}

/**
 * 取现
 */
var enchashment = (success, fail) => {
    var sessionID = wx.getStorageSync(user.SessionID);
    var openID = wx.getStorageSync(user.OpenID);
    wx.request({
      url: ENCHASHMENT_URL,
      data: {

          session_id : sessionID, 
          
          openid : openID,
          amount : 10,
          re_user_name : 'ye',
          desc : 'enchasement_test',

      },
      method: 'POST',
      success: function(res){
          console.log("enchashment result : " + res.data.msg);
          typeof success == "function" && success(res.data);
      },
      fail: function() {
          typeof fail == "function" && fail(res.data);
      },
      complete: function() {
        // complete
      }
    })
}


function recordQuestionPay(parameters)
{
    wx.request({
      url: config.PytheRestfulServerURL + '/record/askQuestion',
      data: {
        studentId: parameters.studentId,
        teacherId: parameters.teacherId,
        questionId: wx.getStorageSync('last_commit_question_id'),
        money: wx.getStorageSync('rewardNum'),
        payId: wx.getStorageSync('last_pay_id'),
        outTradeNo: wx.getStorageSync('last_out_trade_no'),
      },
      method: 'POST', 
      success: function(res){
        // success
        console.log('record : ' + res);
        wx.request({
            url: config.PytheRestfulServerURL + '/ask/push/information',
            data: {
                prepay_id: wx.getStorageSync('last_pay_id'),
            },
            method: 'GET', 
            success: function(res){
                // success
            },
            fail: function(res) {
                // fail
            },
            complete: function(res) {
                // complete
                console.log(res);
            }
        });
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
        console.log('record : ' + res);

      }
    })
}

module.exports = {
    requestOrder : requestOrder,
    orderPay : orderPay,
    enchashment: enchashment,
    recordQuestionPay: recordQuestionPay,
}
