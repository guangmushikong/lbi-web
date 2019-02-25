
var table;
function init(){
    initTable();
    loadData();
}
function initTable(){
	table= $('#datasetlist').DataTable({
		"data":[],
        "dom": '<"top">rt<"bottom"ip><"clear">',
        "columns": [
            {"data": "id","title":"ID","width":"20","orderable":false},
            {"data": "name","title":"项目名称","width":"150"},
            {"data": "memo","title":"备注","width":"80"},
            {"data": null,"title":"记录日期","width":"80",
                "render": function (d) {
                    if(isEmpty(d.recordDate)) return '';
                    return d.recordDate;
                }},
            {"data": "group","title":"图层分组","width":"40"},
            {"data": "type","title":"数据类型","width":"40"},
            {"data": null,"title":"数据种类","width":"40",
                "render": function (d) {
                    if(d.kind==1) return '普通图层';
                    else if(d.kind==2) return '时序图层';
                    else return '';
                }},
            {"data": "createTime","title":"创建时间","width":"100","orderable":false},
            {"data": "modifyTime","title":"修改时间","width":"100","orderable":false},
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
    //查看地图
    $('#datasetlist tbody').on('click', 'i.fa-map', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var url="mapsets?mapid="+row.data().mapId;
        window.open(url);
    });

}
function loadData(){
    $.get(
        "/meta/datasets",
        function(json){
            if(json.success){
                var list=json.data;
                table.clear();
                for(var i=0;i<list.length;i++){
                    var item=list[i];
                    table.row.add(item);
                    console.log(item);
                }
                table.draw();
                
            }
        },"json");
}
