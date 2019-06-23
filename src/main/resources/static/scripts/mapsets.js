var geoserver="http://111.202.109.211:8080";
var params;
function init(){
    token=$.cookie('token');
    if(token==null){
        window.location.replace("/login");
    }
	params=GetRequest();
	loadMapDesc();
	loadMapSets();
}
function loadMapDesc(){
    $.ajax({
        type: "GET",
        headers: {
            Authorization: token
        },
        url: geoserver+"/meta/maps/"+params["mapid"],
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if(json.success){
                var data=json.data;
                console.log(data);
                $("#m_name").text(data.title);
                $("#m_comment").text(data.abstract);
                if(data.serviceId==2){
                    $("#m_props").append('<li class="list-group-item"><b>服务类型：</b>TMS</li>');
                }else{
                    $("#m_props").append('<li class="list-group-item"><b>服务类型：</b>XYZ</li>');
                }
                $("#m_props").append('<li class="list-group-item"><b>SRS：</b>'+data.srs+'</li>');
                $("#m_props").append('<li class="list-group-item"><b>Profile：</b>'+data.profile+'</li>');
                $("#m_props").append('<li class="list-group-item"><b>MimeType：</b>'+data.mimeType+'</li>');
                initMap(data);
            }
        }
    });
}
function loadMapSets(){
    $.ajax({
        type: "GET",
        headers: {
            Authorization: token
        },
        url: geoserver+"/meta/maps/"+params["mapid"]+"/mapsets",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if(json.success){
                var list=json.data;
                $("#maplist tbody").empty();
                for(var i=0;i<list.length;i++){
                    var item=list[i];
                    //console.log(item);
                    var tr='<tr>';
                    tr+='<td>'+item.id+'</td>';
                    tr+='<td>'+item.href+'</td>';
                    tr+='<td>'+item.unitsPerPixel+'</td>';
                    tr+='<td>'+item.sortOrder+'</td>';
                    tr+='</tr>';
                    $("#maplist tbody").append(tr);

                }
            }
        }
    });
}
function initMap(json){
	var basemap;
	if(json.serviceId==1){//XYZ
		var url=json.href+"/{x}/{y}/{z}."+json.extension;
		basemap=L.tileLayer(url);
	}else if(json.serviceId==2){//TMS
		var url=json.href+"/{z}/{x}/{y}."+json.extension;
		basemap= L.tileLayer(url, {tms: true});
	}

	//初始化地图控件
    mapObj = L.map('mapbox', {
        center: [39.904989,116.405285],
        zoom: 8,
        minZoom:3,
        maxZoom:13,
        zoomControl:false,	//不加载默认zoomControl,
        layers: [basemap]
    });
    mapObj.fitBounds([[json.minY,json.minX],[json.maxY, json.maxX]]);
}
function GetRequest() {
   var url = location.search; //获取url中含"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}

