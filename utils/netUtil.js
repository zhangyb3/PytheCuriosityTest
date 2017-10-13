var timer = require("../utils/wxTimer.js");

var util = require("./util.js");

function Actions(){

};
const request_firstIn = 1;
const request_refresh = 2;
const request_loadmore = 3;
const request_none = 0;

Actions.request_firstIn = 1;
Actions.request_refresh = 2;
Actions.request_loadmore = 3;
Actions.request_none = 0;

const code_unlogin = 5;
const code_unfound = 2;

var defaultPageSize = null;


function requestConfig(){
    this.page;  //页面对象
    
    this.urlDetail='';

    this.params={
        pageIndex:1,
        pageSize:10,
        // session_id:getApp().globalData.session_id
    };
    this.netMethod='';
    this.callback={
        onPre: function(){

        },
        onEnd: function(){

        },
        onSuccess:function (data){

        },
        onEmpty : function(){

        },
        onError : function(msgCanShow,code,hiddenMsg){

        },
        onUnlogin: function(){
            this.onError("您还没有登录或登录已过期,请登录",5,'')
        },
        onUnFound: function(){
            this.onError("您要的内容没有找到",2,'')
        }
    };

    

    this.send = function(){
        request(this);
    }
}



function isOptStrNull(str){
    if(str == undefined || str == null || str == '' || str == 'null'||str == '[]'||str == '{}'){
        return true
    }else{
        return false;
    }
}

function objToStr(appendixStr, obj){
    var str = "" ;
    for ( var p in obj ){ // 方法
        if ( typeof ( obj [ p ]) == "function" ){
            // obj [ p ]() ; //调用方法

        } else if (obj [ p ]!= undefined && obj [ p ]!= null){ // p 为属性名称，obj[p]为对应属性的值
            str += p + "=" + obj [ p ] + appendixStr ;
        }
    }
    return str;
}


/*

 onPreFirstIn: function(){},
 onPreRefresh: function(){},
 onPreLoadMore: function(){},

 onEnd: function(){
    hideLoadingDialog(page);
 },


 getRealDataFromNetData:function(netData){
    return netData;
 },
 washItem:function(item){
 },


 onSuccessFirstIn:function (data){

 },
 onSuccessRefresh:function (data){

 },
 onSuccessLoadMore:function (data,hasMore){

 },

 onEmptyFirstIn : function(){
 },
 onEmptyRefresh : function(){
 },
 onEmptyLoadMore : function(){
 },


 onErrorFirstIn : function(msgCanShow,code,hiddenMsg){
 },
 onErrorRefresh : function(msgCanShow,code,hiddenMsg){
 },
 onErrorLoadMore : function(msgCanShow,code,hiddenMsg){
 }





/**
 * 注意,此方法调用后还要调用.send()才是发送出去.
 * @param page
 * @param urlDetail
 * @param params
 * @param callback  拷贝上方注释区的代码使用
 * @returns {requestConfig}
 */
function buildRequest(page,urlDetail,params,callback){
    var config = new requestConfig();
    config.page = page;
    config.urlDetail = urlDetail;


    
    if (params.pageIndex == undefined || params.pageIndex <=0 || params.pageSize == 0){
        params.pageSize=0
    }else {
        if (params.pageSize == undefined){
            params.pageSize = getApp().globalData.defaultPageSize;
        }
    }

    config.params = params;



    //config.callback = callback;

    if(isFunction(callback.onPre)){
        config.callback.onPre=callback.onPre;
    }

    if(isFunction(callback.onEnd)){
        config.callback.onEnd=callback.onEnd;
    }

    if(isFunction(callback.onEmpty)){
        config.callback.onEmpty=callback.onEmpty;
    }

    if(isFunction(callback.onSuccess)){
        config.callback.onSuccess=callback.onSuccess;
    }

    if(isFunction(callback.onError)){
        config.callback.onError=callback.onError;
    }

    if(isFunction(callback.onUnlogin)){
        config.callback.onUnlogin=callback.onUnlogin;
    }
    if(isFunction(callback.onUnFound)){
        config.callback.onUnFound=callback.onUnFound;
    }
    return config;
}

function log(msg){
    var isDebug = getApp().globalData.isDebug;
    if (isDebug){
        console.log(msg);
    }
}

function isFunction(value){
    if( typeof ( value) == "function" ){
        return true;
    }else {
        return false;
    }
}


