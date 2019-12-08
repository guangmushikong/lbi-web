var geoserver;
var table;
var groupDict; //图层分组字典
var kindDict;   //图层种类字典
function init(){
    geoserver=$("#m_mapserver").val();
    initDict();
    initTable();
    loadData();
}
function initDict(){
    groupDict=[];
    groupDict["L0"]="基础栅格图层";
    groupDict["L1"]="项目栅格图层";
    groupDict["L2"]="基础矢量图层";
    groupDict["L3"]="项目矢量图层";
    groupDict["L4"]="绘制图层";
    for(var key in groupDict){
        $("#m_group").append('<option value="'+key+'">'+groupDict[key]+'</option>');
        $("#m_group2").append('<option value="'+key+'">'+groupDict[key]+'</option>');
    }
    $("#m_group").select2();
    $("#m_group2").select2();

    kindDict=[];
    kindDict["1"]="普通图层";
    kindDict["2"]="时序图层";
    for(var key in kindDict){
        $("#m_kind").append('<option value="'+key+'">'+kindDict[key]+'</option>');
        $("#m_kind2").append('<option value="'+key+'">'+kindDict[key]+'</option>');
    }
    $("#m_kind").select2();
    $("#m_kind2").select2();

}
function initTable(){
	table= $('#datasetlist').DataTable({
		"data":[],
        "dom": '<"top">rt<"bottom"ip><"clear">',
        "columns": [
            {"data": "id","title":"ID","width":"20"},
            {"data": "name","title":"名称","width":"150"},
            {"data": "memo","title":"备注","width":"80"},
            {"data": null,"title":"记录日期","width":"80","orderable":false,
                "render": function (d) {
                    if(isEmpty(d.recordDate)) return '';
                    return d.recordDate;
                }},
            {"data": "mapId","title":"图层ID","width":"40","orderable":false},
            {"data": null,"title":"图层分组","width":"80",
                "render": function (d) {
                    if(isEmpty(d.group)) return '';
                    return groupDict[d.group];
                }},
            {"data": null,"title":"数据种类","width":"40",
                "render": function (d) {
                    if(isEmpty(d.kind)) return '';
                    return kindDict[d.kind];
                }},
            {"data": "createTime","title":"创建时间","width":"100"},
            {"data": "modifyTime","title":"修改时间","width":"100"},
            {
                "data": null,
                "width":"40",
                "orderable":false,
                "render": function (d) {
                    //return '<a class="btn btn-xs btn-warning" title="查看地图"><i class="fa fa-map"></i></a>';
                    return '<button type="button" class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-edit">编辑</button>'
                        +'&nbsp;<button type="button" class="btn btn-xs btn-danger">删除</button>';
                }
            }
        ],
        "pageLength": 10,
        "order": [0, 'asc' ],
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
    //查看地图
    /*$('#datasetlist tbody').on('click', 'i.fa-map', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var url="mapsets?mapid="+row.data().mapId;
        window.open(url);
    });*/

    $('#datasetlist tbody').on('click', 'button.btn-success', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        curDataSet(row.data());
    });

    $('#datasetlist tbody').on('click', 'button.btn-danger', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        delDataSet(row.data().id);
    });

}

function curDataSet(d){
    $("#m_id2").val(d.id);
    $("#m_name2").val(d.name);
    $("#m_memo2").val(d.memo);
    $("#m_recordDate2").val(d.recordDate);
    $("#m_mapid2").val(d.mapId);
    $("#m_kind2").select2("val",[d.kind]);
    $("#m_group2").select2("val",[d.group]);
}

function loadData(){
    $.get(
        "/dataset/list",
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

function addDataSet(){
    $("#modal-add").modal('hide');
    var jsondata={
        name:$("#m_name").val(),
        memo:$("#m_memo").val(),
        recordDate:$("#m_recordDate").val(),
        group:$("#m_group").val(),
        kind:$("#m_kind").val(),
        mapId:$("#m_mapid").val()
    };
    $.ajax({
        type: "POST",
        url: "/dataset/add",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsondata),
        dataType: "json",
        success: function (json) {
            loadData();
        }
    });
}

function editDataSet(){
    $("#modal-edit").modal('hide');
    var jsondata={
        id:$("#m_id2").val(),
        name:$("#m_name2").val(),
        memo:$("#m_memo2").val(),
        recordDate:$("#m_recordDate2").val(),
        group:$("#m_group2").val(),
        kind:$("#m_kind2").val(),
        mapId:$("#m_mapid2").val()
    };
    $.ajax({
        type: "POST",
        url: "/dataset/save",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsondata),
        dataType: "json",
        success: function (json) {
            loadData();
        }
    });
}

function delDataSet(id){
    $.get(
        "/dataset/del",
        {
            id:id
        },
        function(json){
            loadData();
        }
        ,"json");
}
