/*
 * JQuery zTree core 3.5.14
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2013-06-28
 */
(function($){
	var settings = {}, roots = {}, caches = {},
	//default consts of core
	_consts = {
		className: {
			BUTTON: "button",
			LEVEL: "level",
			ICO_LOADING: "ico_loading",
			SWITCH: "switch"
		},
		event: {
			NODECREATED: "ztree_nodeCreated",
			CLICK: "ztree_click",
			EXPAND: "ztree_expand",
			COLLAPSE: "ztree_collapse",
			ASYNC_SUCCESS: "ztree_async_success",
			ASYNC_ERROR: "ztree_async_error"
		},
		id: {
			A: "_a",
			ICON: "_ico",
			SPAN: "_span",
			SWITCH: "_switch",
			UL: "_ul"
		},
		line: {
			ROOT: "root",
			ROOTS: "roots",
			CENTER: "center",
			BOTTOM: "bottom",
			NOLINE: "noline",
			LINE: "line"
		},
		folder: {
			OPEN: "open",
			CLOSE: "close",
			DOCU: "docu"
		},
		node: {
			CURSELECTED: "curSelectedNode"
		}
	},
	//default setting of core
	_setting = {
		treeId: "",
		treeObj: null,
		view: {
			addDiyDom: null,
			autoCancelSelected: true,

			dblClickExpand: true,
			expandSpeed: "fast",
			fontCss: {},
			nameIsHTML: false,
			selectedMulti: true,
			showIcon: true,
			showLine: true,
			showTitle: true
		},
		data: {
			key: {
				children: "children",
				name: "name",
				title: "",
				url: "url"
			},
			simpleData: {
				enable: false,
				idKey: "id",
				pIdKey: "pId",
				rootPId: null
			},
			keep: {
				parent: false,
				leaf: false
			}
		},
		async: {
			enable: false,
			contentType: "application/x-www-form-urlencoded",
			type: "post",
			dataType: "text",
			url: "",
			autoParam: [],
			otherParam: [],
			dataFilter: null
		},
		callback: {
			beforeAsync:null,
			beforeClick:null,
			beforeDblClick:null,
			beforeRightClick:null,
			beforeMouseDown:null,
			beforeMouseUp:null,
			beforeExpand:null,
			beforeCollapse:null,
			beforeRemove:null,

			onAsyncError:null,
			onAsyncSuccess:null,
			onNodeCreated:null,
			onClick:null,
			onDblClick:null,
			onRightClick:null,
			onMouseDown:null,
			onMouseUp:null,
			onExpand:null,
			onCollapse:null,
			onRemove:null
		}
	},
	//default root of core
	//zTree use root to save full data
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		if (!r) {
			r = {};
			data.setRoot(setting, r);
		}
		r[setting.data.key.children] = [];
		r.expandTriggerFlag = false;
		r.curSelectedList = [];
		r.noSelection = true;
		r.createdNodes = [];
		r.zId = 0;
		r._ver = (new Date()).getTime();
	},
	//default cache of core
	_initCache = function(setting) {
		var c = data.getCache(setting);
		if (!c) {
			c = {};
			data.setCache(setting, c);
		}
		c.nodes = [];
		c.doms = [];
	},
	//default bindEvent of core
	_bindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.bind(c.NODECREATED, function (event, treeId, node) {
			tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
		});

		o.bind(c.CLICK, function (event, srcEvent, treeId, node, clickFlag) {
			tools.apply(setting.callback.onClick, [srcEvent, treeId, node, clickFlag]);
		});

		o.bind(c.EXPAND, function (event, treeId, node) {
			tools.apply(setting.callback.onExpand, [event, treeId, node]);
		});

		o.bind(c.COLLAPSE, function (event, treeId, node) {
			tools.apply(setting.callback.onCollapse, [event, treeId, node]);
		});

		o.bind(c.ASYNC_SUCCESS, function (event, treeId, node, msg) {
			tools.apply(setting.callback.onAsyncSuccess, [event, treeId, node, msg]);
		});

		o.bind(c.ASYNC_ERROR, function (event, treeId, node, XMLHttpRequest, textStatus, errorThrown) {
			tools.apply(setting.callback.onAsyncError, [event, treeId, node, XMLHttpRequest, textStatus, errorThrown]);
		});
	},
	_unbindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.unbind(c.NODECREATED)
		.unbind(c.CLICK)
		.unbind(c.EXPAND)
		.unbind(c.COLLAPSE)
		.unbind(c.ASYNC_SUCCESS)
		.unbind(c.ASYNC_ERROR);
	},
	//default event proxy of core
	_eventProxy = function(event) {
		var target = event.target,
		setting = data.getSetting(event.data.treeId),
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null,
		tmp = null;

		if (tools.eqs(event.type, "mousedown")) {
			treeEventType = "mousedown";
		} else if (tools.eqs(event.type, "mouseup")) {
			treeEventType = "mouseup";
		} else if (tools.eqs(event.type, "contextmenu")) {
			treeEventType = "contextmenu";
		} else if (tools.eqs(event.type, "click")) {
			if (tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.SWITCH) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "switchNode";
			} else {
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (tmp) {
					tId = tools.getNodeMainDom(tmp).id;
					nodeEventType = "clickNode";
				}
			}
		} else if (tools.eqs(event.type, "dblclick")) {
			treeEventType = "dblclick";
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tools.getNodeMainDom(tmp).id;
				nodeEventType = "switchNode";
			}
		}
		if (treeEventType.length > 0 && tId.length == 0) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {tId = tools.getNodeMainDom(tmp).id;}
		}
		// event to node
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "switchNode" :
					if (!node.isParent) {
						nodeEventType = "";
					} else if (tools.eqs(event.type, "click")
						|| (tools.eqs(event.type, "dblclick") && tools.apply(setting.view.dblClickExpand, [setting.treeId, node], setting.view.dblClickExpand))) {
						nodeEventCallback = handler.onSwitchNode;
					} else {
						nodeEventType = "";
					}
					break;
				case "clickNode" :
					nodeEventCallback = handler.onClickNode;
					break;
			}
		}
		// event to zTree
		switch (treeEventType) {
			case "mousedown" :
				treeEventCallback = handler.onZTreeMousedown;
				break;
			case "mouseup" :
				treeEventCallback = handler.onZTreeMouseup;
				break;
			case "dblclick" :
				treeEventCallback = handler.onZTreeDblclick;
				break;
			case "contextmenu" :
				treeEventCallback = handler.onZTreeContextmenu;
				break;
		}
		var proxyResult = {
			stop: false,
			node: node,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
	},
	//default init node of core
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		var r = data.getRoot(setting),
		childKey = setting.data.key.children;
		n.level = level;
		n.tId = setting.treeId + "_" + (++r.zId);
		n.parentTId = parentNode ? parentNode.tId : null;
		if (n[childKey] && n[childKey].length > 0) {
			if (typeof n.open == "string") n.open = tools.eqs(n.open, "true");
			n.open = !!n.open;
			n.isParent = true;
			n.zAsync = true;
		} else {
			n.open = false;
			if (typeof n.isParent == "string") n.isParent = tools.eqs(n.isParent, "true");
			n.isParent = !!n.isParent;
			n.zAsync = !n.isParent;
		}
		n.isFirstNode = isFirstNode;
		n.isLastNode = isLastNode;
		n.getParentNode = function() {return data.getNodeCache(setting, n.parentTId);};
		n.getPreNode = function() {return data.getPreNode(setting, n);};
		n.getNextNode = function() {return data.getNextNode(setting, n);};
		n.isAjaxing = false;
		data.fixPIdKeyValue(setting, n);
	},
	_init = {
		bind: [_bindEvent],
		unbind: [_unbindEvent],
		caches: [_initCache],
		nodes: [_initNode],
		proxys: [_eventProxy],
		roots: [_initRoot],
		beforeA: [],
		afterA: [],
		innerBeforeA: [],
		innerAfterA: [],
		zTreeTools: []
	},
	//method of operate data
	data = {
		addNodeCache: function(setting, node) {
			data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = node;
		},
		getNodeCacheId: function(tId) {
			return tId.substring(tId.lastIndexOf("_")+1);
		},
		addAfterA: function(afterA) {
			_init.afterA.push(afterA);
		},
		addBeforeA: function(beforeA) {
			_init.beforeA.push(beforeA);
		},
		addInnerAfterA: function(innerAfterA) {
			_init.innerAfterA.push(innerAfterA);
		},
		addInnerBeforeA: function(innerBeforeA) {
			_init.innerBeforeA.push(innerBeforeA);
		},
		addInitBind: function(bindEvent) {
			_init.bind.push(bindEvent);
		},
		addInitUnBind: function(unbindEvent) {
			_init.unbind.push(unbindEvent);
		},
		addInitCache: function(initCache) {
			_init.caches.push(initCache);
		},
		addInitNode: function(initNode) {
			_init.nodes.push(initNode);
		},
		addInitProxy: function(initProxy, isFirst) {
			if (!!isFirst) {
				_init.proxys.splice(0,0,initProxy);
			} else {
				_init.proxys.push(initProxy);
			}
		},
		addInitRoot: function(initRoot) {
			_init.roots.push(initRoot);
		},
		addNodesData: function(setting, parentNode, nodes) {
			var childKey = setting.data.key.children;
			if (!parentNode[childKey]) parentNode[childKey] = [];
			if (parentNode[childKey].length > 0) {
				parentNode[childKey][parentNode[childKey].length - 1].isLastNode = false;
				view.setNodeLineIcos(setting, parentNode[childKey][parentNode[childKey].length - 1]);
			}
			parentNode.isParent = true;
			parentNode[childKey] = parentNode[childKey].concat(nodes);
		},
		addSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			if (!data.isSelectedNode(setting, node)) {
				root.curSelectedList.push(node);
			}
		},
		addCreatedNode: function(setting, node) {
			if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
				var root = data.getRoot(setting);
				root.createdNodes.push(node);
			}
		},
		addZTreeTools: function(zTreeTools) {
			_init.zTreeTools.push(zTreeTools);
		},
		exSetting: function(s) {
			$.extend(true, _setting, s);
		},
		fixPIdKeyValue: function(setting, node) {
			if (setting.data.simpleData.enable) {
				node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPId;
			}
		},
		getAfterA: function(setting, node, array) {
			for (var i=0, j=_init.afterA.length; i<j; i++) {
				_init.afterA[i].apply(this, arguments);
			}
		},
		getBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.beforeA.length; i<j; i++) {
				_init.beforeA[i].apply(this, arguments);
			}
		},
		getInnerAfterA: function(setting, node, array) {
			for (var i=0, j=_init.innerAfterA.length; i<j; i++) {
				_init.innerAfterA[i].apply(this, arguments);
			}
		},
		getInnerBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.innerBeforeA.length; i<j; i++) {
				_init.innerBeforeA[i].apply(this, arguments);
			}
		},
		getCache: function(setting) {
			return caches[setting.treeId];
		},
		getNextNode: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length-1; i<=l; i++) {
				if (p[childKey][i] === node) {
					return (i==l ? null : p[childKey][i+1]);
				}
			}
			return null;
		},
		getNodeByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return null;
			var childKey = setting.data.key.children;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					return nodes[i];
				}
				var tmp = data.getNodeByParam(setting, nodes[i][childKey], key, value);
				if (tmp) return tmp;
			}
			return null;
		},
		getNodeCache: function(setting, tId) {
			if (!tId) return null;
			var n = caches[setting.treeId].nodes[data.getNodeCacheId(tId)];
			return n ? n : null;
		},
		getNodeName: function(setting, node) {
			var nameKey = setting.data.key.name;
			return "" + node[nameKey];
		},
		getNodeTitle: function(setting, node) {
			var t = setting.data.key.title === "" ? setting.data.key.name : setting.data.key.title;
			return "" + node[t];
		},
		getNodes: function(setting) {
			return data.getRoot(setting)[setting.data.key.children];
		},
		getNodesByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childKey = setting.data.key.children,
			result = [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					result.push(nodes[i]);//alert(nodes[i][key]);
				}
				result = result.concat(data.getNodesByParam(setting, nodes[i][childKey], key, value));
			}
			return result;
		},
		getNodesByParamFuzzy: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childKey = setting.data.key.children,
			result = [];
			if(value==null)  return;//wanhm 2013-8-6
			try{value = value.toLowerCase();}catch(e){}//wanhm 2013-8-6  �����ݴ�
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (typeof nodes[i][key] == "string" && nodes[i][key].toLowerCase().indexOf(value)>-1) {
					result.push(nodes[i]);
				}
				result = result.concat(data.getNodesByParamFuzzy(setting, nodes[i][childKey], key, value));
			}
			return result;
		},
		getNodesByFilter: function(setting, nodes, filter, isSingle, invokeParam) {
			if (!nodes) return (isSingle ? null : []);
			var childKey = setting.data.key.children,
			result = isSingle ? null : [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (tools.apply(filter, [nodes[i], invokeParam], false)) {
					if (isSingle) {return nodes[i];}
					result.push(nodes[i]);
				}
				var tmpResult = data.getNodesByFilter(setting, nodes[i][childKey], filter, isSingle, invokeParam);
				if (isSingle && !!tmpResult) {return tmpResult;}
				result = isSingle ? tmpResult : result.concat(tmpResult);
			}
			return result;
		},
		getPreNode: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length; i<l; i++) {
				if (p[childKey][i] === node) {
					return (i==0 ? null : p[childKey][i-1]);
				}
			}
			return null;
		},
		getRoot: function(setting) {
			return setting ? roots[setting.treeId] : null;
		},
		getRoots: function() {
			return roots;
		},
		getSetting: function(treeId) {
			return settings[treeId];
		},
		getSettings: function() {
			return settings;
		},
		getZTreeTools: function(treeId) {
			var r = this.getRoot(this.getSetting(treeId));
			return r ? r.treeTools : null;
		},
		initCache: function(setting) {
			for (var i=0, j=_init.caches.length; i<j; i++) {
				_init.caches[i].apply(this, arguments);
			}
		},
		initNode: function(setting, level, node, parentNode, preNode, nextNode) {
			for (var i=0, j=_init.nodes.length; i<j; i++) {
				_init.nodes[i].apply(this, arguments);
			}
		},
		initRoot: function(setting) {
			for (var i=0, j=_init.roots.length; i<j; i++) {
				_init.roots[i].apply(this, arguments);
			}
		},
		isSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i]) return true;
			}
			return false;
		},
		removeNodeCache: function(setting, node) {
			var childKey = setting.data.key.children;
			if (node[childKey]) {
				for (var i=0, l=node[childKey].length; i<l; i++) {
					arguments.callee(setting, node[childKey][i]);
				}
			}
			data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = null;
		},
		removeSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i] || !data.getNodeCache(setting, root.curSelectedList[i].tId)) {
					root.curSelectedList.splice(i, 1);
					i--;j--;
				}
			}
		},
		setCache: function(setting, cache) {
			caches[setting.treeId] = cache;
		},
		setRoot: function(setting, root) {
			roots[setting.treeId] = root;
		},
		setZTreeTools: function(setting, zTreeTools) {
			for (var i=0, j=_init.zTreeTools.length; i<j; i++) {
				_init.zTreeTools[i].apply(this, arguments);
			}
		},
		transformToArrayFormat: function (setting, nodes) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			r = [];
			if (tools.isArray(nodes)) {
				for (var i=0, l=nodes.length; i<l; i++) {
					r.push(nodes[i]);
					if (nodes[i][childKey])
						r = r.concat(data.transformToArrayFormat(setting, nodes[i][childKey]));
				}
			} else {
				r.push(nodes);
				if (nodes[childKey])
					r = r.concat(data.transformToArrayFormat(setting, nodes[childKey]));
			}
			return r;
		},
		transformTozTreeFormat: function(setting, sNodes) {
			var i,l,
			key = setting.data.simpleData.idKey,
			parentKey = setting.data.simpleData.pIdKey,
			childKey = setting.data.key.children;
			if (!key || key=="" || !sNodes) return [];

			if (tools.isArray(sNodes)) {
				var r = [];
				var tmpMap = [];
				for (i=0, l=sNodes.length; i<l; i++) {
					tmpMap[sNodes[i][key]] = sNodes[i];
				}
				for (i=0, l=sNodes.length; i<l; i++) {
					if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
						if (!tmpMap[sNodes[i][parentKey]][childKey])
							tmpMap[sNodes[i][parentKey]][childKey] = [];
						tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
					} else {
						r.push(sNodes[i]);
					}
				}
				return r;
			}else {
				return [sNodes];
			}
		}
	},
	//method of event proxy
	event = {
		bindEvent: function(setting) {
			for (var i=0, j=_init.bind.length; i<j; i++) {
				_init.bind[i].apply(this, arguments);
			}
		},
		unbindEvent: function(setting) {
			for (var i=0, j=_init.unbind.length; i<j; i++) {
				_init.unbind[i].apply(this, arguments);
			}
		},
		bindTree: function(setting) {
			var eventParam = {
				treeId: setting.treeId
			},
			o = setting.treeObj;
			// for can't select text
			o.bind('selectstart', function(e){
					var n = e.originalEvent.srcElement.nodeName.toLowerCase();
					return (n === "input" || n === "textarea" );
			}).css({
				"-moz-user-select":"-moz-none"
			});
			o.bind('click', eventParam, event.proxy);
			o.bind('dblclick', eventParam, event.proxy);
			o.bind('mouseover', eventParam, event.proxy);
			o.bind('mouseout', eventParam, event.proxy);
			o.bind('mousedown', eventParam, event.proxy);
			o.bind('mouseup', eventParam, event.proxy);
			o.bind('contextmenu', eventParam, event.proxy);
		},
		unbindTree: function(setting) {
			var o = setting.treeObj;
			o.unbind('click', event.proxy)
			.unbind('dblclick', event.proxy)
			.unbind('mouseover', event.proxy)
			.unbind('mouseout', event.proxy)
			.unbind('mousedown', event.proxy)
			.unbind('mouseup', event.proxy)
			.unbind('contextmenu', event.proxy);
		},
		doProxy: function(e) {
			var results = [];
			for (var i=0, j=_init.proxys.length; i<j; i++) {
				var proxyResult = _init.proxys[i].apply(this, arguments);
				results.push(proxyResult);
				if (proxyResult.stop) {
					break;
				}
			}
			return results;
		},
		proxy: function(e) {
			var setting = data.getSetting(e.data.treeId);
			if (!tools.uCanDo(setting, e)) return true;
			var results = event.doProxy(e),
			r = true, x = false;
			for (var i=0, l=results.length; i<l; i++) {
				var proxyResult = results[i];
				if (proxyResult.nodeEventCallback) {
					x = true;
					r = proxyResult.nodeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
				if (proxyResult.treeEventCallback) {
					x = true;
					r = proxyResult.treeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
			}
			return r;
		}
	},
	//method of event handler
	handler = {
		onSwitchNode: function (event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (node.open) {
				if (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			} else {
				if (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			}
			return true;
		},
		onClickNode: function (event, node) {
			//alert('onClickNode');
			var setting = data.getSetting(event.data.treeId),
			clickFlag = ( (setting.view.autoCancelSelected && event.ctrlKey) && data.isSelectedNode(setting, node)) ? 0 : (setting.view.autoCancelSelected && event.ctrlKey && setting.view.selectedMulti) ? 2 : 1;
			if (tools.apply(setting.callback.beforeClick, [setting.treeId, node, clickFlag], true) == false) return true;
			if (clickFlag === 0) {
				view.cancelPreSelectedNode(setting, node);
			} else {
				view.selectNode(setting, node, clickFlag === 2);
			}
			setting.treeObj.trigger(consts.event.CLICK, [event, setting.treeId, node, clickFlag]);
			return true;
		},
		onZTreeMousedown: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeMouseDown, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseDown, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeMouseup: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeMouseUp, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseUp, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeDblclick: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeDblClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onDblClick, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeContextmenu: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeRightClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onRightClick, [event, setting.treeId, node]);
			}
			return (typeof setting.callback.onRightClick) != "function";
		}
	},
	//method of tools for zTree
	tools = {
		apply: function(fun, param, defaultValue) {
			if ((typeof fun) == "function") {
				return fun.apply(zt, param?param:[]);
			}
			return defaultValue;
		},
		canAsync: function(setting, node) {
			var childKey = setting.data.key.children;
			return (setting.async.enable && node && node.isParent && !(node.zAsync || (node[childKey] && node[childKey].length > 0)));
		},
		clone: function (obj){
			if (obj === null) return null;
			var o = tools.isArray(obj) ? [] : {};
			for(var i in obj){
				o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? arguments.callee(obj[i]) : obj[i]);
			}
			return o;
		},
		eqs: function(str1, str2) {
			return str1.toLowerCase() === str2.toLowerCase();
		},
		isArray: function(arr) {
			return Object.prototype.toString.apply(arr) === "[object Array]";
		},
		$: function(node, exp, setting) {
			if (!!exp && typeof exp != "string") {
				setting = exp;
				exp = "";
			}
			if (typeof node == "string") {
				return $(node, setting ? setting.treeObj.get(0).ownerDocument : null);
			} else {
				return $("#" + node.tId + exp, setting ? setting.treeObj : null);
			}
		},
		getMDom: function (setting, curDom, targetExpr) {
			if (!curDom) return null;
			while (curDom && curDom.id !== setting.treeId) {
				for (var i=0, l=targetExpr.length; curDom.tagName && i<l; i++) {
					if (tools.eqs(curDom.tagName, targetExpr[i].tagName) && curDom.getAttribute(targetExpr[i].attrName) !== null) {
						return curDom;
					}
				}
				curDom = curDom.parentNode;
			}
			return null;
		},
		getNodeMainDom:function(target) {
			return ($(target).parent("li").get(0) || $(target).parentsUntil("li").parent().get(0));
		},
		uCanDo: function(setting, e) {
			return true;
		}
	},
	//method of operate ztree dom
	view = {
		addNodes: function(setting, parentNode, newNodes, isSilent) {
			if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
				return;
			}
			if (!tools.isArray(newNodes)) {
				newNodes = [newNodes];
			}
			if (setting.data.simpleData.enable) {
				newNodes = data.transformTozTreeFormat(setting, newNodes);
			}
			if (parentNode) {
				var target_switchObj = $$(parentNode, consts.id.SWITCH, setting),
				target_icoObj = $$(parentNode, consts.id.ICON, setting),
				target_ulObj = $$(parentNode, consts.id.UL, setting);

				if (!parentNode.open) {
					view.replaceSwitchClass(parentNode, target_switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(parentNode, target_icoObj, consts.folder.CLOSE);
					parentNode.open = false;
					target_ulObj.css({
						"display": "none"
					});
				}

				data.addNodesData(setting, parentNode, newNodes);
				view.createNodes(setting, parentNode.level + 1, newNodes, parentNode);
				if (!isSilent) {
					view.expandCollapseParentNode(setting, parentNode, true);
				}
			} else {
				data.addNodesData(setting, data.getRoot(setting), newNodes);
				view.createNodes(setting, 0, newNodes, null);
			}
		},
		appendNodes: function(setting, level, nodes, parentNode, initFlag, openFlag) {
			if (!nodes) return [];
			var html = [],
			childKey = setting.data.key.children;
			for (var i = 0, l = nodes.length; i < l; i++) {
				var node = nodes[i];
				if (initFlag) {
					var tmpPNode = (parentNode) ? parentNode: data.getRoot(setting),
					tmpPChild = tmpPNode[childKey],
					isFirstNode = ((tmpPChild.length == nodes.length) && (i == 0)),
					isLastNode = (i == (nodes.length - 1));
					data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
					data.addNodeCache(setting, node);
				}

				var childHtml = [];
				if (node[childKey] && node[childKey].length > 0) {
					//make child html first, because checkType
					childHtml = view.appendNodes(setting, level + 1, node[childKey], node, initFlag, openFlag && node.open);
				}
				if (openFlag) {

					view.makeDOMNodeMainBefore(html, setting, node);
					view.makeDOMNodeLine(html, setting, node);
					data.getBeforeA(setting, node, html);
					view.makeDOMNodeNameBefore(html, setting, node);
					data.getInnerBeforeA(setting, node, html);
					view.makeDOMNodeIcon(html, setting, node);
					data.getInnerAfterA(setting, node, html);
					view.makeDOMNodeNameAfter(html, setting, node);
					data.getAfterA(setting, node, html);
					if (node.isParent && node.open) {
						view.makeUlHtml(setting, node, html, childHtml.join(''));
					}
					view.makeDOMNodeMainAfter(html, setting, node);
					data.addCreatedNode(setting, node);
				}
			}
			return html;
		},
		appendParentULDom: function(setting, node) {
			var html = [],
			nObj = $$(node, setting);
			if (!nObj.get(0) && !!node.parentTId) {
				view.appendParentULDom(setting, node.getParentNode());
				nObj = $$(node, setting);
			}
			var ulObj = $$(node, consts.id.UL, setting);
			if (ulObj.get(0)) {
				ulObj.remove();
			}
			var childKey = setting.data.key.children,
			childHtml = view.appendNodes(setting, node.level+1, node[childKey], node, false, true);
			view.makeUlHtml(setting, node, html, childHtml.join(''));
			nObj.append(html.join(''));
		},
		asyncNode: function(setting, node, isSilent, callback) {
			var i, l;
			if (node && !node.isParent) {
				tools.apply(callback);
				return false;
			} else if (node && node.isAjaxing) {
				return false;
			} else if (tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) == false) {
				tools.apply(callback);
				return false;
			}
			if (node) {
				node.isAjaxing = true;
				var icoObj = $$(node, consts.id.ICON, setting);
				icoObj.attr({"style":"", "class":consts.className.BUTTON + " " + consts.className.ICO_LOADING});
			}

			var tmpParam = {};
			for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
				var pKey = setting.async.autoParam[i].split("="), spKey = pKey;
				if (pKey.length>1) {
					spKey = pKey[1];
					pKey = pKey[0];
				}
				tmpParam[spKey] = node[pKey];
			}
			if (tools.isArray(setting.async.otherParam)) {
				for (i = 0, l = setting.async.otherParam.length; i < l; i += 2) {
					tmpParam[setting.async.otherParam[i]] = setting.async.otherParam[i + 1];
				}
			} else {
				for (var p in setting.async.otherParam) {
					tmpParam[p] = setting.async.otherParam[p];
				}
			}

			var _tmpV = data.getRoot(setting)._ver;
			$.ajax({
				contentType: setting.async.contentType,
				type: setting.async.type,
				url: tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
				data: tmpParam,
				dataType: setting.async.dataType,
				success: function(msg) {
					if (_tmpV != data.getRoot(setting)._ver) {
						return;
					}
					var newNodes = [];
					try {
						if (!msg || msg.length == 0) {
							newNodes = [];
						} else if (typeof msg == "string") {
							newNodes = eval("(" + msg + ")");
						} else {
							newNodes = msg;
						}
					} catch(err) {
						newNodes = msg;
					}

					if (node) {
						node.isAjaxing = null;
						node.zAsync = true;
					}
					view.setNodeLineIcos(setting, node);
					if (newNodes && newNodes !== "") {
						newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
						view.addNodes(setting, node, !!newNodes ? tools.clone(newNodes) : [], !!isSilent);
					} else {
						view.addNodes(setting, node, [], !!isSilent);
					}
					setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
					tools.apply(callback);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if (_tmpV != data.getRoot(setting)._ver) {
						return;
					}
					if (node) node.isAjaxing = null;
					view.setNodeLineIcos(setting, node);
					setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
				}
			});
			return true;
		},
		cancelPreSelectedNode: function (setting, node) {
			var list = data.getRoot(setting).curSelectedList;
			for (var i=0, j=list.length-1; j>=i; j--) {
				if (!node || node === list[j]) {
					$$(list[j], consts.id.A, setting).removeClass(consts.node.CURSELECTED);
					if (node) {
						data.removeSelectedNode(setting, node);
						break;
					}
				}
			}
			if (!node) data.getRoot(setting).curSelectedList = [];
		},
		createNodeCallback: function(setting) {
			if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
				var root = data.getRoot(setting);
				while (root.createdNodes.length>0) {
					var node = root.createdNodes.shift();
					tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
					if (!!setting.callback.onNodeCreated) {
						setting.treeObj.trigger(consts.event.NODECREATED, [setting.treeId, node]);
					}
				}
			}
		},
		createNodes: function(setting, level, nodes, parentNode) {
			if (!nodes || nodes.length == 0) return;
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			openFlag = !parentNode || parentNode.open || !!$$(parentNode[childKey][0], setting).get(0);
			root.createdNodes = [];
			var zTreeHtml = view.appendNodes(setting, level, nodes, parentNode, true, openFlag);
			if (!parentNode) {
				setting.treeObj.append(zTreeHtml.join(''));
			} else {
				var ulObj = $$(parentNode, consts.id.UL, setting);
				if (ulObj.get(0)) {
					ulObj.append(zTreeHtml.join(''));
				}
			}
			view.createNodeCallback(setting);
		},
		destroy: function(setting) {
			if (!setting) return;
			data.initCache(setting);
			data.initRoot(setting);
			event.unbindTree(setting);
			event.unbindEvent(setting);
			setting.treeObj.empty();
		},
		expandCollapseNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			if (!node) {
				tools.apply(callback, []);
				return;
			}
			if (root.expandTriggerFlag) {
				var _callback = callback;
				callback = function(){
					if (_callback) _callback();
					if (node.open) {
						setting.treeObj.trigger(consts.event.EXPAND, [setting.treeId, node]);
					} else {
						setting.treeObj.trigger(consts.event.COLLAPSE, [setting.treeId, node]);
					}
				};
				root.expandTriggerFlag = false;
			}
			if (!node.open && node.isParent && ((!$$(node, consts.id.UL, setting).get(0)) || (node[childKey] && node[childKey].length>0 && !$$(node[childKey][0], setting).get(0)))) {
				view.appendParentULDom(setting, node);
				view.createNodeCallback(setting);
			}
			if (node.open == expandFlag) {
				tools.apply(callback, []);
				return;
			}
			var ulObj = $$(node, consts.id.UL, setting),
			switchObj = $$(node, consts.id.SWITCH, setting),
			icoObj = $$(node, consts.id.ICON, setting);

			if (node.isParent) {
				node.open = !node.open;
				if (node.iconOpen && node.iconClose) {
					icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
				}

				if (node.open) {
					view.replaceSwitchClass(node, switchObj, consts.folder.OPEN);
					view.replaceIcoClass(node, icoObj, consts.folder.OPEN);
					if (animateFlag == false || setting.view.expandSpeed == "") {
						ulObj.show();
						tools.apply(callback, []);
					} else {
						if (node[childKey] && node[childKey].length > 0) {
							ulObj.slideDown(setting.view.expandSpeed, callback);
						} else {
							ulObj.show();
							tools.apply(callback, []);
						}
					}
				} else {
					view.replaceSwitchClass(node, switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(node, icoObj, consts.folder.CLOSE);
					if (animateFlag == false || setting.view.expandSpeed == "" || !(node[childKey] && node[childKey].length > 0)) {
						ulObj.hide();
						tools.apply(callback, []);
					} else {
						ulObj.slideUp(setting.view.expandSpeed, callback);
					}
				}
			} else {
				tools.apply(callback, []);
			}
		},
		expandCollapseParentNode: function(setting, node, expandFlag, animateFlag, callback) {
			if (!node) return;
			if (!node.parentTId) {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
				return;
			} else {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag);
			}
			if (node.parentTId) {
				view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, animateFlag, callback);
			}
		},
		expandCollapseSonNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			treeNodes = (node) ? node[childKey]: root[childKey],
			selfAnimateSign = (node) ? false : animateFlag,
			expandTriggerFlag = data.getRoot(setting).expandTriggerFlag;
			data.getRoot(setting).expandTriggerFlag = false;
			if (treeNodes) {
				for (var i = 0, l = treeNodes.length; i < l; i++) {
					if (treeNodes[i]) view.expandCollapseSonNode(setting, treeNodes[i], expandFlag, selfAnimateSign);
				}
			}
			data.getRoot(setting).expandTriggerFlag = expandTriggerFlag;
			view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback );
		},
		makeDOMNodeIcon: function(html, setting, node) {
			var nameStr = data.getNodeName(setting, node),
			name = setting.view.nameIsHTML ? nameStr : nameStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			html.push("<span id='", node.tId, consts.id.ICON,
				"' title='' treeNode", consts.id.ICON," class='", view.makeNodeIcoClass(setting, node),
				"' style='", view.makeNodeIcoStyle(setting, node), "'></span><span id='", node.tId, consts.id.SPAN,
				"'>",name,"</span>");
		},
		makeDOMNodeLine: function(html, setting, node) {
			html.push("<span id='", node.tId, consts.id.SWITCH,	"' title='' class='", view.makeNodeLineClass(setting, node), "' treeNode", consts.id.SWITCH,"></span>");
		},
		makeDOMNodeMainAfter: function(html, setting, node) {
			html.push("</li>");
		},
		makeDOMNodeMainBefore: function(html, setting, node) {
			html.push("<li id='", node.tId, "' class='", consts.className.LEVEL, node.level,"' tabindex='0' hidefocus='true' treenode>");
		},
		makeDOMNodeNameAfter: function(html, setting, node) {
			html.push("</a>");
		},
		makeDOMNodeNameBefore: function(html, setting, node) {
			var title = data.getNodeTitle(setting, node),
			url = view.makeNodeUrl(setting, node),
			fontcss = view.makeNodeFontCss(setting, node),
			fontStyle = [];
			for (var f in fontcss) {
				fontStyle.push(f, ":", fontcss[f], ";");
			}
			html.push("<a id='", node.tId, consts.id.A, "' class='", consts.className.LEVEL, node.level,"' treeNode", consts.id.A," onclick=\"", (node.click || ''),
				"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",view.makeNodeTarget(node),"' style='", fontStyle.join(''),
				"'");
			if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle) && title) {html.push("title='", title.replace(/'/g,"&#39;").replace(/</g,'&lt;').replace(/>/g,'&gt;'),"'");}
			html.push(">");
		},
		makeNodeFontCss: function(setting, node) {
			var fontCss = tools.apply(setting.view.fontCss, [setting.treeId, node], setting.view.fontCss);
			return (fontCss && ((typeof fontCss) != "function")) ? fontCss : {};
		},
		makeNodeIcoClass: function(setting, node) {
			var icoCss = ["ico"];
			if (!node.isAjaxing) {
				icoCss[0] = (node.iconSkin ? node.iconSkin + "_" : "") + icoCss[0];
				if (node.isParent) {
					icoCss.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
				} else {
					icoCss.push(consts.folder.DOCU);
				}
			}
			return consts.className.BUTTON + " " + icoCss.join('_');
		},
		makeNodeIcoStyle: function(setting, node) {
			var icoStyle = [];
			if (!node.isAjaxing) {
				var icon = (node.isParent && node.iconOpen && node.iconClose) ? (node.open ? node.iconOpen : node.iconClose) : node.icon;
				if (icon) icoStyle.push("background:url(", icon, ") 0 0 no-repeat;");
				if (setting.view.showIcon == false || !tools.apply(setting.view.showIcon, [setting.treeId, node], true)) {
					icoStyle.push("width:0px;height:0px;");
				}
			}
			return icoStyle.join('');
		},
		makeNodeLineClass: function(setting, node) {
			var lineClass = [];
			if (setting.view.showLine) {
				if (node.level == 0 && node.isFirstNode && node.isLastNode) {
					lineClass.push(consts.line.ROOT);
				} else if (node.level == 0 && node.isFirstNode) {
					lineClass.push(consts.line.ROOTS);
				} else if (node.isLastNode) {
					lineClass.push(consts.line.BOTTOM);
				} else {
					lineClass.push(consts.line.CENTER);
				}
			} else {
				lineClass.push(consts.line.NOLINE);
			}
			if (node.isParent) {
				lineClass.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
			} else {
				lineClass.push(consts.folder.DOCU);
			}
			return view.makeNodeLineClassEx(node) + lineClass.join('_');
		},
		makeNodeLineClassEx: function(node) {
			return consts.className.BUTTON + " " + consts.className.LEVEL + node.level + " " + consts.className.SWITCH + " ";
		},
		makeNodeTarget: function(node) {
			return (node.target || "_blank");
		},
		makeNodeUrl: function(setting, node) {
			var urlKey = setting.data.key.url;
			return node[urlKey] ? node[urlKey] : null;
		},
		makeUlHtml: function(setting, node, html, content) {
			html.push("<ul id='", node.tId, consts.id.UL, "' class='", consts.className.LEVEL, node.level, " ", view.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
			html.push(content);
			html.push("</ul>");
		},
		makeUlLineClass: function(setting, node) {
			return ((setting.view.showLine && !node.isLastNode) ? consts.line.LINE : "");
		},
		removeChildNodes: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children,
			nodes = node[childKey];
			if (!nodes) return;

			for (var i = 0, l = nodes.length; i < l; i++) {
				data.removeNodeCache(setting, nodes[i]);
			}
			data.removeSelectedNode(setting);
			delete node[childKey];

			if (!setting.data.keep.parent) {
				node.isParent = false;
				node.open = false;
				var tmp_switchObj = $$(node, consts.id.SWITCH, setting),
				tmp_icoObj = $$(node, consts.id.ICON, setting);
				view.replaceSwitchClass(node, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(node, tmp_icoObj, consts.folder.DOCU);
				$$(node, consts.id.UL, setting).remove();
			} else {
				$$(node, consts.id.UL, setting).empty();
			}
		},
		setFirstNode: function(setting, parentNode) {
			var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
			if ( childLength > 0) {
				parentNode[childKey][0].isFirstNode = true;
			}
		},
		setLastNode: function(setting, parentNode) {
			var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
			if ( childLength > 0) {
				parentNode[childKey][childLength - 1].isLastNode = true;
			}
		},
		removeNode: function(setting, node) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			parentNode = (node.parentTId) ? node.getParentNode() : root;

			node.isFirstNode = false;
			node.isLastNode = false;
			node.getPreNode = function() {return null;};
			node.getNextNode = function() {return null;};

			if (!data.getNodeCache(setting, node.tId)) {
				return;
			}

			$$(node, setting).remove();
			data.removeNodeCache(setting, node);
			data.removeSelectedNode(setting, node);

			for (var i = 0, l = parentNode[childKey].length; i < l; i++) {
				if (parentNode[childKey][i].tId == node.tId) {
					parentNode[childKey].splice(i, 1);
					break;
				}
			}
			view.setFirstNode(setting, parentNode);
			view.setLastNode(setting, parentNode);

			var tmp_ulObj,tmp_switchObj,tmp_icoObj,
			childLength = parentNode[childKey].length;

			//repair nodes old parent
			if (!setting.data.keep.parent && childLength == 0) {
				//old parentNode has no child nodes
				parentNode.isParent = false;
				parentNode.open = false;
				tmp_ulObj = $$(parentNode, consts.id.UL, setting);
				tmp_switchObj = $$(parentNode, consts.id.SWITCH, setting);
				tmp_icoObj = $$(parentNode, consts.id.ICON, setting);
				view.replaceSwitchClass(parentNode, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(parentNode, tmp_icoObj, consts.folder.DOCU);
				tmp_ulObj.css("display", "none");

			} else if (setting.view.showLine && childLength > 0) {
				//old parentNode has child nodes
				var newLast = parentNode[childKey][childLength - 1];
				tmp_ulObj = $$(newLast, consts.id.UL, setting);
				tmp_switchObj = $$(newLast, consts.id.SWITCH, setting);
				tmp_icoObj = $$(newLast, consts.id.ICON, setting);
				if (parentNode == root) {
					if (parentNode[childKey].length == 1) {
						//node was root, and ztree has only one root after move node
						view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.ROOT);
					} else {
						var tmp_first_switchObj = $$(parentNode[childKey][0], consts.id.SWITCH, setting);
						view.replaceSwitchClass(parentNode[childKey][0], tmp_first_switchObj, consts.line.ROOTS);
						view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
					}
				} else {
					view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
				}
				tmp_ulObj.removeClass(consts.line.LINE);
			}
		},
		replaceIcoClass: function(node, obj, newName) {
			if (!obj || node.isAjaxing) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[tmpList.length-1] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
		},
		replaceSwitchClass: function(node, obj, newName) {
			if (!obj) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.line.ROOT:
				case consts.line.ROOTS:
				case consts.line.CENTER:
				case consts.line.BOTTOM:
				case consts.line.NOLINE:
					tmpList[0] = view.makeNodeLineClassEx(node) + newName;
					break;
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[1] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
			if (newName !== consts.folder.DOCU) {
				obj.removeAttr("disabled");
			} else {
				obj.attr("disabled", "disabled");
			}
		},
		selectNode: function(setting, node, addFlag) {
			if (!addFlag) {
				view.cancelPreSelectedNode(setting);
			}
			$$(node, consts.id.A, setting).addClass(consts.node.CURSELECTED);
			data.addSelectedNode(setting, node);
		},
		setNodeFontCss: function(setting, treeNode) {
			var aObj = $$(treeNode, consts.id.A, setting),
			fontCss = view.makeNodeFontCss(setting, treeNode);
			if (fontCss) {
				aObj.css(fontCss);
			}
		},
		setNodeLineIcos: function(setting, node) {
			if (!node) return;
			var switchObj = $$(node, consts.id.SWITCH, setting),
			ulObj = $$(node, consts.id.UL, setting),
			icoObj = $$(node, consts.id.ICON, setting),
			ulLine = view.makeUlLineClass(setting, node);
			if (ulLine.length==0) {
				ulObj.removeClass(consts.line.LINE);
			} else {
				ulObj.addClass(ulLine);
			}
			switchObj.attr("class", view.makeNodeLineClass(setting, node));
			if (node.isParent) {
				switchObj.removeAttr("disabled");
			} else {
				switchObj.attr("disabled", "disabled");
			}
			icoObj.removeAttr("style");
			icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
			icoObj.attr("class", view.makeNodeIcoClass(setting, node));
		},
		setNodeName: function(setting, node) {
			var title = data.getNodeTitle(setting, node),
			nObj = $$(node, consts.id.SPAN, setting);
			nObj.empty();
			if (setting.view.nameIsHTML) {
				nObj.html(data.getNodeName(setting, node));
			} else {
				nObj.text(data.getNodeName(setting, node));
			}
			if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle)) {
				var aObj = $$(node, consts.id.A, setting);
				aObj.attr("title", !title ? "" : title);
			}
		},
		setNodeTarget: function(setting, node) {
			var aObj = $$(node, consts.id.A, setting);
			aObj.attr("target", view.makeNodeTarget(node));
		},
		setNodeUrl: function(setting, node) {
			var aObj = $$(node, consts.id.A, setting),
			url = view.makeNodeUrl(setting, node);
			if (url == null || url.length == 0) {
				aObj.removeAttr("href");
			} else {
				aObj.attr("href", url);
			}
		},
		switchNode: function(setting, node) {
			if (node.open || !tools.canAsync(setting, node)) {
				view.expandCollapseNode(setting, node, !node.open);
			} else if (setting.async.enable) {
				if (!view.asyncNode(setting, node)) {
					view.expandCollapseNode(setting, node, !node.open);
					return;
				}
			} else if (node) {
				view.expandCollapseNode(setting, node, !node.open);
			}
		}
	};
	
	
	// zTree defind
	$.fn.zTree = {
		consts : _consts,
		_z : {
			tools: tools,
			view: view,
			event: event,
			data: data
		},
		getZTreeObj: function(treeId) {
			var o = data.getZTreeTools(treeId);
			return o ? o : null;
		},
		destroy: function(treeId) {
			if (!!treeId && treeId.length > 0) {
				view.destroy(data.getSetting(treeId));
			} else {
				for(var s in settings) {
					view.destroy(settings[s]);
				}
			}
		},
		getFontCss : function(treeId, treeNode) {
			return (!!treeNode.highlight) ? {
				color : "#A60000",
				"font-weight" : "bold"
			} : {
				color : "#333",
				"font-weight" : "normal"
			};
	    },

	    /**
	     * 初始化ZTree树组件，供外部组件类调用
	     * 调用方法 $.fn.zTree.initTree(zTreeObj);
	     *  var zTreeObj = new Object();        // zTree参数集合对象说明
		 *	zTreeObj["multipleChoice"] = false; // 单选树或多选树 false 为单选，true为多选
	     *	zTreeObj["me"] = me;                 //(组件)的对象 me=this
		 *	zTreeObj["onClick"] = onClickNode;   // 树的单击事件注册,onClickNode为注册的函数名称
	     *	zTreeObj["zNodes"] = new Array();     // zTree数据集合对象
	     *  zTreeObj["reLoad"] = false;          //是否每次初始化时都重新去后台查询加载数据,true为是  false 为否
	     *  zTreeObj["prefixMethod"] = me.prefixMethod;		//jsonrpc类
		 *	zTreeObj["childrenMethod"] = me.childrenMethod; //jsonrpc类的方法
	     *	zTreeObj["defaultMethodArgs"] = defaultMethodArgs; //jsonrpc类方法的参数
		 *	zTreeObj["treeid"] = treeid;                     //ztree的底层容器id
		 *  zTreeObj["chkboxType"] = true;                   //ztree取消父与子复选框的连动关系
		 *  zTreeObj["clear"] = true;                       //ztree清空根节点
		 *  zTreeObj["displayToolbar"] = false;             //ztree  true显示工具查询栏  false 不显示
		 *  zTreeObj["_allowBranchSelection"] = false;      //false 不能选择中间节点  true 可以选择任意节点
		 *  zTreeObj["chkDisabled"] = true;                //多选树禁止复选框被编辑
		 *  zTreeObj["clearButton"] = false;                     //ztree工具查询栏不显示清空按钮
	     */
		initTree : function(zTreeObj){
		       var zNodes = zTreeObj.zNodes;     //zTree数据集合对象
		       /********构建ZTree的Setting对象（ZTree基本结构设置对象）start********************************************/
		       var displayToolbar = true;   //是否显示搜索工具条
		       if(typeof(zTreeObj.displayToolbar) == 'undefined'){		
		          displayToolbar = false;
		       }else{
		    	  displayToolbar = zTreeObj.displayToolbar;
		       }
		       var clearButton = true;             //是否显示清空按钮
		       if(typeof(zTreeObj.clearButton) == 'undefined'){		
		          clearButton = false;
		       }else{
		    	  clearButton = zTreeObj.clearButton;
		       }		  
			   if(zTreeObj.me == null){
						var me = new Object();
						me["id"] = zTreeObj.treeid;
						zTreeObj["me"] = me;
			   }
		       var	setting = {
					check : {
						enable : zTreeObj.multipleChoice, // 设置是否显示复选框 false为单选树 true为多选树
						chkStyle : "checkbox" // 显示为单选框，为radio就是复选框
					},
					data : {
						key : {
							title : "t"
						},
						simpleData : {
							enable : true
						}
					},
					// 可以在view中添加自定义对象,如 obj 为自定义对象
					view : {
						fontCss : this.getFontCss,
						obj : zTreeObj.me,  // 将组件类定义在此,全局函数将调用组件类中的方法
						displayToolbar : displayToolbar,  //true 显示查询条  false 不显示
						_allowBranchSelection : zTreeObj._allowBranchSelection,  //false 不能选择中间节点  true 可以选择任意节点
						clearButton : clearButton,				//清空按钮
						treeType : zTreeObj.treeType           //树的类型 leftTree左树 queryTree查询树 formTree表单树
					},
					search : {
						enable : true
					},
					callback : {
						onClick : zTreeObj.onClick , //树的单击事件注册
						onCheck : zTreeObj.onCheck,  //多选树选择事件
						onRightClick : zTreeObj.onrightclick, //树的右击事件
						confirm : zTreeObj.confirm,   //多选树的确定事件
						beforeCheck : zTreeObj.beforeCheck  //选 或 取消勾选 之前的事件回调函数
					}
				};
				if(typeof(zTreeObj.chkboxType) != 'undefined'){				
				  setting.check.chkboxType = { "Y" : "", "N" : "" };//zTree中check时，不影响子和父,取消父与子复选框的连动关系
				}
				zTreeObj["setting"] = setting;
				var _parentPanel = zTreeObj.parentPanel || $("#" + zTreeObj.treeid);
		       /********构建ZTree的Setting对象（ZTree基本结构设置对象）end********************************************/
		       		
					if(zTreeObj.reLoad){//每次初始化时重新查询数据
						   zNodes = new Array();
					       this.loadData(zTreeObj,zNodes);	
					}else{
						//清空根节点
						if(typeof(zTreeObj.clear) != 'undefined'){
						   $.fn.zTree.init(_parentPanel, zTreeObj.setting, zNodes);
						}else{
							if(typeof(zNodes) == 'undefined'){
								zNodes = new Array();
								this.loadData(zTreeObj,zNodes);
							}else if(zNodes == null){
							   zNodes = new Array();
							   $.fn.zTree.init(_parentPanel, zTreeObj.setting, zNodes);//用已经存在数据加载树
							}else{	
							
								if(zNodes.length == 0){//数据集为空，去后台查询数据
									this.loadData(zTreeObj,zNodes);	
								}else{
									$.fn.zTree.init(_parentPanel, zTreeObj.setting, zNodes);//用已经存在数据加载树
								}
							}
						}
					}
		},
		/**
		 * 为ZTree加载后台数据
		 */
		loadData : function(zTreeObj,zNodes) {
		    //树控件展开时去查询数据,如果已经查询过则不再查询数据,指定刷新树的除外
			//加载树数据的回调函数,给数据集合 zNodes赋值
			var _parentPanel = zTreeObj.parentPanel || $("#" + zTreeObj.treeid);
			var callBackFun = function(result) {
				for (var i = 0; i < result.length; i++) {
					var item = new Object();
					item["id"] = result[i].nodeID;
					item["pId"] = result[i].parentId;
					item["name"] = result[i].nodeName;
					item["t"] = result[i].nodeName;
					item["endFlag"] = result[i].endFlag;
					item["levelID"] = result[i].levelID;
					if(typeof(result[i].checked) != 'undefined'){
						item["checked"] = result[i].checked;
					}
					if(typeof(zTreeObj.chkDisabled) != 'undefined' 
								&& zTreeObj.chkDisabled == true){
						item["chkDisabled"] = true;
					}
					zNodes.push(item);
				}
				$.fn.zTree.init(_parentPanel, zTreeObj.setting, zNodes);// 加载树
				if(zTreeObj.treeid != 'queryPanelTree'){
				  $('#'+zTreeObj.treeid).hideLoading();  
				}
			}
			var me = this;
			me.callBackFun2 = function(result1) {//ajax后台查询回调函数
				var result = null;	//不使用zNodes JS对象提高效率
			    if ($.type(result1) === "array") {
						result = result1;
				} else {
					    result = Hq.JSON.parse(result1);
				}
				var _allowBranchSelection = null,open = null,chkDisabled = null;
				if(typeof(zTreeObj._allowBranchSelection != 'undefined')){//树节点的选择权限
					_allowBranchSelection = zTreeObj._allowBranchSelection;
				}			
				if(typeof(zTreeObj.open) != 'undefined' && zTreeObj.open == true){//是否展开第一个根节点
				   open = true;
				}
				if(typeof(zTreeObj.chkboxDisabled) != 'undefined' && zTreeObj.chkboxDisabled == true){//多选树禁止复选框被编辑
				   chkDisabled = true;
				}
				if(result == null || result.length == 0){
					result = new Array();
				}else{
				    for (var i = 0; i <result.length; i++) {						
								result[i]["t"] = result[i].name;
								result[i]["endFlag"] = result[i].isleaf;
								result[i]["levelID"] = result[i].code;
								result[i]["_allowBranchSelection"] = _allowBranchSelection;//树节点的选择权限
								result[i]["chkDisabled"] = chkDisabled; //多选树禁止复选框被编辑
					}
				}
			    $.fn.zTree.init(_parentPanel, zTreeObj.setting, result);// 加载树
			    if(zTreeObj.checkRoot || zTreeObj.open){		//根节点勾选功能和根节点展开功能在画完树后进行操作			
				    var zTree = $.fn.zTree.getZTreeObj(zTreeObj.treeid);
				    var nodes = zTree.getNodes();
				    if(zTreeObj.checkRoot)
					nodes[0].checked = true;
				    if(zTreeObj.open)
				    nodes[0].open = open;   //根节点是否展开
				    zTree.refresh();        //刷新树
			    }
			    if(zTreeObj.showLoading){
			    	if(zTreeObj.treeType == 'leftTree'){
					    me.hideShade(); 
			    	} if(zTreeObj.treeType == 'queryTree'){
			    		var options = new Object();
			    		zTreeObj.queryTreePosition["treediv"] = zTreeObj.treeid+"div"; //弹出层id
			    		options["queryTreePosition"] = zTreeObj.queryTreePosition; //查询树弹出层位置
			    		$('#'+zTreeObj.treeid).hideLoading(options); 
			    	}
			    }
			}
			try {
			    if(zTreeObj.showLoading){//需要引入js jquery.blockUI.js
			    	if(zTreeObj.treeType == 'leftTree'){
						this.showShade({
						css:{
							theme:false,
							top:'50%'
						},
						   message:"正在加载数据...<br/><img src='static/pub/js/container/themes/icons/loading.gif'>" 
					    }); 
			    	}else if(zTreeObj.treeType == 'queryTree'){
			    		var options = new Object();
			    		options["overlayZIndex"] = "1000000"; //遮罩层
			    		options["indicatorZIndex"] = "1000001";//遮罩图片
			    		options["queryTreePosition"] = zTreeObj.queryTreePosition; //查询树弹出层位置
			    		$('#'+zTreeObj.treeid).showLoading(options);
			    	}
				}

				if(zTreeObj.url == null){//通过jsonRPC方法去取数据
					if (typeof(zTreeObj.defaultMethodArgs) == 'undefined') {// 无参
						eval(zTreeObj.prefixMethod + "." + zTreeObj.childrenMethod)(callBackFun);
					} else { // 有参
						eval(zTreeObj.prefixMethod + "." + zTreeObj.childrenMethod)(
								callBackFun, zTreeObj.defaultMethodArgs);
					}					
				}else{//通过ajax方法去取数据

						Hq.pubAjax( {
							url : zTreeObj.url,	//后台地址
							type : 'post',
							cache : false,
							data : zTreeObj.params,//后台参数
							dataType : 'json',
							success : function(result) {
							   me.callBackFun2(result);  //ajax回调函数
							},
						    error: function(XMLHttpRequest, textStatus, errorThrown) {
								 debug('ZTree后台ajax查询出错！'+errorThrown);
							}
						});
				}
			} catch (e) {
				 debug('ZTree初始化出错:'+e.description);
			}
		},
		/**
		 * 显示遮罩
		 * @param {} o
		 */
	    showShade:function(o){
	        o=o||{};
	    	$.blockUI(o);
	    },
	     /**
		 * 因此遮罩
		 * @param {} o
		 */
	    hideShade : function() {
			 try{
			 	$.unblockUI();
			 }catch(e){}
	
		},
		//js打印日志
		debug : function ($obj) {
			if (window.console && window.console.log) {
				window.console.log('log: ' + $obj);
			}
        },

		init: function(obj, zSetting, zNodes) {
			Hq.require("placeholder");
			var setting = tools.clone(_setting);
			$.extend(true, setting, zSetting);
			setting.treeId = obj.attr("id");
			setting.treeObj = obj;
			setting.treeObj.empty();
			settings[setting.treeId] = setting;
			//For some older browser,(e.g., ie6)
			if(typeof document.body.style.maxHeight === "undefined") {
				setting.view.expandSpeed = "";
			}
			data.initRoot(setting);
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			zNodes = zNodes ? tools.clone(tools.isArray(zNodes)? zNodes : [zNodes]) : [];
			if (setting.data.simpleData.enable) {
				root[childKey] = data.transformTozTreeFormat(setting, zNodes);
			} else {
				root[childKey] = zNodes;
			}

            /********wanhm 2013-8-8  start ********************/
//			_gTreeTemp = obj;
			setting.view["_gTreeTemp"] = obj;
			var $tmp_= obj ;
			var domTree_ = $tmp_[0];//得到dom对象  class="ztree"的UL对象
		try{	
			var _gstrTreeId = domTree_.id;
			if(typeof(setting.search)!="undefined"){
				if(setting.search.enable==true){
					//设置过滤栏.............................
					var _oParent = domTree_.parentElement;
					var classid = "";
					try{
					    classid = setting.view.obj.id;  //传入类的id
					}catch(e){}
					var oDIVquery = document.getElementById('oDIVquery'+classid);
					if(zSetting.view.displayToolbar){//显示查询工具栏
						if (oDIVquery == null) {		//须判断，不为空才添加搜索栏	lixy		
							var oDIV_= document.createElement("DIV"); 
							_oParent.insertAdjacentElement('afterBegin',oDIV_);
							if(!zSetting.check.enable){	//单选树
								//清空按钮
								 var clearButStr = zSetting.view.clearButton == true ? "<span id='btn_"+classid+"' class='button-1-2' onclick='_deleteData(\""+classid+"\")'  style='cursor:hand;font-size: 12px;' title='清空数据'>清空</span>" : "";
								 //使用数组加join拼串以提高性能
				                 var arr = new Array();
				                 arr[0] = "<div id='oDIVquery"+classid+"' style='width:99.2%; background-color:#aeddff;border:1px silver solid;'>";
								 arr[1] = "<NOBR><label id='label_"+classid+"'  style='margin-right:5px;font-size: 12px;'>查找内容:</label>";
							     arr[2] = "<input id='input"+classid+"' style='width:auto; font-size: 12px;' onkeyup='_doTreeFilter(this)' placeholder='按照名称查找.....' onblur='_TreeFilterOnBlur(this)'>&nbsp;&nbsp;";	
								 arr[3] = "<span id='btn_"+classid+"' style='font-size: 12px;' class='button-1-2' onclick='_shiftTree(\""+classid+"\")'   title='回到树视图'>树型视图</span>&nbsp;&nbsp;";
								 arr[4] = clearButStr;
							     arr[5] = "</NOBR></div>";
								 oDIV_.innerHTML =	arr.join("");	
							}else{    //多选树 
								//清空按钮
								var clearButStr = zSetting.view.clearButton == true ? "<span id='btn_clear_"+classid+"' class='button-1-2' onclick='_deleteselectData(\""+classid+"\")'   title='清空数据'>清空</span>&nbsp;&nbsp;&nbsp;&nbsp;" : "";
								var arr = new Array();
								arr[0] = "<div id='oDIVquery"+classid+"' style='width:99.5%;background-color:#aeddff;border:1px silver solid;'>";
								arr[1] = "<NOBR><label id='label_"+classid+"'  style='width:65px;margin-right:5px;font-size: 12px;'>查找内容:</label>";
								arr[2] = "<input id='input"+classid+"' style='width:40%;font-size: 12px;' onkeyup='_doTreeFilter(this)' placeholder='按照名称查找.....'>&nbsp;&nbsp;&nbsp;&nbsp;";		
								arr[3] = "<span id='btn_backTree_"+classid+"' class='button-1-2' onclick='_shiftTree(\""+classid+"\")'   title='回到树视图'>返回树</span>&nbsp;&nbsp;&nbsp;&nbsp;";
								arr[4] = "<span id='btn_checkData_"+classid+"' class='button-1-2' onclick='_shift2CheckList(\""+classid+"\")'  title='所选数据'>所选数据</span>&nbsp;&nbsp;&nbsp;&nbsp;";
								arr[5] = clearButStr;
								arr[6] = "<span id='btn_ok_"+classid+"' class='button-1-2' onclick='_selectData(\""+classid+"\")'  title='选择确定'>确定</span>";
								arr[7] = "</NOBR></div>";
								oDIV_.innerHTML =	arr.join("");	
							}
							//oDIV_.style.width = domTree_.offsetWidth + "px";//obj.width();
						    oDIV_.style.top = _oParent.offsetTop;					
						}else{						
							//_shiftTree(classid);//展开树
						}
					}
  				   //设置  end.............................. 

                   //创建查询结果层         
				buildGTreeSearch(_gstrTreeId,setting,_oParent,domTree_);
				
			    //解决树在谷歌浏览器下再现横向滚动条的问题
				var isIE =   document.all ? 'IE' : 'others';//是否是IE
				if(isIE == 'IE'){
					 _oParent.style.removeAttribute('overflow');
				}else{
				     _oParent.style.removeProperty('overflow');					
				}
			  }
			}
			$("#input" + classid).placeholder() ;
		}catch(e){
			 debug('zTree的init方法出错:'+e.description);
		}
	        /********wanhm 2013-8-8  end   ********************/

			data.initCache(setting);
			event.unbindTree(setting);
			event.bindTree(setting);
			event.unbindEvent(setting);
			event.bindEvent(setting);

			var zTreeTools = {
				setting : setting,
				addNodes : function(parentNode, newNodes, isSilent) {
					if (!newNodes) return null;
					if (!parentNode) parentNode = null;
					if (parentNode && !parentNode.isParent && setting.data.keep.leaf) return null;
					var xNewNodes = tools.clone(tools.isArray(newNodes)? newNodes: [newNodes]);
					function addCallback() {
						view.addNodes(setting, parentNode, xNewNodes, (isSilent==true));
					}

					if (tools.canAsync(setting, parentNode)) {
						view.asyncNode(setting, parentNode, isSilent, addCallback);
					} else {
						addCallback();
					}
					return xNewNodes;
				},
				cancelSelectedNode : function(node) {
					view.cancelPreSelectedNode(setting, node);
				},
				destroy : function() {
					view.destroy(setting);
				},
				expandAll : function(expandFlag) {
					expandFlag = !!expandFlag;
					view.expandCollapseSonNode(setting, null, expandFlag, true);
					return expandFlag;
				},
				expandNode : function(node, expandFlag, sonSign, focus, callbackFlag) {
					if (!node || !node.isParent) return null;
					if (expandFlag !== true && expandFlag !== false) {
						expandFlag = !node.open;
					}
					callbackFlag = !!callbackFlag;

					if (callbackFlag && expandFlag && (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false)) {
						return null;
					} else if (callbackFlag && !expandFlag && (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false)) {
						return null;
					}
					if (expandFlag && node.parentTId) {
						view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, false);
					}
					if (expandFlag === node.open && !sonSign) {
						return null;
					}

					data.getRoot(setting).expandTriggerFlag = callbackFlag;
					if (!tools.canAsync(setting, node) && sonSign) {
						view.expandCollapseSonNode(setting, node, expandFlag, true, function() {
							if (focus !== false) {try{$$(node, setting).focus().blur();}catch(e){}}
						});
					} else {
						node.open = !expandFlag;
						view.switchNode(this.setting, node);
						if (focus !== false) {try{$$(node, setting).focus().blur();}catch(e){}}
					}
					return expandFlag;
				},
				getNodes : function() {
					return data.getNodes(setting);
				},
				getNodeByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodeByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodeByTId : function(tId) {
					return data.getNodeCache(setting, tId);
				},
				getNodesByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodesByParamFuzzy : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParamFuzzy(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodesByFilter: function(filter, isSingle, parentNode, invokeParam) {
					isSingle = !!isSingle;
					if (!filter || (typeof filter != "function")) return (isSingle ? null : []);
					return data.getNodesByFilter(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), filter, isSingle, invokeParam);
				},
				getNodeIndex : function(node) {
					if (!node) return null;
					var childKey = setting.data.key.children,
					parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
					for (var i=0, l = parentNode[childKey].length; i < l; i++) {
						if (parentNode[childKey][i] == node) return i;
					}
					return -1;
				},
				getSelectedNodes : function() {
					var r = [], list = data.getRoot(setting).curSelectedList;
					for (var i=0, l=list.length; i<l; i++) {
						r.push(list[i]);
					}
					return r;
				},
				isSelectedNode : function(node) {
					return data.isSelectedNode(setting, node);
				},
				reAsyncChildNodes : function(parentNode, reloadType, isSilent) {
					if (!this.setting.async.enable) return;
					var isRoot = !parentNode;
					if (isRoot) {
						parentNode = data.getRoot(setting);
					}
					if (reloadType=="refresh") {
						var childKey = this.setting.data.key.children;
						for (var i = 0, l = parentNode[childKey] ? parentNode[childKey].length : 0; i < l; i++) {
							data.removeNodeCache(setting, parentNode[childKey][i]);
						}
						data.removeSelectedNode(setting);
						parentNode[childKey] = [];
						if (isRoot) {
							this.setting.treeObj.empty();
						} else {
							var ulObj = $$(parentNode, consts.id.UL, setting);
							ulObj.empty();
						}
					}
					view.asyncNode(this.setting, isRoot? null:parentNode, !!isSilent);
				},
				refresh : function() {
					this.setting.treeObj.empty();
					var root = data.getRoot(setting),
					nodes = root[setting.data.key.children]
					data.initRoot(setting);
					root[setting.data.key.children] = nodes
					data.initCache(setting);
					view.createNodes(setting, 0, root[setting.data.key.children]);
				},
				removeChildNodes : function(node) {
					if (!node) return null;
					var childKey = setting.data.key.children,
					nodes = node[childKey];
					view.removeChildNodes(setting, node);
					return nodes ? nodes : null;
				},
				removeNode : function(node, callbackFlag) {
					if (!node) return;
					callbackFlag = !!callbackFlag;
					if (callbackFlag && tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return;
					view.removeNode(setting, node);
					if (callbackFlag) {
						this.setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node]);
					}
				},
				selectNode : function(node, addFlag) {
					if (!node) return;
					if (tools.uCanDo(setting)) {
						addFlag = setting.view.selectedMulti && addFlag;
						if (node.parentTId) {
							view.expandCollapseParentNode(setting, node.getParentNode(), true, false, function() {
								try{$$(node, setting).focus().blur();}catch(e){}
							});
						} else {
							try{$$(node, setting).focus().blur();}catch(e){}
						}
						view.selectNode(setting, node, addFlag);
					}
				},
				transformTozTreeNodes : function(simpleNodes) {
					return data.transformTozTreeFormat(setting, simpleNodes);
				},
				transformToArray : function(nodes) {
					return data.transformToArrayFormat(setting, nodes);
				},
				updateNode : function(node, checkTypeFlag) {
					if (!node) return;
					var nObj = $$(node, setting);
					if (nObj.get(0) && tools.uCanDo(setting)) {
						view.setNodeName(setting, node);
						view.setNodeTarget(setting, node);
						view.setNodeUrl(setting, node);
						view.setNodeLineIcos(setting, node);
						view.setNodeFontCss(setting, node);
					}
				}
			}
			root.treeTools = zTreeTools;
			data.setZTreeTools(setting, zTreeTools);

			if (root[childKey] && root[childKey].length > 0) {
				view.createNodes(setting, 0, root[childKey]);
			} else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
				view.asyncNode(setting);
			}
			return zTreeTools;
		}//end function init
	};

	var zt = $.fn.zTree,
	$$ = tools.$,
	consts = zt.consts;
})(jQuery);