function json2Form(json) {
    var str = [];
    for(var p in json){
        if(p == 'questioncontent')
        {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(json[p])));
        }
        else 
        if(json[p] != null)
        {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
        }
        
    }
    return str.join("&");
}


// 封装网络请求通用的处理: 参数拼接和结果处理

/**
 * @deprecated 已过期,请使用buildRequest().send()来发送请求
 * @param requestConfig
 */
function request(requestConfig){

    //检验公有参数并处理

    
    if (requestConfig.params.pageIndex ==0 || requestConfig.params.pageSize == 0){
       delete requestConfig.params.pageIndex ;
        delete  requestConfig.params.pageSize;
    }


    

    if( isFunction(requestConfig.callback.onPre) ){
        requestConfig.callback.onPre();//请求发出前
    }

    console.log(requestConfig.params);
    console.log(requestConfig.netMethod);

    //根据请求方法来拼接url:

    var wholeUrl = requestConfig.urlDetail;
    if (wholeUrl.indexOf("http://") <0||wholeUrl.indexOf("https://") <0){
        wholeUrl =  requestConfig.basic_url+requestConfig.urlDetail;
    }

    var contentType ='';
    var body = undefined;
    var paramStr = objToStr("&", requestConfig.params);//拼接请求参数成一个String
    if (requestConfig.netMethod =='GET'){
        wholeUrl = wholeUrl+"?"+paramStr;
        contentType = 'application/json';
    }else if (requestConfig.netMethod =='POST'){
        body = paramStr;//keyvalue形式
        // body = json2Form(requestConfig.params);//这时传给服务器的是jsonObject,不符合本项目中的要求
        body = JSON.stringify(requestConfig.params);
        console.log("requestBody jsonString : " + body);
        contentType = 'application/json';
        // contentType = "application/x-www-form-urlencoded";
    }



    wx.request({
        url: wholeUrl,
        method:requestConfig.netMethod,
        header:{
            "content-type":contentType//content-type改成小写,不要大写
        },
        data:body,
        success: function(res) {
            console.log(res);
            if( isFunction(requestConfig.callback.onEnd) ){
                requestConfig.callback.onEnd();//请求发出前
            }
            if(res.statusCode = 200){
                var responseData = res.data;


                var code = responseData.code;
                var msg = responseData.message;

                console.log("response : " + JSON.stringify(responseData));
                var data = responseData;
                requestConfig.callback.onSuccess(data);

            }
        },
        fail:function(res){
            console.log("fail",res);
            if( isFunction(requestConfig.callback.onEnd) ){
                requestConfig.callback.onEnd();//请求发出前
            }
            requestConfig.callback.onError("网络请求异常！",res.statusCode,'');

        },
        complete:function(res){
            stopPullRefresh(requestConfig.page);
           // requestConfig.callback.onEnd();
           wx.setStorageSync('end_load', 'yes');
            // that.setData({hidden:true,toast:true});
           requestConfig.page.data.requestingResultList = false;
        }
    })
}


/**
 * 给纯listview,单一item封装的网络请求
 * @param that
 * @param pageIndex
 * @param action
 */
