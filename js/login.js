jQuery(document).ready(function() {

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