/************wanhm 2013-8-8  begin *****************************************************************/


//切换到树形显示
function _shiftTree(treeid){
	
	var zTree = $.fn.zTree.getZTreeObj(treeid);
	var $tmp_= zTree.setting.view._gTreeTemp ;
	var v = $tmp_[0];
	$tmp_.show();
	//var _gTreeSearch = zTree.setting.view._gTreeSearch.hide() ;
	var _gTreeSearch = zTree.setting.view._gTreeSearch;
	if(_gTreeSearch != null){
	   _gTreeSearch.hide();
	}else{
	   alert('_gTreeSearch is null');
	}
	
}
/**
* 创建搜索结果层
*/
function buildGTreeSearch(_gstrTreeId,setting,_oParent,domTree_){
        var divResult = document.getElementById(_gstrTreeId+ "_search");
        if(divResult == null ){//须判断，不为空才添加搜索结果层	lixy
	        var  _divTreeRslt = document.createElement("DIV");
			_divTreeRslt.id = _gstrTreeId + "_search";//树的id加_search的后缀
			_divTreeRslt.style.cssText = "position:absolute;overflow:scroll;background-color:white;border: 1px solid #617775;";
			
			_oParent.appendChild(_divTreeRslt);//if use'document.body.appendChild',chrome会有问题
			_divTreeRslt.style.width = (domTree_.offsetWidth - 2 ) + "px";//obj.width();这样写chrome界面有问题
			if(domTree_.offsetHeight>0)
			_divTreeRslt.style.height = (domTree_.offsetHeight-2) + "px";//obj.height();
		    _divTreeRslt.style.left = 0;
		    var dimTmp_=document.getElementById(_divTreeRslt.id); //DOM对象
		    var $jSearch=$(dimTmp_); //jQuery对象
			$jSearch.hide();//隐藏查询结果层
			setting.view["_gTreeSearch"] = $jSearch;	
		    //非常重要的一点，如果是查询，则动态修改树的上边框
			domTree_.style.marginTop = "0px"
        }
        //树刷新后，未创建搜索结果层的处理
        if(setting.view._gTreeSearch == null){
             var dimTmp_=document.getElementById(divResult.id); //DOM对象
             var $jSearch=$(dimTmp_); //jQuery对象
			 //alert('_gTreeSearch  是空'+dimTmp_);
			 //$jSearch.hide();
			 setting.view["_gTreeSearch"] = $jSearch;
			 _shiftTree(_gstrTreeId);
					
		}
		
}

		
//所选数据:  切换到查看选择结果列表界面
function _shift2CheckList(classid){
	var zTree = $.fn.zTree.getZTreeObj(classid);
    var nodeList = zTree.getCheckedNodes(true);//获取所有选择节点
    var ischeck = zTree.setting.check.enable;  //是否多选 true是 false 否
	var arr = new Array();
	for( var i=0; i < nodeList.length; i++) {
		nodeList[i]["ischeck"] = ischeck;
		arr[i] = _getFilterItem(nodeList[i]);
	}
	var _sHtmlTmp_ = arr.join("");
	//创建选择结果层
	if(zTree.setting.view._selectResult == null){
		var divResult = document.getElementById(classid+ "_search");
		var dimTmp_=document.getElementById(divResult.id); //DOM对象
        var $jSearch=$(dimTmp_); //jQuery对象
	    zTree.setting.view["_selectResult"] = $jSearch;
	}
    var _selectResult = zTree.setting.view._selectResult;
	_selectResult.html(_sHtmlTmp_);
	
	var _gTreeSearch = zTree.setting.view._gTreeSearch;
	_gTreeSearch.hide();
	
	var _gTreeTemp = zTree.setting.view._gTreeTemp;
	_gTreeTemp.hide();
	//_gTreeSearch.show();
	_selectResult.show();
    //先得到dom对象，然后遍历div子对象，设置input的checked属性。
    //var $tmp_= _gTreeSearch ;
    var $tmp_= _selectResult ;
	var v = $tmp_[0];
	var arrTmp_ = v.childNodes;
	for(var i=0; i < arrTmp_.length; i++){
        var oTmp_= arrTmp_[i].childNodes[0];
		if(oTmp_.tagName=="INPUT"){
            oTmp_.checked = true;
		}
	}
}
//获取所有符合查询条件的查询结果
function _getFilterItem(node){
	var strRet_ ="";
    var arr = new Array();
	if(node.ischeck){
	   arr[0] = "<div id='"+node.classid + node.id + "' style='cursor:pointer' >";
	   arr[1] = "<input id='"+node.classid + node.id + "' type=checkbox  lang='"+node.classid+"' name='"+node.name+"' onclick='_setClickBg(this)' value='" + node.id + "' />";
	   arr[2] = node.name + "</div>";
	}else{
	   arr[0] = "<div id='"+node.classid + node.id + "' style='cursor:pointer' onclick='_setClickBg2(\""+node.id+","+node.name+","+node.levelID+","+node.classid+","+node.dbColumnName+","+node.columnName+"\")' >";
	   arr[1] = node.name + "</div>";
	}
	strRet_ = arr.join("");
	return strRet_;
}
//设置查询结果的点击事件(多选)
var _pre_rslt_span = null;
function _setClickBg(e){	
    //alert('勾选复选框'+e);
    //分析点击事件，如果是复选的勾选动作，则将它的值记录下来，存入到_gTreeSearch中
    var zTree = $.fn.zTree.getZTreeObj(e.lang);
    //alert(zTree.setting.view._gTreeSearch.nodeList);
    var nodeList = zTree.setting.view._gTreeSearch.nodeList;
    if(e.checked){//选中勾选
        for(var i = 0 ; i < nodeList.length; i++){
            if(nodeList[i].id == e.value){
               nodeList[i].checked = true;
               break;
            }
        }
    }else{//取消勾选
       for(var i = 0 ; i < nodeList.length; i++){
            if(nodeList[i].id == e.value){
               nodeList[i].checked = false;
               break;
            }
        }
    }
    //alert(nodeList+'==='+zTree.setting.view._gTreeSearch.nodeList);
    var oSpan_= event.srcElement;
	if(oSpan_.tagName!='DIV')  return;

	oSpan_.style.backgroundColor = "#FFE6B0";
	oSpan_.childNodes[0].checked = !(oSpan_.childNodes[0].checked);

	if(_pre_rslt_span!=null)    _pre_rslt_span.style.backgroundColor = "#FFFFFF";
    _pre_rslt_span = oSpan_;
}
/**
 * 查询结果点击事件(单选)
 * 封装好值对象，回调全局函数
 * :ZTreeFreeformItem类的onClickNode函数
 * :ZTreeItemEditor类的onClickNodeByZTreeEditor函数
 * author : lixy
 * date : 2013-08-19
 * @param {} str
 */
