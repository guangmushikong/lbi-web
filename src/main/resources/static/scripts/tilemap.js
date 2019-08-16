var geoserver;
var table;
var serviceDict;
var groupDict;
var kindDict;
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
    kindDict[1]="Geoserver服务";
    kindDict[2]="OSS缓存图片";
    kindDict[3]="OSS时序缓存图片";
    kindDict[4]="本地缓存图片";
    kindDict[5]="本地时序缓存图片";
    kindDict[6]="PG图层";
    kindDict[7]="XYZ图层";
    for(var key in kindDict){
        $("#m_kind").append('<option value="'+key+'">'+kindDict[key]+'</option>');
        $("#m_kind2").append('<option value="'+key+'">'+kindDict[key]+'</option>');
    }
    $("#m_kind").select2();
    $("#m_kind2").select2();
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
            {"data": "title","title":"名称","width":"150"},
            {"data": "abstract","title":"摘要","width":"150"},
            {"data": null,"title":"协议","width":"40", "orderable":false,
                "render":function(d){
                    if(isEmpty(d.serviceId)) return '';
                    return serviceDict[d.serviceId];
                }},
            {"data": null,"title":"分组","width":"80",
                "render": function (d) {
                    if(isEmpty(d.group)) return '';
                    return groupDict[d.group];
                }},
            {"data": null,"title":"种类","width":"100", "orderable":false,
                "render":function(d){
                    if(isEmpty(d.kind)) return '';
                    return kindDict[d.kind];
                }},
            {"data": "srs","title":"空间参考","width":"100","orderable":false},
            {"data": "profile","title":"坐标系","width":"100","orderable":false},
            //{"data": "profile","title":"坐标系<button type='button' class='btn btn-default btn-sm' data-toggle='tooltip' title='mercator墨卡托投影坐标系,geodetic大地坐标系'><i class='fa fa-question'></i></button>","width":"100","orderable":false},

            {"data": "minZoom","title":"最小级别","width":"60","orderable":false},
            {"data": "maxZoom","title":"最大级别","width":"60","orderable":false},
            {
                "data": null,
                "width":"80",
                "orderable":false,
                "render": function () {
                    return '<button type="button" class="btn btn-xs btn-warning">地图集</button>'
                        +'&nbsp;<button type="button" class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-edit">编辑</button>'
                        +'&nbsp;<button type="button" class="btn btn-xs btn-danger">删除</button>';
                }
            }
        ],
        "pageLength": 10,
        "order": [2, 'asc' ],
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
    $('#maplist tbody').on('click', 'btn.btn-warning', function () {
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
    ts.push('<tr><td width="100px;"><dt>最小经度</dt></td><td>'+d.minX+'</td><td width="100px;"><dt>最小纬度</dt></td><td>'+d.minY+'</td><td width="100px;"><dt>最大经度</dt></td><td>'+d.maxX+'</td><td width="100px;"><dt>最大纬度</dt></td><td>'+d.maxY+'</td></tr>');
    ts.push('<tr><td><dt>原点经度</dt></td><td>'+d.originX+'</td><td><dt>原点纬度</dt></td><td>'+d.originY+'</td><td><dt>瓦片宽度</dt></td><td>'+d.width+'</td><td><dt>瓦片高度</dt></td><td>'+d.height+'</td></tr>');
    ts.push('<tr><td><dt>MimeType</dt></td><td>'+d.mimeType+'</td><td><dt>扩展名</dt></td><td>'+d.extension+'</td><td><dt>文件扩展名</dt></td><td>'+d.fileExtension+'</td></tr>');
    ts.push('<tr><td><dt>记录日期</dt></td><td>'+d.recordDate+'</td><td><dt>属性</dt></td><td>'+d.prop+'</td></tr>');
    var template=d.href;
    if(d.serviceId==1)template+='/{x}/{y}/{z}.'+d.extension;
    else template+='/{z}/{x}/{y}.'+d.extension;
    ts.push('<tr><td><dt>URL模板</dt></td><td colspan="7">'+template+'</td></tr>');
    ts.push('</table>');
    return ts.join("");
}
function curTileMap(d){
    $("#m_id2").val(d.id);
    $("#m_title2").val(d.title);
    $("#m_abstract2").val(d.abstract);
    $("#m_serviceId2").select2("val",[d.serviceId]);
    $("#m_group2").select2("val",[d.group]);
    $("#m_kind2").select2("val",[d.kind]);
    $("#m_srs2").val(d.srs);
    $("#m_profile2").val(d.profile);
    $("#m_minx2").val(d.minX);
    $("#m_maxx2").val(d.maxX);
    $("#m_miny2").val(d.minY);
    $("#m_maxy2").val(d.maxY);
    $("#m_originX2").val(d.originX);
    $("#m_originY2").val(d.originY);
    $("#m_href2").val(d.href);
    $("#m_mimeType2").val(d.mimeType);
    $("#m_extension2").val(d.extension);
    $("#m_fileExtension2").val(d.fileExtension);
    $("#m_recordDate2").val(d.recordDate);
    $("#m_prop2").val(d.prop);
}
function addTileMap(){
    $("#modal-add").modal('hide');
    var jsondata={
        title:$("#m_title").val(),
        abstract:$("#m_abstract").val(),
        serviceId:$("#m_serviceId").val(),
        kind:$("#m_kind").val(),
        group:$("#m_group").val(),
        srs:$("#m_srs").val(),
        profile:$("#m_profile").val(),
        href:$("#m_href").val(),
        width:256,
        height:256,
        mimeType:$("#m_mimeType").val(),
        minX:$("#m_minx").val(),
        maxX:$("#m_maxx").val(),
        minY:$("#m_miny").val(),
        maxY:$("#m_maxy").val(),
        originX:$("#m_originX").val(),
        originY:$("#m_originY").val(),
        extension:$("#m_extension").val(),
        fileExtension:$("#m_fileExtension").val(),
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
}

function delTileMap(id){
    $.get(
        "/tilemap/del",
        {
            id:id
        },
        function(json){
            loadData();
        }
        ,"json");
}
