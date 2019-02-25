
var table;
function init(){
    initTable();
    loadData();
}
function initTable(){
	table= $('#projectlist').DataTable({
		"data":[],
        "dom": '<"top">rt<"bottom"ip><"clear">',
        "columns": [
            {"data": "id","title":"ID","width":"20","orderable":false},
            {"data": "name","title":"项目名称","width":"150"},
            {"data": "memo","title":"备注","width":"40"},
            {"data": "createTime","title":"创建时间","width":"100","orderable":false},
            {"data": "modifyTime","title":"修改时间","width":"100","orderable":false},

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


}
function loadData(){
    $.get(
        "/meta/projects",
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
