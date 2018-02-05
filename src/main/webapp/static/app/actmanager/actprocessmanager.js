$(function() {
	//基于bootstrap自定义弹窗
	window.alert = mywin.alert;
	
	basePath=basePath();
    
	//流程设计器url
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

/*
 * 获取特定字符串tokenID
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var res = window.location.search.substr(1).match(reg);
    if (res != null) return unescape(res[2]); return null;
}

/*
 * 部署流程
 */
function uploadAndDeploy(){
	var form = $('#form_horizontal');
	$('#form_horizontal').bootstrapValidator('validate');
	var flag = form.data('bootstrapValidator');
	if (!flag.isValid()) {
		toastr.error('含非法数据，修改后继续保存！', '错误提示');
        return false;
    }
	var formData = new FormData();
	var fileObj = $("#FILEPATH")[0].files[0];
	formData.append("file",fileObj);
	formData.append("category",$("#CATEGORY").val());
	$.ajax({
        type : 'post',
        url : basePath+'actprocess/deploy',
        data : formData,
        // 告诉jQuery不要去处理发送的数据
        processData : false, 
        // 告诉jQuery不要去设置Content-Type请求头
        contentType : false,
        cache : false,
        async:false,
        success : function(result){
        	showResultMsg(result);
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

/*
 * form验证
 */
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
        	 category:{
                 message:'非法',
                 validators:{
                     notEmpty:{
                         message:'<center>不能为空</center>'
                     }
                 }
             },
             filePath:{
                 message:'非法',
                 validators:{
                     notEmpty:{
                         message:'<center>模型标识不能为空</center>'
                     }
                 }
             }
         }
     })
}

/*
 * dialog事件初始化
 */
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
		$("#tb_processes").bootstrapTable('refresh');
	});
}

/*
 * 重置form表单
 */
function resetForm(){
	$("#form_horizontal").data('bootstrapValidator').destroy();
    $('#form_horizontal').data('bootstrapValidator', null);
    init_formValidator();
	$('#form_horizontal').get(0).reset();
}

/*
 * toastr提示框设置
 */
function set_toastrOptions(){
	toastr.options.positionClass = 'toast-top-center';
	toastr.options.closeButton = true;
	toastr.options.timeOut = 3000; // How long the toast will display without user interaction
	toastr.options.extendedTimeOut = 1000; // How long the toast will display after a user hovers over it
	toastr.options.progressBar = true;
}

/*
 * 初始化按钮点击事件
 */
var ButtonInit = function() {
	var oInit = new Object();
	var postdata = {};

	oInit.Init = function() {
		//查询按钮
		$('#btn_query').click(function(){
			$("#tb_processes").bootstrapTable('refresh', {
				name : $("#txt_search_name").val(),
				selectVersion : $('#selectVersion option:selected').val()
			});
		});
		//新增按钮
		$('#btn_add').click(function(){
			$("#myModalLabel").text("应用本地流程");
			$('#myModal').modal();
		});
		
	};
	return oInit;
}
/*
 * table 初始化
 */
