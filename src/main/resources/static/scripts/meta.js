
function init(){
    var token=$.cookie('token');
    if(token==null){
        window.location.replace("/login");
    }
}

