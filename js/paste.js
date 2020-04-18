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

function save(){

}

function read() {

}