function requestSimpleList(that,list_type,pageIndex,action,requestMethod){
    var config = new requestConfig();
    config.page = that;
    config.basic_url = that.data.basic_url;
    config.urlDetail= that.data.urlDetail;
    config.netMethod = that.data.requestMethod;
    config.params.pageIndex = pageIndex;
    console.log(pageIndex);
    config.params = that.setNetparams;
    config.params.pageNum = pageIndex;
    that.data.currentAction = action;
    config.callback.onPre = function(){

        if(action == request_firstIn  ){
            showLoadingDialog(that);
        }else if (action == request_loadmore){
            loadMoreStart(that);
        }
    };

    config.callback.onSuccess=function(data){
        that.data.currentAction = request_none;

        console.log("load list success-----------");

        var currentDatas = that.getListFromNetData(data);//todo 列表数据如果是返回结果的其中一个字段,需要取出.
        console.log(currentDatas);
        if (currentDatas.length==0){
            config.callback.onEmpty();
            return;
        }
        that.hasSuccessed = true;
        showContent(that);

        if(action == request_firstIn ){

        }else if (action == request_refresh){
           // showSuccessToast(that,"数据刷新成功");

        }
        //that.handleDataAndRefreshUI(data);
        //处理数据
        that.data.currentPageIndex = pageIndex;



        var concatDatas = [];
        for(var count = 0; count < currentDatas.length; count++)
        {
            // console.log(currentDatas[count]);
            var temp = currentDatas[count];
            if(temp.questioncontent != null)
            {
                temp.questioncontent = JSON.parse(currentDatas[count].questioncontent);
            }
            if(temp.answercontent != null)
            {
                temp.answercontent = JSON.parse(currentDatas[count].answercontent);
            }
            if(temp.starttime != null)
            {
                temp.starttime = util.formatDate(temp.starttime);
            }
            if(temp.answertime != null)
            {
                temp.answertime = util.formatDate(temp.answertime);
            }
            if(list_type == 'teacher')
            {
                var isClick = temp.isClick;
                temp = JSON.parse(temp.question);
                temp.isClick = isClick;
            }
            if(list_type == 'my_question_answer')
            {
                
                var isClick = temp.isClick;
                temp = JSON.parse(temp.question);
                temp.isClick = isClick;
                temp.selected = false;
                temp.blacklistId = -1;
            }
            if(list_type == 'question')
            {
                
                temp.question = JSON.parse(currentDatas[count].question);
                temp.question.questioncontent = JSON.parse(temp.question.questioncontent);
                // var wxTimerNew = new timer({
                //     beginTime: temp.timer,
                //     name:'wxTimer-question-'+temp.question.questionid,
                //     complete:function(){
                //         console.log("完成")
                //     }
                // });
                // wxTimerNew.start(that);
                // temp.wxTimerName = 'wxTimer-question-'+temp.question.questionid;
                // temp.countdown = wxTimerNew; 
                
            }
            if(list_type == 'my_answered')
            {
                
                temp = (currentDatas[count]);
                // temp.questioncontent = JSON.parse(temp.questioncontent);
                // temp.answercontent = JSON.parse(temp.answercontent);
            }
            if(list_type == 'my_unanswer')
            {
                
                temp = (currentDatas[count].question);
                temp.questioncontent = JSON.parse(temp.questioncontent);
            }
            if(list_type == 'teacher_answered')
            {
                
                temp = (currentDatas[count]);
                // temp.questioncontent = JSON.parse(temp.questioncontent);
                // temp.answercontent = JSON.parse(temp.answercontent);
                temp.starttime = util.formatDate(temp.starttime);
            }
            if(list_type == 'teacher_unanswer')
            {
                
                temp = (currentDatas[count].question);
                temp.questioncontent = JSON.parse(temp.questioncontent);
                temp.starttime = util.formatDate(temp.starttime);
            }
            if(list_type == 'student_answered')
            {
                
                temp = (currentDatas[count]);
                // temp.questioncontent = JSON.parse(temp.questioncontent);
                // temp.answercontent = JSON.parse(temp.answercontent);
                temp.starttime = util.formatDate(temp.starttime);
            }
            if(list_type == 'student_unanswer')
            {
                
                temp = (currentDatas[count].question);
                temp.questioncontent = JSON.parse(temp.questioncontent);
                temp.starttime = util.formatDate(temp.starttime);
            }
            if(list_type == 'index_search_knowledge')
            {
                 temp.answertime = util.formatDate(temp.answertime);
                
            }
            if(list_type == 'index_search_teacher')
            {
                
                var collectOrNot = temp.collectOrNot;
                temp = JSON.parse(temp.teacher);
                temp["collectOrNot"] = collectOrNot;
            }
            if(list_type == 'subject_teacher')
            {
                var collectOrNot = temp.isClick;
                temp = JSON.parse(temp.question);
                if(collectOrNot == 1)
                {
                    temp["collectOrNot"] = true;
                }
                else
                {
                    temp["collectOrNot"] = false;
                }
            }
            if(list_type == 'collection_teacher')
            {

                temp["collectOrNot"] = true;
            }
            if(list_type == 'my_like_answer')
            {
                
                temp = (currentDatas[count]);
                // temp.questioncontent = JSON.parse(temp.questioncontent);
                // temp.answercontent = JSON.parse(temp.answercontent);
                temp.starttime = util.formatDate(temp.starttime);
            }
            if(list_type == 'teacher_bill' || list_type == 'student_bill')
            {
                temp.day = util.formatDay(temp.operationTime);
                temp.hms = util.formatHMS(temp.operationTime);
            }
            console.log(temp);
            concatDatas[count] = temp;
        }

        //数据的一些处理,包括了一维和二维数组的处理,全部都解析到单个item层次返回
        concatDatas.forEach(function(info){
            if(info instanceof Array){
                console.log('handle path s');
                info.forEach(function(item){
                    that.handldItemInfo(item);
                });
            }else {
                console.log('handle path ');
                that.handldItemInfo(info,that);
            }
        });
        console.log(concatDatas);

        //根据操作的action不同而处理:
        if(action == request_firstIn){
            
        }else if (action == request_loadmore){

        }else if (action == request_refresh){
            // that.data.infos.length =0;
        }

        if(currentDatas.length < config.params.pageSize){
            loadMoreNoData(that);
        }

        /**
         * 根据不同列表类型动态加载内容
         */
        if(list_type == 'index'){
            //滑动列表结尾追加数据
            that.data.infos=that.data.infos.concat(concatDatas);
            console.log('before setData----------'+that.data.infos);
            that.setData({infos:that.data.infos});
        }
        if(list_type == 'teacher'){
            //滑动列表结尾追加数据
                        that.data.ask_teacher_list=that.data.ask_teacher_list.concat(concatDatas);
            console.log('before setData----------'+that.data.ask_teacher_list);
            that.setData({ask_teacher_list:that.data.ask_teacher_list});
        }
        if(list_type == 'question'){
    that.data.questionsForAnswer=that.data.questionsForAnswer.concat(concatDatas);
            console.log('before setData----------'+that.data.questionsForAnswer);
            that.setData({questionsForAnswer:that.data.questionsForAnswer});
        }

        if(list_type == 'my_question'){
           //personal question
            that.data.personal_ask_list=that.data.personal_ask_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_ask_list);
            that.setData({personal_ask_list:that.data.personal_ask_list});
        }
        if(list_type == 'my_question_answer'){
           //personal question answer
            
            that.data.personal_question_answer_list=that.data.personal_question_answer_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_question_answer_list);
            that.setData({personal_question_answer_list:that.data.personal_question_answer_list});
        }
        if(list_type == 'my_answered'){
           //personal answer
            that.data.personal_answer_list=that.data.personal_answer_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_answer_list);
            that.setData({personal_answer_list:that.data.personal_answer_list});
        }
        if(list_type == 'my_unanswer'){
           //personal not answer
            that.data.personal_not_answer_list=that.data.personal_not_answer_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_not_answer_list);
            that.setData({personal_not_answer_list:that.data.personal_not_answer_list});
        }
        if(list_type == 'teacher_answered'){
           //teacher answer
            that.data.personal_answer_list=that.data.personal_answer_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_answer_list);
            that.setData({personal_answer_list:that.data.personal_answer_list});
        }
        if(list_type == 'teacher_unanswer'){
           //teacher not answer
            that.data.personal_not_answer_list=that.data.personal_not_answer_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_not_answer_list);
            that.setData({personal_not_answer_list:that.data.personal_not_answer_list});
        }
        if(list_type == 'student_answered'){
           //student answer
            that.data.personal_answer_list=that.data.personal_answer_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_answer_list);
            that.setData({personal_answer_list:that.data.personal_answer_list});
        }
        if(list_type == 'student_unanswer'){
           //student not answer
            that.data.personal_not_answer_list=that.data.personal_not_answer_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_not_answer_list);
            that.setData({personal_not_answer_list:that.data.personal_not_answer_list});
        }
        if(list_type == 'my_like_answer'){
           //personal like answer
            that.data.personal_like_answer_list=that.data.personal_like_answer_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_like_answer_list);
            that.setData({personal_like_answer_list:that.data.personal_like_answer_list});
        }
        if(list_type == 'my_like_teacher'){
           //personal like teacher
            that.data.personal_like_teacher_list=that.data.personal_like_teacher_list.concat(concatDatas);
            console.log('before setData----------'+that.data.personal_like_teacher_list);
            that.setData({personal_like_teacher_list:that.data.personal_like_teacher_list});
        }
        if(list_type == 'index_search_knowledge'){
            //滑动列表结尾追加数据
            that.data.infos=that.data.infos.concat(concatDatas);
            console.log('before setData----------'+that.data.infos);
            that.setData({infos:that.data.infos});
        }
        if(list_type == 'index_search_teacher'){
            that.data.search_teacher_list=that.data.search_teacher_list.concat(concatDatas);
            console.log('before setData----------'+that.data.search_teacher_list);
            that.setData({search_teacher_list:that.data.search_teacher_list});
        }
        if(list_type == 'index_search_org'){
            that.data.search_org_list=that.data.search_org_list.concat(concatDatas);
            console.log('before setData----------'+that.data.search_org_list);
            that.setData({search_org_list:that.data.search_org_list});
        }
        if (list_type == 'nearest_orgs') {
          that.data.search_org_list = that.data.search_org_list.concat(concatDatas);
          console.log('before setData----------' + that.data.search_org_list);
          that.setData({ search_org_list: that.data.search_org_list });
        }

        if(list_type == 'subject_teacher'){
            that.data.search_teacher_list=that.data.search_teacher_list.concat(concatDatas);
            console.log('before setData----------'+that.data.search_teacher_list);
            that.setData({search_teacher_list:that.data.search_teacher_list});
        }
        if(list_type == 'collection_teacher'){
            that.data.search_teacher_list=that.data.search_teacher_list.concat(concatDatas);
            console.log('before setData----------'+that.data.search_teacher_list);
            that.setData({search_teacher_list:that.data.search_teacher_list});
        }

        if(list_type == 'teacher_bill'){
            that.data.teacher_bill_list=that.data.teacher_bill_list.concat(concatDatas);
            console.log('before setData----------'+that.data.search_org_list);
            that.setData({teacher_bill_list:that.data.teacher_bill_list});
        }
        if(list_type == 'student_bill'){
            that.data.student_bill_list=that.data.student_bill_list.concat(concatDatas);
            console.log('before setData----------'+that.data.search_org_list);
            that.setData({student_bill_list:that.data.student_bill_list});
        }

    };

    config.callback.onEmpty = function(){
        that.setData({
            hide_loading: true,
        });

        that.data.currentAction = request_none;
        if(action == request_firstIn){
            showEmptyPage(that);
        }else if (action == request_loadmore){
            loadMoreNoData(that);
        }else if (action == request_refresh){
            // showSuccessToast(that,"没有新内容");
            //清空现有列表
            if(list_type == 'index'){
                //滑动列表结尾追加数据
                
                that.setData({infos:[]});
            }
            if(list_type == 'teacher'){
                //滑动列表结尾追加数据
                            
                that.setData({ask_teacher_list:[]});
            }
            if(list_type == 'question'){
        
                that.setData({questionsForAnswer:[]});
            }

            if(list_type == 'my_question'){
            //personal question
                
                that.setData({personal_ask_list:[]});
            }
            if(list_type == 'my_question_answer'){
            //personal question answer
                
                that.setData({personal_question_answer_list:[]});
            }
            if(list_type == 'my_answered'){
            //personal answer
                
                that.setData({personal_answer_list:[]});
            }
            if(list_type == 'my_unanswer'){
            //personal not answer
                
                that.setData({personal_not_answer_list:[]});
            }
            if(list_type == 'teacher_answered'){
            //teacher answer
                
                that.setData({personal_answer_list:[]});
            }
            if(list_type == 'teacher_unanswer'){
            //teacher not answer
                
                that.setData({personal_not_answer_list:[]});
            }
            if(list_type == 'student_answered'){
            //student answer
                
                that.setData({personal_answer_list:[]});
            }
            if(list_type == 'student_unanswer'){
            //student not answer
                
                that.setData({personal_not_answer_list:[]});
            }
            if(list_type == 'my_like_answer'){
            //personal like answer
                
                that.setData({personal_like_answer_list:[]});
            }
            if(list_type == 'my_like_teacher'){
            //personal like teacher
                
                that.setData({personal_like_teacher_list:[]});
            }
            if (that.hasSuccessed){
                //showSuccessToast(that,"没有新内容");
            }else {
                showEmptyPage(that);
            }

        }
    };

    config.callback.onError= function(msgCanShow,code,hiddenMsg){
        that.data.currentAction = request_none;
        console.log(hiddenMsg+"--"+code);
        that.setData({
            hide_loading: true,
        });

        if(action == request_firstIn){
            showErrorPage(that,msgCanShow);
        }else if (action == request_loadmore){
            loadMoreError(that);
        }else if (action == request_refresh){
            if (that.hasSuccessed){

            }else {
                showErrorPage(that,msgCanShow)
            }
        }
    };

    config.callback.onEnd=function(){
        if (action == request_refresh){
            stopPullRefresh(that);
        }
        that.setData({
            hide_loading: true,
        });
        hideLoadingDialog(that);
    };

    request(config);
}


