
    function init() {

var _hmt = _hmt || [];
(function() {
  hljs.initHighlightingOnLoad();

  //百度统计
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?519f6f7d9aa99e15da780c28aaa9cc13";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);

  //百度推送
  var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();

//谷歌
    (adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "ca-pub-9678348744203652",
      enable_page_level_ads: true
    });

    	AV.initialize("q1EPKWBP8zxISs3AiwAd1P98-gzGzoHsz", "NKLkrafxvTEBPC1XeFaAWUvo");
               isLogin();
                    var Counter = AV.Object.extend("Counter");
                    if ($('.leancloud_visitors').length == 1) {
                      // in post.html, so add 1 to hit counts
                      addCount(Counter);
                    } else if ($('.post-link').length > 1){
                      // in index.html, there are many 'leancloud_visitors' and 'post-link', so just show hit counts.
                      showHitCount(Counter);
                    }
    }

function showHitCount(Counter) {
      /* 这是给一个页面中有多篇文章时所调用的，例如博客主界面或者存档界面。
      */
      var query = new AV.Query(Counter);
      var entries = [];
      var $visitors = $(".leancloud_visitors");

      // 获取页面中所有文章的id（page.url）
      $visitors.each(function () {
        entries.push( $(this).attr("id").trim() );
      });

      // 批量查询
      query.containedIn('url', entries);
      query.find()
        .done(function (results) {
          var COUNT_CONTAINER_REF = '.leancloud-visitors-count';

          if (results.length === 0) {
            $visitors.find(COUNT_CONTAINER_REF).text(0);
            return;
          }

          for (var i = 0; i < results.length; i++) {
            var item = results[i];
            var url = item.get('url');
            var hits = item.get('hits');// 获取点击次数
            var element = document.getElementById(url);

            // 显示点击次数
            $(element).find(COUNT_CONTAINER_REF).text(hits);
          }
          for(var i = 0; i < entries.length; i++) {
            var url = entries[i];
            var element = document.getElementById(url);
            var countSpan = $(element).find(COUNT_CONTAINER_REF);
            if( countSpan.text() == '') {
              countSpan.text(0);
            }
          }
        })
        .fail(function (object, error) {
          console.log("Error: " + error.code + " " + error.message);
        });
    }

    function addCount(Counter) {
      // 页面（博客文章）中的信息：leancloud_visitors
      // id为page.url， data-flag-title为page.title
      var $visitors = $(".leancloud_visitors");
      var url = $visitors.attr('id').trim();
      var title = $visitors.attr('data-flag-title').trim();
      var query = new AV.Query(Counter);

      // 只根据文章的url查询LeanCloud服务器中的数据
      query.equalTo("url", url);
      query.find({
        success: function(results) {
          if (results.length > 0) {//说明LeanCloud中已经记录了这篇文章
            var counter = results[0];
            counter.fetchWhenSave(true);
            counter.increment("hits");// 将点击次数加1
            counter.save(null, {
              success: function(counter) {
                var $element = $(document.getElementById(url));
                $element.find('.leancloud-visitors-count').text(counter.get('hits'));
              },
              error: function(counter, error) {
                console.log('Failed to save Visitor num, with error message: ' + error.message);
              }
            });
          } else {
            // 执行这里，说明LeanCloud中还没有记录此文章
            var newcounter = new Counter();
            /* Set ACL */
            var acl = new AV.ACL();
            acl.setPublicReadAccess(true);
            acl.setPublicWriteAccess(true);
            newcounter.setACL(acl);
            /* End Set ACL */
            newcounter.set("title", title);// 把文章标题
            newcounter.set("url", url); // 文章url
            newcounter.set("hits", 1); // 初始点击次数：1次
            newcounter.save(null, { // 上传到LeanCloud服务器中
              success: function(newcounter) {
                var $element = $(document.getElementById(url));
                $element.find('.leancloud-visitors-count').text(newcounter.get('hits'));
              },
              error: function(newcounter, error) {
                console.log('Failed to create');
              }
            });
          }
        },
        error: function(error) {
          console.log('Error:' + error.code + " " + error.message);
        }
      });
    }

    function isLogin() {
      var currentUser = AV.User.current();
      if (currentUser) {
          $('.no_login').hide();
          $('._login').show();
          $('#cuser').text(currentUser.attributes.username);
        return true;
      }
      $('.no_login').show();
      $('._login').hide();
      return false;
    }

    function logout(){
        AV.User.logOut();
    }