var TableInit = function() {
	var oTableInit = new Object();
	//初始化Table
	oTableInit.Init = function() {
		$('#tb_processes').bootstrapTable({
			url : basePath+'actprocess/list.do', //请求后台的URL（*）
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
                $("#tb_processes th").css("text-align","center");  //设置表头内容居中
                $("#tb_processes td").css("text-align","center"); 	//水平居中
                $("#tb_processes td").css("vertical-align","middle");  //垂直居中
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
				title : '流程ID',
				sortable : true,
				visible : false
			}, {
				field : 'deploymentId',
				title : '流程部署ID',
				sortable : true,
				visible : false
			}, {
				field : 'category',
				title : '流程类别',
				sortable : true,
				visible : false
			}, {
				field : 'name',
				title : '流程名称',
				sortable : true
			}, {
				field : 'key',
				title : '流程标识',
				sortable : true
			}, {
				field : 'version',
				title : '流程版本',
				formatter: function(value,row,index){
					return "V:"+value;
				},
				sortable : true
			},{
				field : 'resourceName',
				title : '流程原始文件',
				formatter: formatProcessXml,
				sortable : true
			}, {
				field : 'diagramResourceName',
				title : '流程图',
				formatter: formatProcessImg,
				sortable : true
			}, {
				field : 'deploymentTime',
				title : '部署时间',
				formatter: dateFormatter,
				sortable : true
			}, {
				field : 'suspended',
				title : '流程状态',
				sortable : true,
				formatter: function(value,row,index){
					if (value){
		                return '已挂起';
		            } else {
		                return '已激活';
		            }
				}
			}, {
			    field: 'operate',
			    title: '操作',
			    events: operateEvents,
			    width : '15%',
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
			selectVersion : $('#selectVersion option:selected').val()
		};
		return temp;
	};
	return oTableInit;
}
/*
 * 操作列扩展
 */
function operateFormatter(value, row, index) {
	var displayValue_hangup = row.suspended==false?'inline-block':'none';
	var displayValue_fire = row.suspended==true?'inline-block':'none';
	return [
		'<a class="hangup" href="javascript:void(0)" title="挂起" style="display:'+displayValue_hangup+'">',
		'<i class="glyphicon glyphicon-off"></i> 挂起',
		'</a>',
		'<a class="fire" href="javascript:void(0)" title="激活" style="display:'+displayValue_fire+'">',
		'<i class="glyphicon glyphicon-fire"></i> 激活',
		'</a>',
		'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
		'<a class="remove" href="javascript:void(0)" title="删除">',
		'<i class="glyphicon glyphicon-trash"></i> 删除',
		'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
		'<a class="convert" href="javascript:void(0)" title="转换为模型">',
		'<i class="glyphicon glyphicon-transfer"></i> 转换为模型',
		'</a>',
	].join('');
}
/*
 * 操作列扩展点击事件
 */
window.operateEvents = {
	'click .remove' : function(e, value, row, index) {
		var url = basePath+'actprocess/'+row.deploymentId+'/remove';
		mywin.confirm({ message: "此次删除会影响正在使用该流程的实例，确定删除？" }).on(function(e) {
			operateAjax(url,'DELETE');
		});
		return false;
	},
	'click .hangup' : function(e, value, row, index) {
		var url = basePath+'actprocess/update/'+row.id+'/suspend';
		mywin.confirm({ message: "此次操作会影响正在使用该流程的实例的流转与创建，确定继续？" }).on(function(e) {
			operateAjax(url,'PUT');
		});
		return false;
	},
	'click .fire' : function(e, value, row, index) {
		var url = basePath+'actprocess/update/'+row.id+'/active';
		operateAjax(url,'PUT');
		return false;
	},
	'click .convert' : function(e, value, row, index) {
		var url = basePath+'actprocess/'+row.id+'/convertToModel';
		operateAjax(url,'PUT');
		return false;
	}
}

/*
 * 操作列提交后台
 */
function operateAjax(url,type){
	$.ajax({
        type : type,
        url : url,
        cache : false,
        async:true,//true为异步，false为同步
        success : function(result){
        	showResultMsg(result);
        	$("#tb_processes").bootstrapTable('refresh');
        }
    });
}

/*
 * basePath
 */
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

/*
 * 时间列格式化
 */
function dateFormatter(value,row,index){
	if (value == null) {
		return "";
    }
    var offlineTimeStr = new Date(value).format("yyyy-MM-dd hh:mm:ss");
    return offlineTimeStr;
}

/*
 * 查看流程文件资源
 */
function formatProcessXml(value,row,index){
	var xmlstr = '<a target="_blank" href='+basePath+'actprocess/resource/'+row.id+'/xml>'+value+'</a>';
    return xmlstr;
}

/*
 * 查看流程图片超链接
 */
function formatProcessImg(value,row,index){
	var imgstr = '<a target="_blank" href='+basePath+'actprocess/resource/'+row.id+'/image>'+value+'</a>';
    return imgstr;
}

/*
 * 时间日期格式化
 */
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

/*
 * 下拉框值发生变化触发
 */
function selectChange(){
	$("#tb_processes").bootstrapTable('refresh', {
		name : $("#txt_search_name").val(),
		selectVersion : $('#selectVersion option:selected').val()
	});
}
/*
 * ajax success show message
 */
function showResultMsg(result){
	if(result.success) toastr.success(result.rdata, '执行结果');
	else toastr.error(result.rdata, '执行结果');
}