// function requestForDetail(that, action){
//     var config = new requestConfig();
//     config.page = that;
//     config.urlDetail= that.data.urlDetail;
//    // config.params.pageIndex = pageIndex;
//     console.log(" before setNetparams");
//     console.log(config.params);
//     that.setNetparams(config.params);
//     console.log(" after setNetparams");
//     console.log(config.params);
//     if (that.data.requestMethod != undefined)
//     config.netMethod = that.data.requestMethod;
//     that.data.currentAction = action;
//     config.callback.onPre = function(){

//         console.log("onpre:"+action);
//         if(action == request_firstIn  ){
//             console.log(" pre showLoadingDialog:"+action);
//             showLoadingDialog(that);
//             console.log(" after showLoadingDialog:"+action);
//         }
//     };

//     config.callback.onSuccess=function(data){
//         that.data.currentAction = request_none;
//         hideLoadingDialog(that);
//         var currentDatas = that.getDetailFromNetData(data);//todo 如果是其中一个字段,需要取出.

//         console.log(currentDatas);

//         if (currentDatas == null|| currentDatas == undefined){
//             console.log("before onEmpty:");
//             config.onEmpty();
//             console.log("after onEmpty:");
//         }else {
//             console.log("onsuccess");
//             that.hasSuccessed = true;
//             showContent(that);

