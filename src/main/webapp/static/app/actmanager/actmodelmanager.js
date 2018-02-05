$(function() {
	//基于bootstrap自定义弹窗
	window.alert = mywin.alert;
	
	basePath=basePath();
    
	editUrl = basePath+"act/modeler.html?modelId=";
	//获取tokenID
	tokenID = getQueryString("tokenID");
	//设置提示框参数
	set_toastrOptions();
	
	//初始化Table
	var oTable = new TableInit();
	oTable.Init();

	//初始化Button的点击事件
	var oButtonInit = new ButtonInit();
	oButtonInit.Init();
	
	//初始化modal监听事件
	init_modal_event();
	
	//加载form校验规则
	init_formValidator();
	
});

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var res = window.location.search.substr(1).match(reg);
    if (res != null) return unescape(res[2]); return null;
}

function openEditor(){
	var form = $('#form_horizontal');
	var data = form.serializeObject();
	$('#form_horizontal').bootstrapValidator('validate');
	var flag = form.data('bootstrapValidator');
	if (!flag.isValid()) {
		toastr.error('含非法数据，修改后继续保存！', '错误提示');
        return false;
    }
	$.ajax({
        type : 'post',
        url : basePath+'actmodel/create',
        data : data,
        dataType : "json",
        cache : false,
        async:false,//此处必须为false（同步），否则新开窗口被浏览器拦截
        success : function(result){
        	window.open(editUrl+result);
        	resetForm();
        	$('#myModal').modal('hide');
        }
    });
}

/*
 * form转化为object
 * 
 */
jQuery.prototype.serializeObject=function(){
    var obj=new Object();  
    $.each(this.serializeArray(),function(index,param){
        if(!(param.name in obj)){  
            obj[param.name]=param.value;  
        }  
    });  
    return obj;  
};  

function init_formValidator(){
	 $("form").bootstrapValidator({
         message:'This value is not valid',
//         定义未通过验证的状态图标
         feedbackIcons: {/*输入框不同状态，显示图片的样式*/
        	 valid: 'glyphicon glyphicon-ok', 
             invalid: 'glyphicon glyphicon-exclamation-sign',
             validating: 'glyphicon glyphicon-refresh'
         },
//         字段验证
         fields:{
        	 name:{
                 message:'非法',
                 validators:{
                     notEmpty:{
                         message:'<center>模型名称不能为空</center>'
                     }
                 }
             },
             key:{
                 message:'非法',
                 validators:{
                     notEmpty:{
                         message:'<center>模型标识不能为空</center>'
                     }
                 }
             },
             category:{
                 message:'非法',
                 validators:{
                	 notEmpty:{
                         message:'<center>模型描述不能为空</center>'
                     }
                 }
             }
         }
     })
}

function init_modal_event(){
	//modal拖拽
	$("#myModal").draggable({
//		handle: '.modal-header',
	    cursor: 'move',   
	    refreshPositions: false
	});
	
	//modal关闭
	$('#myModal').on('hide.bs.modal', function () {
		resetForm();
		$("#tb_models").bootstrapTable('refresh');
	});
}

function resetForm(){
	$("#form_horizontal").data('bootstrapValidator').destroy();
    $('#form_horizontal').data('bootstrapValidator', null);
    init_formValidator();
	$('#form_horizontal').get(0).reset();
}

function set_toastrOptions(){
	toastr.options.positionClass = 'toast-top-center';
	toastr.options.closeButton = true;
	toastr.options.timeOut = 3000; // How long the toast will display without user interaction
	toastr.options.extendedTimeOut = 1000; // How long the toast will display after a user hovers over it
	toastr.options.progressBar = true;
}

var ButtonInit = function() {
	var oInit = new Object();
	var postdata = {};

	oInit.Init = function() {
		//查询按钮
		$('#btn_query').click(function(){
			$("#tb_models").bootstrapTable('refresh', {
				name : $("#txt_search_name").val(),
				key : $("#txt_search_key").val()
			});
		});
		//新增按钮
		$('#btn_add').click(function(){
			$("#myModalLabel").text("新建模型");
			$('#myModal').modal();
		});
		//删除按钮
		$('#btn_delete').click(function(){
			var url = basePath+'actmodel/deleteBatch';
			var rows = $("#tb_models").bootstrapTable('getSelections');
			if(rows == null || rows.length == 0){
				toastr.info("请选择一行数据进行修改...","提示");
				return false;
			}
			var array = [];
			$.each(rows,function(i,row){
				array.push(row.id);
			});
			mywin.confirm({ message: "确定删除模型？" }).on(function(e) {
				operateAjax(url,'DELETE',JSON.stringify(array));
			});
		});
		
	};
	return oInit;
}

