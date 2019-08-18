var geoserver;
var curTileMap;
var serviceDict;
var groupDict;
var kindDict;
var perPixelDict;
function init(){
    geoserver=$("#m_mapserver").val();
    initDict();
	loadMapDesc();
	loadMapSets();
}
function initDict(){
    serviceDict=[];
    serviceDict["1"]="XYZ";
    serviceDict["2"]="TMS";
    groupDict=[];
    groupDict["L0"]="基础栅格图层";
    groupDict["L1"]="项目栅格图层";
    groupDict["L2"]="基础矢量图层";
    groupDict["L3"]="项目矢量图层";
    groupDict["L4"]="绘制图层";
    kindDict=[];
    //kindDict[1]="Geoserver服务";
    //kindDict[2]="OSS缓存图片";
    //kindDict[3]="OSS时序缓存图片";
    kindDict[4]="TMS瓦片缓存";
    kindDict[5]="TMS时序瓦片缓存";
    kindDict[6]="PG图层";
    kindDict[7]="XYZ瓦片缓存";

    perPixelDict=[];
    perPixelDict[0]=156543.03390000000945;
    perPixelDict[1]=78271.51695000000473;
    perPixelDict[2]=39135.75847500000236;
    perPixelDict[3]=19567.87923750000118;
    perPixelDict[4]=9783.93961875000059;
    perPixelDict[5]=4891.96980937500030;
    perPixelDict[6]=2445.98490468750015;
    perPixelDict[7]=1222.99245234375007;
    perPixelDict[8]=611.49622617187504;
    perPixelDict[9]=305.74811308593752;
    perPixelDict[10]=152.87405654296876;
    perPixelDict[11]=76.43702827148438;
    perPixelDict[12]=38.21851413574219;
    perPixelDict[13]=19.10925706787109;
    perPixelDict[14]=9.55462853393555;
    perPixelDict[15]=4.77731426696777;
    perPixelDict[16]=2.38865713348389;
    perPixelDict[17]=1.19432856674194;
    perPixelDict[18]=0.5972;
    perPixelDict[19]=0.2986;
    perPixelDict[20]=0.1493;
    perPixelDict[21]=0.0746;
    perPixelDict[22]=0.0373;
    perPixelDict[23]=0.0187;

    $("#m_order").change(function() {
        console.log("【order】"+$("#m_order").val());
        $("#m_perPixel").val(perPixelDict[$("#m_order").val()]);
    });


}
function loadMapDesc(){
    $.get(
        "/tilemap/get",{
            id:$("#m_mapId").val()
        },
        function(json){
            if(json.success){
                var data=json.data;
                curTileMap=data;
                $("#m_name").text(data.title);
                $("#m_comment").text(data.abstract);
                $("#m_props").append('<li class="list-group-item"><b>服务类型：</b>'+serviceDict[data.serviceId]+'</li>');
                $("#m_props").append('<li class="list-group-item"><b>图层分组：</b>'+groupDict[data.group]+'</li>');
                $("#m_props").append('<li class="list-group-item"><b>图层种类：</b>'+kindDict[data.kind]+'</li>');
                $("#m_props").append('<li class="list-group-item"><b>瓦片类型：</b>'+data.tileType+'</li>');

                $("#m_props").append('<li class="list-group-item"><b>SRS：</b>EPSG:'+data.epsg+'</li>');
                var profile;
                if(data.epsg==4326){
                    profile="geodetic";
                }else {
                    profile="mercator";
                }
                $("#m_props").append('<li class="list-group-item"><b>Profile：</b>'+profile+'</li>');


            }
        }
        ,"json");
}
function loadMapSets(){
    $.get(
        "/tileset/list",{
            mapId:$("#m_mapId").val()
        },
        function(json){
            if(json.success){
                var list=json.data;
                $("#maplist tbody").empty();
                for(var i=0;i<list.length;i++){
                    var item=list[i];
                    var tr='<tr>';
                    tr+='<td>'+item.id+'</td>';
                    tr+='<td>'+item.sortOrder+'</td>';
                    tr+='<td>'+item.unitsPerPixel+'</td>';
                    tr+='<td>'+item.href+'</td>';
                    tr+='<td><button type="button" class="btn btn-xs btn-danger" onclick="removeTileSet('+item.id+')" >删除</button></td>';
                    tr+='</tr>';
                    $("#maplist tbody").append(tr);

                }
            }

        }
        ,"json");
}
function addTileSet(){
    $("#modal-add").modal('hide');
    var z=$("#m_order").val();
    var href;
    if(curTileMap.serviceId==1){
        href="http://${mapserver}/xyz/1.0.0/"
            +curTileMap.name+"@EPSG:"+curTileMap.epsg+"@"+curTileMap.tileType
            +'/{x}/{y}/'+z+'.'+curTileMap.tileType;
    }else {
        href="http://${mapserver}/tms/1.0.0/"
            +curTileMap.name+"@EPSG:"+curTileMap.epsg+"@"+curTileMap.tileType
            +'/'+z+'/{x}/{y}.'+curTileMap.tileType;
    }
    var jsondata={
        mapId:$("#m_mapId").val(),
        href:href,
        unitsPerPixel:perPixelDict[z],
        sortOrder:z
    };
    $.ajax({
        type: "POST",
        url: "/tileset/add",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsondata),
        dataType: "json",
        success: function (json) {
            loadMapSets();
        }
    });
}
function removeTileSet(id){
    $.get(
        "/tileset/del",{
            id:id
        },
        function(json) {
            if (json.success) {
                loadMapSets();
            }
        }
        ,"json");
}