//             if(action == request_firstIn ){

//             }else if (action == request_refresh){
//                 showSuccessToast(that,"数据刷新成功");

//             }

//             //数据的一些处理:
//             that.handlerDetailInfoAndRefresUI(currentDatas,action);
//         }



//     };

//     config.callback.onEmpty = function(){
//         hideLoadingDialog(that);
//         that.data.currentAction = request_none;
//         console.log("Actions:"+action);
//         if(action == request_firstIn){
//             showEmptyPage(that);
//         }else if (action == request_loadmore){
//             loadMoreNoData(that);
//         }else if (action == request_refresh){
//             if (that.hasSuccessed){
//                 showSuccessToast(that,"没有新内容");
//             }else {
//                 showEmptyPage(that);
//             }

//         }
//     };

//     config.callback.onError= function(msgCanShow,code,hiddenMsg){
//         that.data.currentAction = request_none;
//         console.log(hiddenMsg+"--"+code);
//         hideLoadingDialog(that);

//         if(action == request_firstIn){
//             showErrorPage(that,msgCanShow);
//         }else if (action == request_loadmore){
//            // loadMoreError(that);
//         }else if (action == request_refresh){
//             if (that.hasSuccessed){

//             }else {
//                 showErrorPage(that,msgCanShow)
//             }

