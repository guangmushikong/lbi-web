var geoserver="http://111.202.109.211:8080";
var table;
var token;
function init(){
    token=$.cookie('token');
    if(token==null){
        window.location.replace("/login");
    }
    $("#m_serviceId").select2();
    $("#m_layerGroup").select2();
	initMapTable();
	loadMapList();
    $("#m_layerGroup").change(function() {
        table.column(3).search($("#m_layerGroup").val()).draw();
    });
    $("#m_serviceId").change(function() {
        table.column(4).search($("#m_serviceId").val()).draw();
    });
    $('#filter_word').on('keyup click',function () {
        table.search($('#filter_word').val()).draw();
    });
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
			    "title":"#",
			    "defaultContent": '',
			    "width":"5"
			},
            {"data": "id","title":"ID","width":"20"},
            {"data": null,"title":"图层名","width":"150",
                "render":function(d){
                    if(d.abstract!=null)return '<span title="'+d.abstract + '">'+d.title+'</span>';
                    else return '<span>'+d.title+'</span>';
                }},
            {"data": "group","title":"图层组","width":"40"},
            {"data": null,"title":"协议","width":"100",
            	"orderable":false,
                "render":function(d){
                    if(d.serviceId==1)return 'XYZ';
                    else return 'TMS';
                }},
            {"data": "srs","title":"空间参考","width":"100","orderable":false},
            {"data": "profile","title":"坐标系<button type='button' class='btn btn-default btn-sm' data-toggle='tooltip' title='mercator墨卡托投影坐标系,geodetic大地坐标系'><i class='fa fa-question'></i></button>","width":"100","orderable":false},
            {"data": "mimeType","title":"MimeType","width":"100","orderable":false},
            {"data": "minZoom","title":"最小级别","width":"100","orderable":false},
            {"data": "maxZoom","title":"最大级别","width":"100","orderable":false},
            {
                "data": null,
                "width":"40",
                "title":"规格",
                "orderable":false,
                "render": function (d) {
                    return '<a class="btn btn-xs btn-info" title="服务规格"><i class="fa fa-eye"></i></a>';
                }
            },
            {
                "data": null,
                "width":"40",
                "title":"示例",
                "orderable":false,
                "render": function (d) {
                    return '<a class="btn btn-xs btn-warning" title="查看地图"><i class="fa fa-map"></i></a>';
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
    //服务规格
    $('#maplist tbody').on('click', 'i.fa-eye', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var url=row.data().href;
        window.open(url);
    });
    //查看地图
    $('#maplist tbody').on('click', 'i.fa-map', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var url="mapsets?mapid="+row.data().id;
        window.open(url);
    });
}
function loadMapList(){
    $.ajax({
        type: "GET",
        headers: {
            Authorization: token
        },
        url: geoserver+"/meta/maps",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
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
    });
}
//显示记录详情
function format (d) {
	var ts=[];
    ts.push('<table cellpadding="5" cellspacing="0" border="1" style="padding-left:50px;">');
    ts.push('<tr><td width="100px;"><dt>最小经度</dt></td><td>'+d.minX+'</td><td width="100px;"><dt>最小纬度</dt></td><td>'+d.minY+'</td></tr>');
    ts.push('<tr><td width="100px;"><dt>最大经度</dt></td><td>'+d.maxX+'</td><td width="100px;"><dt>最大纬度</dt></td><td>'+d.maxY+'</td></tr>');
    ts.push('<tr><td width="100px;"><dt>原点经度</dt></td><td>'+d.originX+'</td><td width="100px;"><dt>原点纬度</dt></td><td>'+d.originY+'</td></tr>');
    var template=d.href;
    if(d.serviceId==1)template+='/{x}/{y}/{z}.'+d.extension;
    else template+='/{z}/{x}/{y}.'+d.extension;
    ts.push('<tr><td width="100px;"><dt>URL模板</dt></td><td colspan="3">'+template+'</td></tr>');
    ts.push('</table>');
    return ts.join("");
}