function _setClickBg2(str){
	//_setClickBg();
	var arr = str.split(',');
	var treeNode = new Object();
	treeNode["id"] = arr[0];
	treeNode["name"] = arr[1];
	treeNode["levelID"] = arr[2];
	treeNode["classid"] = arr[3];
	treeNode["dbColumnName"]=arr[4];
	treeNode["columnName"]=arr[5];	
	//不再根据id来判断点击后调用方法
	var zTree = $.fn.zTree.getZTreeObj(_gstrTreeId);
    zTree.setting.callback.onClick(this,_gstrTreeId,treeNode);
}
/**
 * 清空选项
 *  封装好值对象，回调全局函数
 * :ZTreeFreeformItem类的onClickNode函数
 * :ZTreeItemEditor类的onClickNodeByZTreeEditor函数
 * @param {} classid 类的id
 */
function _deleteData(classid){
   var treeNode = new Object();
   treeNode["id"] = '';
   treeNode["name"] = '';
   treeNode["levelID"] = '';
   treeNode["classid"] = classid;
	   //不再根据id来判断点击后调用方法
   var zTree = $.fn.zTree.getZTreeObj(classid);
   treeNode["optiontype"] = "delete";
   zTree.setting.callback.onClick(this,classid,treeNode);
	   
}
/**
 * 多选树的确定选中
 * @param {} classid
 */