//         }


//     };

//     request(config)
// }


// function requestForComments(that,pageIndex,action){
//     var config = new requestConfig();
//     config.page = that;
//     config.urlDetail= that.data.urlDetail;
//     config.params.pageIndex = pageIndex;
//     that.setNetparams(config.params);
//     that.data.currentAction = action;
//     config.callback.onPre = function(){
//         loadMoreStart(that);

//     };

//     config.callback.onSuccess=function(data){
//         that.data.currentAction = request_none;
//         console.log("data.infos.length:"+data.infos.length);
//        // hideLoadingDialog(that);
//         var currentDatas = that.getListFromNetData(data);//todo 如果是其中一个字段,需要取出.

//         if (currentDatas.length==0){
//             config.onEmpty();
//             return;
//         }

//         //that.handleDataAndRefreshUI(data);
//         //处理数据
//         that.data.currentPageIndex = pageIndex;



//         //数据的一些处理:
//         currentDatas.forEach(function(info){
//             that.handldItemInfo(info)
//         });

//         //根据操作的action不同而处理:
//         if(action == request_firstIn){
//             // that.data.infos.length =0;
//         }else if (action == request_loadmore){

//         }else if (action == request_refresh){
//             that.data.infos.length =0;
//         }


//         that.data.infos=that.data.infos.concat(currentDatas);
//         log("that.data.infos.length:"+that.data.infos.length);
//         that.setData({infos:that.data.infos});


//     };

