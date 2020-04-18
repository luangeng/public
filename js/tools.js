$(function(){
    var str = window.location.href.substr(window.location.href.indexOf('#')+1);
    if(str.length==1 && str>"0"&& str<="9"){
        $("#d_nav"+str).show();
        $("a.blog-nav-item").removeClass("active");
        $("#nav"+str).addClass("active");
    } else{
        $("#d_nav1").show();
    }
    loading(1);
    loading(0);
});

$("a.blog-nav-item").click(function(a){
    loading(1);
    $("a.blog-nav-item").removeClass("active");
    $(a.currentTarget).addClass("active");
    $("div.allhide").hide();

    var divid = "d_"+$(a.currentTarget).attr("id");
    $("#"+divid).show();
    loading(0);
});

function loading(boo){
if(boo){ $("#loading").show(); }
else {$("#loading").fadeOut("slow"); }
}

$("#base64_en").click(function(){
    var str = $("#text1").val();
    if (str.length==0){return;}
    var str2 = Base64.encode(str);
    $("#text2").val(str2);
});

$("#base64_d").click(function(){
    var str = $("#text1").val();
    if (str.length==0){return;}
    var str2 = Base64.decode(str);
    $("#text2").val(str2);
});

$("#md5").click(function(){
    var str = $("#text3").val();
    if (str.length==0){return;}
    var str2 = hex_md5(str);
    $("#text4").val(str2);
});

$("#jwt").click(function(){
    var str = $("#text5").val();
    if (str.length==0){return;}
    var arr1 = str.split('.');
    var str2="";
    for(i in arr1){
        str2+=Base64.decode(arr1[i]);
        if(i!=arr1.length-1)
        str2+='\n';
    }
    $("#text6").val(str2);
});

$("#url_en").click(function(){
    var str = $("#text13").val();
    if (str.length==0){return;}
    var str2 = encodeURIComponent(str);
    $("#text14").val(str2);
});

$("#url_d").click(function(){
    var str = $("#text13").val();
    if (str.length==0){return;}
    var str2 = decodeURIComponent(str);
    $("#text14").val(str2);
});

$("#uni").click(function(){
    var str = $("#text9").val();
    if (str.length==0){return;}
    var res = [];
    for (var i=0; i<str.length; i++) {
    	res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
    }
    $("#text10").val("\\u" + res.join("\\u"));
});

$("#uni_d").click(function(){
    var str = $("#text9").val();
    if (str.length==0){return;}
    str = str.replace(/\\/g, "%");
    $("#text10").val(unescape(str));
});

$("#utf").click(function(){
    var str = $("#text11").val();
    if (str.length==0){return;}
    var str2 = str.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") });
    $("#text12").val(str2);
});

$("#utf_d").click(function(){
    var str = $("#text11").val();
    if (str.length==0){return;}
    var str2 = unescape(str.replace(/&#x/g, '%u').replace(/;/g, ''));
    $("#text12").val(str2);
});

$("#json").click(function(){
    var str = $("#text7").val();
    if (str.length==0){return;}
    $("#text8").val(formatJson(str));
});

var qrcode = new QRCode(document.getElementById("qrcode-img"), {width : 150,height : 150 });
$("#qr").click(function(){
    var str = $("#text15").val();
    if (str.length==0){return;}
    qrcode.makeCode(str);
});



//格式化Json字符串
var formatJson = function(json, options) {
	var reg = null,
		formatted = '',
		pad = 0,
		PADDING = '    '; // one can also use '\t' or a different number of spaces
	// optional settings
	options = options || {};
	// remove newline where '{' or '[' follows ':'
	options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
	// use a space after a colon
	options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

	// begin formatting...

	// make sure we start with the JSON as a string
	if (typeof json !== 'string') {
		json = JSON.stringify(json);
	}
	// parse and stringify in order to remove extra whitespace
	json = JSON.parse(json);
	json = JSON.stringify(json);

	// add newline before and after curly braces
	reg = /([\{\}])/g;
	json = json.replace(reg, '\r\n$1\r\n');

	// add newline before and after square brackets
	reg = /([\[\]])/g;
	json = json.replace(reg, '\r\n$1\r\n');

	// add newline after comma
	reg = /(\,)/g;
	json = json.replace(reg, '$1\r\n');

	// remove multiple newlines
	reg = /(\r\n\r\n)/g;
	json = json.replace(reg, '\r\n');

	// remove newlines before commas
	reg = /\r\n\,/g;
    json = json.replace(reg, ',');

    // optional formatting...
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ': ');
    }

    $.each(json.split('\r\n'), function(index, node) {
        var i = 0,
            indent = 0,
            padding = '';

        if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else {
            indent = 0;
        }

        for (i = 0; i < pad; i++) {
            padding += PADDING;
        }
        formatted += padding + node + '\r\n';
        pad += indent;
    });
    return formatted;
};

