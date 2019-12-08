var geoserver;
var table;
var roleDict;//角色字典
function init(){
    geoserver=$("#m_mapserver").val();
    initDict();
    initTable();
    loadData();
    $('#m_password').on('keyup click',function () {
        $("#m_md5").val($.md5($("#m_password").val()));
    });
}
function initDict(){
    roleDict=[];
    roleDict[1]="管理员";
    roleDict[2]="运维人员";
    roleDict[3]="普通用户";
    for(var key in roleDict){
        $("#m_role").append('<option value="'+key+'">'+roleDict[key]+'</option>');
        $("#m_role2").append('<option value="'+key+'">'+roleDict[key]+'</option>');
    }
    $("#m_role").select2();
    $("#m_role2").select2();
}
function initTable(){
	table= $('#userlist').DataTable({
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
            {"data": "username","title":"用户","width":"150"},
            {"data": "nick","title":"昵称","width":"40"},
            {"data": "mobile","title":"手机","width":"100"},
            {"data": "email","title":"邮箱","width":"100"},
            {"data": null,"title":"角色","width":"100",
                "render": function (d) {
                    return roleDict[d.roleId];
                }
            },
            {"data": "projectIds","title":"项目ID","width":"100"},
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
    $('#userlist tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }else {
            // Open this row
            row.child(format(row.data()) ).show();
            tr.addClass('shown');
        }
    });

    $('#userlist tbody').on('click', 'button.btn-success', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        curUser(row.data());
    });
    $('#userlist tbody').on('click', 'button.btn-danger', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        delUser(row.data().id);
    });
}

function curUser(d){
    $("#m_id2").val(d.id);
    $("#m_username2").val(d.username);
    $("#m_password2").val(d.password);
    $("#m_nick2").val(d.nick);
    $("#m_mobile2").val(d.mobile);
    $("#m_email2").val(d.email);
    $("#m_role2").select2("val",[d.roleId]);
    $("#m_projectIds2").val(d.projectIds);
}
function loadData(){
    $.get(
        "/user/list",
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
    ts.push('<tr><td width="100px;"><dt>用户</dt></td><td>'+d.username+'</td></tr>');
    ts.push('<tr><td><dt>密码</dt></td><td>'+d.password+'</td></tr>');
    ts.push('</table>');
    return ts.join("");
}

function addUser(){
    $("#modal-add").modal('hide');
    var jsondata={
        username:$("#m_username").val(),
        password:$("#m_md5").val(),
        nick:$("#m_nick").val(),
        mobile:$("#m_mobile").val(),
        email:$("#m_email").val(),
        roleId:$("#m_role").val(),
        projectIds:$("#m_projectIds").val()
    };

    $.ajax({
        type: "POST",
        url: "/user/add",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsondata),
        dataType: "json",
        success: function (json) {
            loadData();
        }
    });
}

function editUser(){
    $("#modal-edit").modal('hide');
    var jsondata={
        id:$("#m_id2").val(),
        username:$("#m_username2").val(),
        password:$("#m_password2").val(),
        nick:$("#m_nick2").val(),
        mobile:$("#m_mobile2").val(),
        email:$("#m_email2").val(),
        roleId:$("#m_role2").val(),
        projectIds:$("#m_projectIds2").val()
    };
    $.ajax({
        type: "POST",
        url: "/user/save",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsondata),
        dataType: "json",
        success: function (json) {
            loadData();
        }
    });
}

function delUser(id){
    $.get(
        "/user/del",
        {
            id:id
        },
        function(json){
            loadData();
        }
        ,"json");
}