//     config.callback.onEmpty = function(){
//        // hideLoadingDialog(that);
//         that.data.currentAction = request_none;
//         if(action == request_firstIn){
//             loadMoreNoData(that);
//         }else if (action == request_loadmore){
//             loadMoreNoData(that);
//         }else if (action == request_refresh){
//             that.data.infos.length =0;
//             that.setData({infos:that.data.infos});
//             loadMoreNoData(that);

//         }
//     };

//     config.callback.onError= function(msgCanShow,code,hiddenMsg){
//         that.data.currentAction = request_none;
//         console.log(hiddenMsg+"--"+code);
//         hideLoadingDialog(that);

//         if(action == request_firstIn){
//            // showErrorPage(that,msgCanShow);
//             loadMoreError(that);
//         }else if (action == request_loadmore){
//             loadMoreError(that);
//         }else if (action == request_refresh){

//         }


//     };

//     request(config)
// }

function btnBean(){
    this.size='default';
    this.type='primary';
    this.plain=false;
    this.disabled=false;
    this.loading=false;
    this.text='确定';
}

function setBtnLoading(that,msg){
    var btn = that.data.btn;
    btn.disabled = true;
    btn.loading = true;
    if (!isOptStrNull(msg)){
        btn.text = msg;
    }

    that.setData({
        btn:btn
    });
}

function setBtnSuccess(that,msg){
    var btn = that.data.btn;
    btn.disabled = false;
    btn.loading = false;
    this.type='primary';
    if (!isOptStrNull(msg)){
        btn.text = msg;
    }
    that.setData({
        btn:btn
    });
}

function setBtnError(that,msg){
    var btn = that.data.btn;
    btn.disabled = false;
    btn.loading = false;
    btn.type='warn';
    if(!isOptStrNull(msg)){
        btn.text = msg;
    }
    that.setData({
        btn:btn
    });
}

function netStateBean(){
    this.emptyMsg='暂时没有内容',
    this.emptyHidden = true,

    this.errorHidden=true,
        this.errorMsg='',

    this.loadmoreMsg='加载中...',
    this.loadmoreHidden=true,
    this.contentHidden = true,
    this.hasSuccessed = false
}



//显示toast的方法
function showSuccessToast(that,msg){
   /* var bean = that.data.netStateBean;
    bean.toastMsg = msg;
    bean.toastHidden = false;
    that.setData({
        netStateBean: bean
    });*/

    wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1500
    })
}

function showFailToast(that,msg){
  /*  var bean = that.data.netStateBean;
    bean.toastMsg = msg;
    bean.toastHidden = false;
    that.setData({
        netStateBean: bean
    });*/

    wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1500
    })

}

function dismissToast(that){
   /* var bean = that.data.netStateBean;
    bean.toastHidden = true;
    that.setData({
        netStateBean: bean
    });*/

    wx.hideToast();

}

function stopPullRefresh(that){
    /* var bean = that.data.netStateBean;
     bean.toastHidden = true;
     that.setData({
     netStateBean: bean
     });*/

    wx.stopPullDownRefresh();

}

function hideKeyBoard(that){
    wx.stopPullDownRefresh();
}


//加载对话框的显示和隐藏
function showLoadingDialog(that){
    /*var bean = that.data.netStateBean;
    bean.loadingHidden = false;
    that.setData({
        netStateBean: bean
    });*/

    wx.showToast({
        title: "加载中",
        icon: 'loading',
        duration: 10000
    })

}
function  hideLoadingDialog(that){
    /*var bean = that.data.netStateBean;
    bean.loadingHidden = true;
    that.setData({
        netStateBean: bean
    });*/

    wx.hideToast();

}

//loadmore的状态与信息
function  loadMoreError(that){
    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载出错,请上拉重试';
    that.setData({
        netStateBean: bean
    });

}

function loadMoreStart(that){

    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载中...';
    that.setData({
        netStateBean: bean
    });

}

function loadMoreNoData(that){
    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '没有了...';
    that.setData({
        netStateBean: bean
    });
}

//以下三个方法是用于页面状态管理
function showEmptyPage(that){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.emptyHidden = false;
    bean.loadingHidden = true;
    var empty = that.data.emptyMsg;
    if (isOptStrNull(empty)){
        empty = "没有内容"
    }
    bean.emptyMsg= empty;
    bean.contentHidden=true;
    bean.errorHidden = true;
    that.setData({
        netStateBean: bean
    });
}

