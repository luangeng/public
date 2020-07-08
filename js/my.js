var baseurl = window.location.origin;

function init() {
  hljs.initHighlightingOnLoad();
  var qrcode = new QRCode(document.getElementById("weixin-qrcode"), { width: 150, height: 150 });
  qrcode.makeCode(window.location.toString());
  $(window).scroll(function () { this.scrollY > 700 ? $("#back-to-top").show() : $("#back-to-top").hide(); });

  // if (baseurl.indexOf('localhost') == -1) {
  AV.initialize("q1EPKWBP8zxISs3AiwAd1P98-gzGzoHsz", "NKLkrafxvTEBPC1XeFaAWUvo");
  var Counter = AV.Object.extend("Counter");
  addCount(Counter);
  showHitCount(Counter);
  queryRanking();
  // }
}

//给一个页面中有多篇文章时所调用的，例如博客主界面或者存档界面。
function showHitCount(Counter) {
  var query = new AV.Query(Counter);
  var entries = [];
  var COUNT_CONTAINER_REF = '.leancloud-count';
  var $post_a = $("a.leancloud-count");
  if ($post_a.length == 0) {
    return
  }

  // 获取页面中所有文章的url
  $post_a.each(function () {
    var url = $(this).attr("href").trim();
    entries.push(url.substr(window.location.origin.length));
  });

  // 批量查询
  query.containedIn('url', entries);
  query.find()
    .done(function (results) {
      if (results.length === 0) {
        $post_a.find(COUNT_CONTAINER_REF).text(0);
        return;
      }

      for (var i = 0; i < results.length; i++) {
        var item = results[i];
        var url = item.get('url');
        var hits = item.get('hits');
        $("a[href='" + baseurl + url + "'].leancloud-count").each(
          function () {
            $(this).children("span").first().text(hits);
          }
        );
      }
    })
    .fail(function (object, error) {
      console.log("Error: " + error.code + " " + error.message);
    });
}

function addCount(Counter) {
  var $visitors = $(".leancloud_visitors");
  if ($visitors.length == 0) return;
  var url = window.location.pathname;
  var title = $visitors.attr('data-flag-title').trim();
  var query = new AV.Query(Counter);

  // 只根据文章的url查询LeanCloud服务器中的数据
  query.equalTo("url", url);
  query.find({
    success: function (results) {
      if (results.length > 0) {
        var counter = results[0];
        counter.fetchWhenSave(true);
        counter.increment("hits");
        counter.save(null, {
          success: function (counter) {
            $visitors.find('.leancloud-visitors-count').text(counter.get('hits'));
          },
          error: function (counter, error) {
            console.log('Failed to save Visitor num, with error message: ' + error.message);
          }
        });
      } else {
        var newcounter = new Counter();
        var acl = new AV.ACL();
        acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(true);
        newcounter.setACL(acl);
        newcounter.set("title", title);
        newcounter.set("url", url);
        newcounter.set("hits", 1);
        newcounter.save(null, {
          success: function (newcounter) {
            $visitors.find('.leancloud-visitors-count').text(newcounter.get('hits'));
          },
          error: function (newcounter, error) {
            console.log('Failed to create');
          }
        });
      }
    },
    error: function (error) {
      console.log('Error:' + error.code + " " + error.message);
    }
  });
}

function makeCode() {
  swal({ title: '扫一扫', imageUrl: $('#weixin-qrcode').children('img')[0].src });
}

function save() {
  swal('按Ctrl+D收藏');
}

function queryRanking() {
  var Counter = AV.Object.extend("Counter");
  var query = new AV.Query(Counter);
  query.limit(9);
  query.descending('hits');
  query.notEqualTo('title', '关于').find()
    .then(function (results) {
      for (let i in results) {
        var rank = results[i].attributes;
        var j = parseInt(i) + 1;
        var li = '<li><a href="' + baseurl + rank.url + '">' + j + '. ' + rank.title + '(' + rank.hits + ')</a></li>';
        $("#ranking_side_ul").append(li);
      }

      var li_str = $("#ranking_ul").html();
      $("#ranking_ul").empty();
      for (let k in results) {
        var rank = results[k].attributes;
        var li_copy = li_str;
        li_copy = li_copy.replace('$index$', parseInt(k) + 1);
        li_copy = li_copy.replace('$hits$', rank.hits);
        li_copy = li_copy.replace('$title$', rank.title)
        li_copy = li_copy.replace('$url$', baseurl + rank.url);
        $("#ranking_ul").append(li_copy);
      }
    }, function (error) {
    });
}
