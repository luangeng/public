const FULL_CHARTER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopgrstuvwxyz';
const git_clientId='56e8a839e198dd00a4cc';
const git_secret='123';
const redirect_uri = window.location.origin;
const git_auth = 'https://github.com/login/oauth/authorize?';
const git_token = 'https://github.com/login/oauth/access_token';
const git_user = 'https://api.github.com/user?access_token=';
const scope	= 'read';
const token_storage = localStorage;

jQuery(document).ready(function() {
    var url = window.location.toString();
    if(url.includes('code') && url.includes('state')){
        var state_local = token_storage.getItem('git_state');
        let code=url.substr(url.indexOf('code=')+5,20);
        let state=url.substr(url.indexOf('state=')+6,6);
        if (state_local != state){
            return;
        }
        //
        fetchToken(code, state);
        //
        }


    $.backstretch("img/1.jpg");

    var APP_ID = 'q1EPKWBP8zxISs3AiwAd1P98-gzGzoHsz';
    var APP_KEY = 'NKLkrafxvTEBPC1XeFaAWUvo';

    AV.init({
      appId: APP_ID,
      appKey: APP_KEY
    });

      $("#btn-login").on('click', function(e) {
        e.preventDefault();
        login();
      });
        $("#btn-sign").on('click', function(e) {
          e.preventDefault();
          signup();
        });

    $('.form-control').on('focus', function() {
    	$(this).removeClass('input-error');
    });


});

function check(){
    $('.form-control').each(function(){
    		if( $(this).val() == "" ) {
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
}

function signup() {
  check();
  var username = $('#username').val();
  var password = $('#password').val();
  var email = $('#email').val();
  if(username.trim().length==0 || password.trim().length==0 || email.trim().length==0){
    return;}

  // LeanCloud - 注册
  // https://leancloud.cn/docs/leanstorage_guide-js.html#注册
  var user = new AV.User();
  user.setUsername(username);
  user.setPassword(password);
  user.setEmail(email);
  user.signUp().then(function (loginedUser) {
    window.location.href = "/login.html";
  }, (function (error) {
  	alert(JSON.stringify(error));
  }));
};


function login() {
  check();
  var username = $('#username').val();
  var password = $('#password').val();
  if(username.trim().length==0 || password.trim().length==0){
  return;}

  // LeanCloud - 登录
  // https://leancloud.cn/docs/leanstorage_guide-js.html#用户名和密码登录
  AV.User.logIn(username, password).then(function (loginedUser) {
    window.location.href = "/";
  }, function (error) {
    alert(JSON.stringify(error));
  });
};

function getState(){
var state='';
for (var a=0;a<6;a++){
    state+=FULL_CHARTER[Math.floor(Math.random() * 52)];
}
token_storage.setItem("git_state", state);
return state;
}

function git_login(){
    var url=git_auth+'client_id='+git_clientId+'&redirect_uri='+redirect_uri+'&scope='+scope+'&state='+getState();
    window.location = url;
}

function fetchToken(code, state){
        var data={
        'code':code,
        'state':state,
        'client_id':git_clientId,
        'client_secret':git_secret,
        'redirect_uri':redirect_uri
        };
    $.ajax({
       url: git_token,
       type:"post",
       data:data,
       contentType: 'application/x-www-form-urlencoded',
       complete(XHR, TS){
        console.log(TS);
       }

    });
}