function showErrorPage(that,msg){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.errorHidden = false;
    bean.errorMsg= msg;
    bean.loadingHidden = true;
    bean.contentHidden=true;
    that.setData({
        netStateBean: bean
    });

}
function showContent(that){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.errorHidden = true;
    bean.emptyHidden = true;
    bean.contentHidden=false;
    bean.loadingHidden = true;
    that.setData({
        netStateBean: bean
    });
}










/**
 *
 * @param that
 * @param itemList
 * @param itemColor
 * @param listener
 */
function  showActionSheet(that,itemList,itemColor,listener){
    wx.showActionSheet({
        itemList: itemList,
        itemColor:itemColor,
        success: function(res) {
            if (!res.cancel) {
                var index = res.tapIndex;
                console.log(res.tapIndex);
                listener.onItemClick(index,itemList[index]);
            }else {//取消按钮

            }
        }
    })
}


/*{
    onConfirm:function (){

    }
}*/
function showAlertDialog(title,msg,showCancle,confirmText,confirmColor,listener){
    if(isOptStrNull(confirmColor)){
        confirmColor='#3CC51F';
    }
    wx.showModal({
        title: title,
        content:msg,
        success: function(res) {
            if (res.confirm) {
                console.log('用户点击确定')
                listener.onConfirm();
            }
        },
        showCancel:showCancle,
        confirmText:confirmText,
        confirmColor:confirmColor
    })
}


function download(url){
    showLoadingDialog(null);
    wx.downloadFile({
        url: url,
        success: function(res) {
            wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function(res) {
                    var savedFilePath = res.savedFilePath;
                    showSuccessToast(null,"文件已保存");
                    log(savedFilePath);

                },
                fail:function(e){
                    showFailToast(null,"文件转存失败了")
                }
            })

        },
        fail:function(e){
            console.log(e);
            showFailToast(null, "文件下载失败了");
        }
    })
}

function imageAutoFullSize(e) {
    var imageSize = {};
    var originalWidth = e.detail.width;//图片原始宽
    var originalHeight = e.detail.height;//图片原始高
    var originalScale = originalHeight/originalWidth;//图片高宽比
    console.log('originalWidth: ' + originalWidth)
    console.log('originalHeight: ' + originalHeight)
    //获取屏幕宽高
    wx.getSystemInfo({
        success: function (res) {
            var windowWidth = res.windowWidth;
            var windowHeight = res.windowHeight;
            var windowscale = windowHeight/windowWidth;//屏幕高宽比
            console.log('windowWidth: ' + windowWidth)
            console.log('windowHeight: ' + windowHeight)
            if(originalScale < windowscale){//图片高宽比小于屏幕高宽比
                //图片缩放后的宽为屏幕宽
                imageSize.imageWidth = windowWidth;
                imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
            }else{//图片高宽比大于屏幕高宽比
                //图片缩放后的高为屏幕高
                imageSize.imageHeight = windowHeight;
                imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
            }

        }
    })
    console.log('缩放后的宽: ' + imageSize.imageWidth)
    console.log('缩放后的高: ' + imageSize.imageHeight)
    return imageSize;
}



module.exports = {
    imageAutoFullSize:imageAutoFullSize,
    download:download,
    request:request,
    requestConfig:requestConfig,
    requestSimpleList:requestSimpleList,
   // viewBeansForSimpleList:viewBeansForSimpleList
    // requestForDetail:requestForDetail,
    // requestForComments:requestForComments,
    netStateBean:netStateBean,

    buildRequest:buildRequest,
    action:Actions,
    // sendRequestByAction:sendRequestByAction,


    showContent:showContent,
    showErrorPage:showErrorPage,
    showEmptyPage:showEmptyPage,
    loadMoreNoData:loadMoreNoData,
    loadMoreStart:loadMoreStart,
    loadMoreError:loadMoreError,
    hideLoadingDialog:hideLoadingDialog,
    showLoadingDialog:showLoadingDialog,
    showSuccessToast:showSuccessToast,
    dismissToast:dismissToast,
    showFailToast:showFailToast,



    

    btnBean:btnBean,
    setBtnLoading:setBtnLoading,
    setBtnSuccess:setBtnSuccess,
    setBtnError:setBtnError,
    showActionSheet:showActionSheet,
    showAlertDialog:showAlertDialog,
    stopPullRefresh:stopPullRefresh,
    hideKeyBoard:hideKeyBoard,


    

    isFunction:isFunction,

    defaultPageSize:defaultPageSize,

    json2Form:json2Form,













}