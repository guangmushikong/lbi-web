var geoserver;
var table;
function init(){
    geoserver=$("#m_mapserver").val();
    initTable();
    loadData();
}
function initTable(){
	table= $('#projectlist').DataTable({
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
            {"data": "memo","title":"备注","width":"40"},
            {"data": "createTime","title":"创建时间","width":"100"},
            {"data": "modifyTime","title":"修改时间","width":"100"},
            {
                "data": null,
                "width":"100",
                "orderable":false,
                "render": function (d) {
                    return '<button type="button" class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-edit">编辑</button>'
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
    $('#projectlist tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }else {
            // Open this row
            format(row);
            tr.addClass('shown');
        }
    });

    $('#projectlist tbody').on('click', 'button.btn-success', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        curProject(row.data());
    });
    $('#projectlist tbody').on('click', 'button.btn-danger', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        delProject(row.data().id);
    });
}

function curProject(d){
    $("#m_id2").val(d.id);
    $("#m_name2").val(d.name);
    $("#m_memo2").val(d.memo);
    $("#m_datasetids2").val(d.datasetIds);
}
function loadData(){
    $.get(
        "/project/list",
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
function format (row) {
    $.get(
        "/dataset/list",{
            projectId:row.data().id
        },
        function(json){
            if(json.success){
                var list=json.data;
                var ts=[];
                ts.push('<table cellpadding="5" cellspacing="0" border="1" style="padding-left:50px;">');
                ts.push('<tr><th><dt>ID</dt></th><th width="100px;"><dt>名称</dt></th><th width="200px;"><dt>备注</dt></th><th><dt>分组</dt></th><th width="100px;"><dt>类型</dt></th></tr>');
                for(var i=0;i<list.length;i++){
                    var item=list[i];
                    ts.push('<tr><td>'+item.id+'</td><td>'+item.name+'</td><td>'+item.memo+'</td><td>'+item.group+'</td><td>'+item.kind+'</td></tr>');
                }
                row.child(ts.join("")).show();
            }
        }
        ,"json");
}

function addProject(){
    $("#modal-add").modal('hide');
    var jsondata={
        name:$("#m_name").val(),
        memo:$("#m_memo").val(),
        datasetIds:$("#m_datasetids").val()
    };
    $.ajax({
        type: "POST",
        url: "/project/add",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsondata),
        dataType: "json",
        success: function (json) {
            loadData();
        }
    });
}

function editProject(){
    $("#modal-edit").modal('hide');
    var jsondata={
        id:$("#m_id2").val(),
        name:$("#m_name2").val(),
        memo:$("#m_memo2").val(),
        datasetIds:$("#m_datasetids2").val()
    };
    $.ajax({
        type: "POST",
        url: "/project/save",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsondata),
        dataType: "json",
        success: function (json) {
            loadData();
        }
    });
}

function delProject(id){
    $.get(
        "/project/del",
        {
            id:id
        },
        function(json){
            loadData();
        }
        ,"json");
}