function _selectData(classid){
	var zTree = $.fn.zTree.getZTreeObj(classid);
	//如果是树页面，则从树展示页面获得数据，如果是搜索结果页面，则需要从搜索结果页面上获得选中的数据
	var checkednodes = zTree.getCheckedNodes(true);
	var display = zTree.setting.view._gTreeTemp[0].style.display;//树展示页的显示状态
	if(display == 'block'){
		if(checkednodes.length == 0 && classid.indexOf("spfregiontree_id") == -1){
			alert('请选择一条数据！');
			return ;
		}	
	}else if(display == 'none'){//可能是搜索结果层或所选数据层正在显示中
	    //alert('从搜索结果层去找数据'+zTree.setting.view._gTreeSearch.nodeList);
	    //alert(zTree.setting.view._gTreeSearch[0].style.display+"=="+zTree.setting.view._selectResult[0].style.display);
	    if(zTree.setting.view._selectResult != null &&
	              zTree.setting.view._selectResult[0].style.display == 'block'){//所选数据层
	       zTree.setting.view._gTreeSearch[0].style.display = 'none';
	       if(checkednodes.length == 0 && classid.indexOf("spfregiontree_id") == -1){
			alert('请选择一条数据！');
			return ;
		   }	
	    }
	    if(zTree.setting.view._gTreeSearch[0].style.display == 'block'){//搜索结果层
		    var nodeList = zTree.setting.view._gTreeSearch.nodeList;
		    checkednodes = new Array();
		    for(var i = 0 ; i < nodeList.length; i++){
		        if(nodeList[i].checked){
		           checkednodes.push(nodeList[i]);
		        }
		    }
		    if(checkednodes.length == 0){
		     	alert('请从查询结果中选择数据！');
				return ;
		    }	    
	    }
	}
	//不再根据id来判断点击后调用方法
	zTree.setting.callback.confirm(zTree,classid,checkednodes,'confirm');
}
/**
 * 多选树的确定清空选项
 * @param {} classid
 */