var TableInit = function() {
	var oTableInit = new Object();
	//初始化Table
	oTableInit.Init = function() {
		$('#tb_models').bootstrapTable({
			url : basePath+'actmodel/list.do', //请求后台的URL（*）
			method : 'get', //请求方式（*）
			toolbar : '#toolbar', //工具按钮用哪个容器
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination : true, //是否显示分页（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : oTableInit.queryParams, //传递参数（*）
//			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//			pageNumber : 1, //初始化加载第一页，默认第一页
//			pageSize : 10, //每页的记录行数（*）
//			pageList : [ 10, 25, 50, 100 ], //可供选择的每页的行数（*）
			search : true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
			strictSearch : false,
			showColumns : true, //是否显示所有的列
			showRefresh : true, //是否显示刷新按钮
			minimumCountColumns : 2, //最少允许的列数
			clickToSelect : true, //是否启用点击选中行
			height : 650, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "id", //每一行的唯一标识，一般为主键列
			showToggle : true, //是否显示详细视图和列表视图的切换按钮
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			onLoadSuccess: function(){  //加载成功时执行  
                $("#tb_models th").css("text-align","center");  //设置表头内容居中
                $("#tb_models td").css("text-align","center"); 	//水平居中
                $("#tb_models td").css("vertical-align","middle");  //垂直居中
            },
            onLoadError: function(){  //加载失败时执行  
            	toastr.error("加载表格数据异常","错误提示！");
            },
			columns : [ {
                formatter: function (value, row, index) {  
                    return index+1;  
                }
            },{
				checkbox : true
			}, {
				field : 'id',
				title : '模型ID',
				sortable : true
			}, {
				field : 'name',
				title : '模型名称',
				sortable : true
			}, {
				field : 'key',
				title : '模型标识',
				sortable : true
			}, {
				field : 'version',
				title : '版本号',
				sortable : true
			},{
				field : 'createTime',
				title : '创建时间',
				formatter: dateFormatter,
				sortable : true
			}, {
				field : 'lastUpdateTime',
				title : '最后更新时间',
				formatter: dateFormatter,
				sortable : true
			}, {
			    field: 'operate',
			    title: '操作',
			    events: operateEvents,
			    width : '20%',
			    formatter: operateFormatter
			}]
		});
	};
	
	//得到查询的参数
	oTableInit.queryParams = function(params) {
		var temp = {
			limit : params.limit, //页面大小
			offset : params.offset, //页码
			name : $("#txt_search_name").val(),
			key : $("#txt_search_key").val()
		};
		return temp;
	};
	return oTableInit;
}
/*
 * 操作列扩展
 */
function operateFormatter(value, row, index) {
	return [
		'<a class="design" href="javascript:void(0)" title="在线设计">',
		'<i class="glyphicon glyphicon-pencil"></i>在线设计',
		'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
		'<a class="deploy" href="javascript:void(0)" title="部署">',
		'<i class="glyphicon glyphicon-blackboard"></i>部署',
		'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
		'<a href="'+basePath+'actmodel/'+row.id+'/export" target="_blank">',
		'<i class="glyphicon glyphicon-export"></i>导出',
		'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
		'<a class="remove" href="javascript:void(0)" title="删除">',
		'<i class="glyphicon glyphicon-trash"></i>删除',
		'</a>',
	].join('');
}
/*
 * 操作列扩展点击事件
 */
window.operateEvents = {
	'click .remove' : function(e, value, row, index) {
		var url = basePath+'actmodel/'+row.id+'/delete';
		mywin.confirm({ message: "确定删除该模型？" }).on(function(e) {
			operateAjax(url,'DELETE',null);
		});
		return false;
	},
	'click .design' : function(e, value, row, index) {
		window.open(editUrl+row.id);
		return false;
	},
	'click .deploy' : function(e, value, row, index) {
		var url = basePath+'actmodel/'+row.id+'/deploy';
		operateAjax(url,'PUT',null);
		return false;
	}
}

/*
 * 操作列提交后台
 */
function operateAjax(url,type,params){
	$.ajax({
        type : type,
        url : url,
        data : params,
        dataType : "json",
        contentType:"application/json",
        cache : false,
        async:true,//true为异步，false为同步
        success : function(result){
        	if(result.success) toastr.success(result.rdata, '执行结果');
        	else toastr.error(result.rdata, '执行结果');
        	$("#tb_models").bootstrapTable('refresh');
        }
    });
}

function basePath(){
    //获取当前网址
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址
    var localhostPath = curWwwPath.substring(0, pos);
    //获取带"/"的项目名
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    //获取项目的basePath   http://localhost:9002/act/
    var basePath=localhostPath+projectName+"/";
    return basePath;
}

function dateFormatter(value,row,index){
	if (value == null) {
		return "";
    }
    var offlineTimeStr = new Date(value).format("yyyy-MM-dd hh:mm:ss");
    return offlineTimeStr;
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}