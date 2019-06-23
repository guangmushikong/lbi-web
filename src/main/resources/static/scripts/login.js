var geoserver="http://111.202.109.211:8080";
function getYzm(){
	$.get(
        "login/yzm",
    {
    	"user":$("#femail").val()
    },
    function(json){
        console.log(json);
    },"json");
}
function denglu(){
    $.post(
        geoserver+"/auth/login",
        {
            "username":$("input[name=username]").val(),
            "password":$("input[name=password]").val()
        },
        function(json){
            console.log(json);
            if(json.success){
                $.cookie('token', json.data);
                window.location.replace("/meta");
            }
        },"json");
}