function _deleteselectData(classid){
	  var zTree = $.fn.zTree.getZTreeObj(classid);
	   //不再根据id来判断点击后调用方法
	  zTree.setting.callback.confirm(zTree,classid,'','delete');
}

//全选查询结果
function _checkAllRslt(){
	var $tmp_= _gTreeSearch ;
	var domDiv_ = $tmp_[0];//得到dom对象
	var arrItem_= domDiv_.childNodes;
	for(var i=1;i<arrItem_.length;i++){
        arrItem_[i].childNodes[0].checked = _chkAll.checked;
	}
}
/**
 * 获得当前系统时间-毫秒
 * @return {TypeName} 
 */
function getTime(){
	var myDate = new Date();
	var time = myDate.getTime();	
	debug('当前时间:'+time);
	return time
}
var time = null;
/**
 * 是否再次执行某个方法
 * @return {TypeName}   true 可以执行 false 不再执行
 */
function exeagain(){
		var time2 = getTime();
		if(time == null){
			time = time2; 
		}else{
			var jiange = time2 - time;
			debug('两次调用间隔时间为：'+jiange);
			if(jiange < 50){  //间隔时间小于50毫秒则不执行
				return false;
			}
		}
		return true;
}
//执行过滤
function _doTreeFilter(edtFilter){

	var nodeList = [],nodeListf = [];//过滤后的集合和未过滤的集合
	_gstrTreeId = edtFilter.id.substring("input".length);
	var zTree = $.fn.zTree.getZTreeObj(_gstrTreeId);
	var classid = zTree.setting.view.obj.id;  //传入类的id
	var ischeck = zTree.setting.check.enable;  //是否多选 true是 false 否
	var _gTreeSearch = zTree.setting.view._gTreeSearch;

    var keyType = "name";

	var value = $.trim(edtFilter.value);	
	if(value == "" || value == null){
	  _shiftTree(_gstrTreeId);
	  return;
	}
//	debug("_doTreeFilter:开始执行过滤:id:"+edtFilter.id+"  过滤的值："+edtFilter.value);
    nodeListf = zTree.getNodesByParamFuzzy(keyType, value);//模糊搜索的结果集
	if(zTree.setting.view._allowBranchSelection == false){//只能选择末级节点,需要过滤非末级节点数据
		for(var i = 0 ; i < nodeListf.length; i++){
			if(!nodeListf[i].isParent){
				nodeList.push(nodeListf[i]);
			}
		}
	}else{
		nodeList = nodeListf;
	}
	_gTreeSearch["nodeList"] = nodeList;

   //设置全选过滤bar
	var arr = new Array();
	arr[0] = "<div id='"+_gstrTreeId+"_serach' style='background-color:buttonface;border:1px silver solid;margin:1px;font-size: 12px;'>";//去掉All选项

	for( var i=0; i < nodeList.length; i++) {
		nodeList[i]["classid"] = classid;
		nodeList[i]["ischeck"] = ischeck;
		arr[i+1] = _getFilterItem(nodeList[i]);
		//设置高亮,设置高亮功能 updateNode方法在IE下效率太慢，暂时不用该功能
		//nodeList[i].highlight = true;
//		zTree.updateNode(nodeList[i]);
	}
	arr[nodeList.length+1] = "</div>";
	var  _sHtmlTmp_ = arr.join("");
	_gTreeSearch.html(_sHtmlTmp_);
	var _gTreeTemp = zTree.setting.view._gTreeTemp;
	_gTreeTemp.hide();
//	debug("显示搜索层debug:"+_gstrTreeId);
	_gTreeSearch.show();
	
//	var height = _gTreeSearch.context.parentNode.childNodes[2].style.height;
	//解决第二次点击树形框展示高度不够的问题
	var height = _gTreeSearch.context.parentNode.style.height;
	if(height == "auto"){
	  _gTreeSearch.context.parentNode.style.height= "299px";
	}

	var treeType = zTree.setting.view.treeType;
	if(treeType != null){
		if(treeType == "leftTree"){//左侧树
			if(height == ""){
				_gTreeSearch.context.style.height= "400px";
				_gTreeSearch.context.style.overflow = "auto";
			}
		}
	}
	if(treeType == "leftTree")
    _gTreeSearch.context.style.height= "400px";
	 
	//_asycTree2Rslt();//勾选节点同步
}
/**
 * 搜索栏失去焦点事件
 * @param {} edtFilter
 */
