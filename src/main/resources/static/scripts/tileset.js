var geoserver;
var curTileMap;
var serviceDict;
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
                $("#m_props").append('<li class="list-group-item"><b>SRS：</b>'+data.srs+'</li>');
                $("#m_props").append('<li class="list-group-item"><b>Profile：</b>'+data.profile+'</li>');
                $("#m_props").append('<li class="list-group-item"><b>MimeType：</b>'+data.mimeType+'</li>');

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
                    tr+='<td>'+item.href+'</td>';
                    tr+='<td>'+item.unitsPerPixel+'</td>';
                    tr+='<td>'+item.sortOrder+'</td>';
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
        href=curTileMap.href+"/{x}/{y}/"+z+"."+curTileMap.extension;
    }else {
        href=curTileMap.href+"/"+z+"/{x}/{y}."+curTileMap.extension;
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


