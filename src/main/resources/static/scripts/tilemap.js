var geoserver;
var table;
var serviceDict;
var groupDict;
var kindDict;
var epsgDict;//坐标系
var tileTypeDict;//瓦片类型
function init(){
    geoserver=$("#m_mapserver").val();
    initDict();
	initMapTable();
	loadMapList();
    $("#s_group").change(function() {
        if(isEmpty($("#s_group").val())){
            table.column(5).search("").draw();
        }else {
            var key=groupDict[$("#s_group").val()];
            table.column(5).search(key).draw();
        }

    });
    $("#s_serviceId").change(function() {
        if(isEmpty($("#s_serviceId").val())){
            table.column(4).search("").draw();
        }else {
            var key=serviceDict[$("#s_serviceId").val()];
            table.column(4).search(key).draw();
        }
    });
    $('#filter_word').on('keyup click',function () {
        table.search($('#filter_word').val()).draw();
    });
    $("#m_srs2").change(function() {
        $("#m_profile2").select2("val",[$("#m_srs2").val()]);
    });
    $("#m_mimeType2").change(function() {
        $("#m_extension2").select2("val",[$("#m_mimeType2").val()]);
    });
    $("#m_kind").change(function() {
        if($("#m_kind").val()==5){
            $("#m_recordDate").parent().parent().show();
            $("#m_prop").parent().parent().hide();
        }else if($("#m_kind").val()==6){
            $("#m_recordDate").parent().parent().hide();
            $("#m_prop").parent().parent().show();
        }else {
            $("#m_recordDate").parent().parent().hide();
            $("#m_prop").parent().parent().hide();
        }
    });
    $("#m_kind2").change(function() {
        if($("#m_kind2").val()==5){
            $("#m_recordDate2").parent().parent().show();
            $("#m_prop2").parent().parent().hide();
        }else if($("#m_kind2").val()==6){
            $("#m_recordDate2").parent().parent().hide();
            $("#m_prop2").parent().parent().show();
        }else {
            $("#m_recordDate2").parent().parent().hide();
            $("#m_prop2").parent().parent().hide();
        }
    });
}
function initDict(){
    serviceDict=[];
    serviceDict["1"]="XYZ";
    serviceDict["2"]="TMS";
    $("#s_serviceId").append('<option>全部</option>');
    for(var key in serviceDict){
        $("#s_serviceId").append('<option value="'+key+'">'+serviceDict[key]+'</option>');
        $("#m_serviceId").append('<option value="'+key+'">'+serviceDict[key]+'</option>');
        $("#m_serviceId2").append('<option value="'+key+'">'+serviceDict[key]+'</option>');
    }
    $("#s_serviceId").select2();
    $("#m_serviceId").select2();
    $("#m_serviceId2").select2();

    groupDict=[];
    groupDict["L0"]="基础栅格图层";
    groupDict["L1"]="项目栅格图层";
    groupDict["L2"]="基础矢量图层";
    groupDict["L3"]="项目矢量图层";
    groupDict["L4"]="绘制图层";
    $("#s_group").append('<option>全部</option>');
    for(var key in groupDict){
        $("#s_group").append('<option value="'+key+'">'+groupDict[key]+'</option>');
        $("#m_group").append('<option value="'+key+'">'+groupDict[key]+'</option>');
        $("#m_group2").append('<option value="'+key+'">'+groupDict[key]+'</option>');
    }
    $("#s_group").select2();
    $("#m_group").select2();
    $("#m_group2").select2();
    kindDict=[];
    //kindDict[1]="Geoserver服务";
    //kindDict[2]="OSS缓存图片";
    //kindDict[3]="OSS时序缓存图片";
    kindDict[4]="TMS瓦片缓存";
    kindDict[5]="TMS时序瓦片缓存";
    kindDict[6]="PG图层";
    kindDict[7]="XYZ瓦片缓存";
    for(var key in kindDict){
        $("#m_kind").append('<option value="'+key+'">'+kindDict[key]+'</option>');
        $("#m_kind2").append('<option value="'+key+'">'+kindDict[key]+'</option>');
    }
    $("#m_kind").select2();
    $("#m_kind2").select2();
    epsgDict=[];
    epsgDict["900913"]="900913";
    epsgDict["4326"]="4326";
    for(var key in epsgDict){
        $("#m_epsg").append('<option value="'+key+'">'+epsgDict[key]+'</option>');
        $("#m_epsg2").append('<option value="'+key+'">'+epsgDict[key]+'</option>');
    }
    $("#m_epsg").select2();
    $("#m_epsg2").select2();

    tileTypeDict=[];
    tileTypeDict["jpeg"]="jpeg";
    tileTypeDict["png"]="png";
    tileTypeDict["tif"]="tif";
    tileTypeDict["geojson"]="geojson";
    tileTypeDict["terrain"]="terrain";
    for(var key in tileTypeDict){
        $("#m_tileType").append('<option value="'+key+'">'+tileTypeDict[key]+'</option>');
        $("#m_tileType2").append('<option value="'+key+'">'+tileTypeDict[key]+'</option>');
    }
    $("#m_tileType").select2();
    $("#m_tileType2").select2();

}
function initMapTable(){
	table= $('#maplist').DataTable({
		"data":[],
        "dom": '<"top">rt<"bottom"ip><"clear">',
        "columns": [
			{
			    "class":          'details-control',
			    "orderable":      false,
			    "data":           null,
			    "defaultContent": '',
			    "width":"5"
			},
            {"data": "id","title":"ID","width":"20"},
            {"data": "name","title":"名称","width":"150"},
            {"data": "memo","title":"备注","width":"150"},
            {"data": null,"title":"协议","width":"40", "orderable":false,
                "render":function(d){
                    if(isEmpty(d.serviceId)) return '';
                    return serviceDict[d.serviceId];
                }},
            {"data": null,"title":"图层分组","width":"80",
                "render": function (d) {
                    if(isEmpty(d.group)) return '';
                    return groupDict[d.group];
                }},
            {"data": null,"title":"图层种类","width":"100", "orderable":false,
                "render":function(d){
                    if(isEmpty(d.kind)) return '';
                    return kindDict[d.kind];
                }},
            {"data": "tileType","title":"瓦片类型","width":"100"},
            {"data": "epsg","title":"EPSG","width":"100"},
            {"data": "minZoom","title":"最小级别","width":"60","orderable":false},
            {"data": "maxZoom","title":"最大级别","width":"60","orderable":false},
            {
                "data": null,
                "width":"80",
                "title":"操作",
                "orderable":false,
                "render": function () {
                    return '<button type="button" class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-edit">编辑</button>'
                        +'&nbsp;<button type="button" class="btn btn-xs btn-danger">删除</button>';
                }
            },
            {
                "data": null,
                "width":"80",
                "orderable":false,
                "render": function () {
                    return '<button type="button" class="btn btn-xs btn-warning">地图集</button>';
                }
            }
        ],
        "pageLength": 10,
        "order": [1, 'asc' ],
        "language": {
            "processing": "正在加载中......",
            "lengthMenu": "每页显示 _MENU_ 条记录",
            "zeroRecords": "抱歉，没有找到",
            "info": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "infoEmpty": "没有数据",
            "infoFiltered": "(从 _MAX_ 条数据中检索)",
            "search": "搜索",
            "url": "",
            "paginate": {
                "first":    "首页",
                "previous": "前一页",
                "next":     "后一页",
                "last":     "尾页"
            }
        }
    });
    //记录详情
    $('#maplist tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }else {
            // Open this row
            row.child(format(row.data()) ).show();
            tr.addClass('shown');
        }
    });
    //查看地图
    $('#maplist tbody').on('click', 'button.btn-warning', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var url="tileset?mapId="+row.data().id;
        window.open(url);
    });
    $('#maplist tbody').on('click', 'button.btn-success', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        curTileMap(row.data());
    });
    $('#maplist tbody').on('click', 'button.btn-danger', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        delTileMap(row.data().id);
    });
}
function loadMapList(){
    $.get(
        "/tilemap/list",
        function(json){
            table.clear();
            if(json.success){
                var list=json.data;
                table.clear();
                for(var i=0;i<list.length;i++){
                    var item=list[i];
                    table.row.add(item);
                }
            }
            table.draw();
        }
        ,"json");
}
//显示记录详情
function format (d) {
	var ts=[];
    ts.push('<table cellpadding="5" cellspacing="0" border="1" style="padding-left:50px;">');
    ts.push('<tr><td width="100px;"><dt>最小经度</dt></td><td>'+d.minX+'</td><td width="100px;"><dt>最小纬度</dt></td><td>'+d.minY+'</td></tr>');
    ts.push('<tr><td><dt>最大经度</dt></td><td>'+d.maxX+'</td><td><dt>最大纬度</dt></td><td>'+d.maxY+'</td></tr>');
    ts.push('<tr><td><dt>原点经度</dt></td><td>'+d.originX+'</td><td><dt>原点纬度</dt></td><td>'+d.originY+'</td></tr>');
    ts.push('<tr><td><dt>瓦片类型</dt></td><td>'+d.tileType+'</td><td><dt>瓦片文件后缀</dt></td><td>'+d.suffix+'</td></tr>');
    if(d.kind==5){
        ts.push('<tr><td><dt>记录日期</dt></td><td>'+d.recordDate+'</td></tr>');
    }else if(d.kind==6){
        ts.push('<tr><td><dt>属性</dt></td><td>'+d.prop+'</td></tr>');
    }

    var template;
    if(d.serviceId==1){
        template="http://${mapserver}/xyz/1.0.0/"
            +d.name+"@EPSG:"+d.epsg+"@"+d.tileType
            +'/{x}/{y}/{z}.'+d.tileType;
    } else{
        template="http://${mapserver}/tms/1.0.0/"
            +d.name+"@EPSG:"+d.epsg+"@"+d.tileType
            +'/{z}/{x}/{y}.'+d.tileType;
    }
    ts.push('<tr><td><dt>URL模板</dt></td><td colspan="3">'+template+'</td></tr>');
    ts.push('</table>');
    return ts.join("");
}
function curTileMap(d){
    $("#m_id2").val(d.id);
    $("#m_name2").val(d.name);
    $("#m_memo2").val(d.memo);
    $("#m_serviceId2").select2("val",[d.serviceId]);
    $("#m_group2").select2("val",[d.group]);
    $("#m_kind2").select2("val",[d.kind]);
    if(d.kind==5){
        $("#m_recordDate2").parent().parent().show();
        $("#m_recordDate2").val(d.recordDate);
    }else if(d.kind==6){
        $("#m_prop2").parent().parent().show();
        $("#m_prop2").val(d.prop);
    }
    $("#m_epsg2").select2("val",[d.epsg]);
    $("#m_minx2").val(d.minX);
    $("#m_maxx2").val(d.maxX);
    $("#m_miny2").val(d.minY);
    $("#m_maxy2").val(d.maxY);
    $("#m_originX2").val(d.originX);
    $("#m_originY2").val(d.originY);
    $("#m_href2").val(d.href);
    $("#m_tileType2").select2("val",[d.tileType]);
    $("#m_suffix2").val(d.suffix);


}
function addTileMap(){
    $("#modal-add").modal('hide');
    var template;
    if($("#m_serviceId").val()==1){
        template="http://${mapserver}/xyz/1.0.0/"
            +$("#m_name").val()+"@EPSG:"+$("#m_epsg").val()+"@"+$("#m_tileType").val();
    }else{
        template="http://${mapserver}/tms/1.0.0"
            +$("#m_name").val()+"@EPSG:"+$("#m_epsg").val()+"@"+$("#m_tileType").val();
    }

    var jsondata={
        name:$("#m_name").val(),
        memo:$("#m_memo").val(),
        serviceId:$("#m_serviceId").val(),
        kind:$("#m_kind").val(),
        group:$("#m_group").val(),
        epsg:$("#m_epsg").val(),
        href:template,
        tileType:$("#m_tileType").val(),
        suffix:$("#m_suffix").val(),
        minX:$("#m_minx").val(),
        maxX:$("#m_maxx").val(),
        minY:$("#m_miny").val(),
        maxY:$("#m_maxy").val(),
        originX:$("#m_originX").val(),
        originY:$("#m_originY").val(),
        recordDate:$("#m_recordDate").val(),
        prop:$("#m_prop").val()
    };
    $.ajax({
        type: "POST",
        url: "/tilemap/add",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsondata),
        dataType: "json",
        success: function (json) {
            loadMapList();
        }
    });
    console.log()
    if($("#m_kind").val()==6){
        $.ajax({
            type: "GET",
            url: "/dataset/syncShp?layerName="+$("#m_name").val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                console.log(json);
            }
        });
    }
}
function editTileMap(){
    $("#modal-edit").modal('hide');
    var template;
    if($("#m_serviceId2").val()==1){
        template="http://${mapserver}/xyz/1.0.0/"
            +$("#m_name2").val()+"@EPSG:"+$("#m_epsg2").val()+"@"+$("#m_tileType2").val();
    }else{
        template="http://${mapserver}/tms/1.0.0"
            +$("#m_name2").val()+"@EPSG:"+$("#m_epsg2").val()+"@"+$("#m_tileType2").val();
    }
    var jsondata={
        id:$("#m_id2").val(),
        name:$("#m_name2").val(),
        memo:$("#m_memo2").val(),
        serviceId:$("#m_serviceId2").val(),
        kind:$("#m_kind2").val(),
        group:$("#m_group2").val(),
        epsg:$("#m_epsg2").val(),
        href:template,
        tileType:$("#m_tileType2").val(),
        suffix:$("#m_suffix2").val(),
        minX:$("#m_minx2").val(),
        maxX:$("#m_maxx2").val(),
        minY:$("#m_miny2").val(),
        maxY:$("#m_maxy2").val(),
        originX:$("#m_originX2").val(),
        originY:$("#m_originY2").val(),
        recordDate:$("#m_recordDate2").val(),
        prop:$("#m_prop2").val()
    };
    $.ajax({
        type: "POST",
        url: "/tilemap/save",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsondata),
        dataType: "json",
        success: function (json) {
            loadMapList();
        }
    });
}

function delTileMap(id){
    $.get(
        "/tilemap/del",
        {
            id:id
        },
        function(json){
            loadMapList();
        }
        ,"json");
}