function _TreeFilterOnBlur(edtFilter){
	//edtFilter.value = '';
}

//同步查询结果或是checked list view 到树
function _asycRslt2Tree(){
	var zTree = $.fn.zTree.getZTreeObj(_gstrTreeId);

   //先得到dom对象，然后遍历div子对象，得到input的checked属性。
    var $tmp_= _gTreeSearch ;
	var v = $tmp_[0];
	var arrTmp_ = v.childNodes;
	for(var i=0; i < arrTmp_.length; i++){
        var  chkTmp_ = arrTmp_[i].childNodes[0];
		if(chkTmp_.value==null||chkTmp_.value=="")  continue;//不加这句，对于查询结果向树切换时会报错
		
		//var node = zTree.getNodeByTId('treeDemo_16');//必须是dom的id，而不是node.id
		var node = zTree.getNodeByParam('id',chkTmp_.value);
        if(chkTmp_.checked==true||chkTmp_.checked=="true"){			
			zTree.checkNode(node, true, false);//param:node, checked, checkTypeFlag, callbackFlag
			node.highlight = true;
            zTree.updateNode(node);
		}else{
			zTree.checkNode(node, false, false);//param:node, checked, checkTypeFlag, callbackFlag
			node.highlight = false;
            zTree.updateNode(node);
		}
	}
}
//同步树的勾选数据到查询结果
function _asycTree2Rslt(){
	var arrObjCheck =  document.getElementsByName("_SearchRsltItem");
	var zTree = $.fn.zTree.getZTreeObj(_gstrTreeId);
	//alert(zTree);
	var nodes = null;
	if(zTree.getCheckedNodes == null){
	  nodes = zTree.getSelectedNodes();
	}else{
	  nodes = zTree.getCheckedNodes(true);
	}
	for(var i=0;i<arrObjCheck.length;i++){
		for(var j=0;j<nodes.length;j++){
			if(arrObjCheck[i].value==nodes[j].id){
				arrObjCheck[i].checked = true;
			}
	    }
	}    
}

//重写insertAdjacentElement()方法，因为firefox中没有该方法
//接下来，js代码中就可以直接调用该方法了，而无须再考虑是何种浏览器了。
/*********************************lixy start 2013-08-19******/
var HTMLElement = new Object;
var prototype = new Object;
HTMLElement["prototype"] = prototype;
//以上三行代码，是为防止IE下报HTMLElement未定义JS错,lixy
/*********************************lixy end 2013-08-19******/
HTMLElement.prototype.insertAdjacentElement=function(where,parsedNode){ 
    switch(where){ 
		case "beforeBegin": 
			this.parentNode.insertBefore(parsedNode,this); 
			break; 
		case "afterBegin": 
			this.insertBefore(parsedNode,this.firstChild); 
			break; 
		case "beforeEnd": 
			this.appendChild(parsedNode); 
			break; 
		case "afterEnd": 
			if(this.nextSibling) 
				this.parentNode.insertBefore(parsedNode,this.nextSibling); 
			else 
				this.parentNode.appendChild(parsedNode); 
			break; 
	} 
}

/************wanhm 2013-8-8  end ********************************************************************/
function debug($obj) {
			if (window.console && window.console.log) {
				window.console.log('log: ' + $obj);
			}
};