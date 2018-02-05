package com.tjhq.activiti.service.impl;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipInputStream;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamReader;

import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.editor.constants.ModelDataJsonConstants;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.Model;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tjhq.activiti.constants.Constants;
import com.tjhq.activiti.po.ActProcessDefinition;
import com.tjhq.activiti.service.IActProcessService;
import com.tjhq.commons.exception.ServiceException;

/**
 * 
 * @author liukai
 *
 */

@Service(value="actProcessService")
@Transactional(readOnly=true)
public class ActProcessServiceImpl implements IActProcessService {
	
	@Resource
	private RepositoryService repositoryService;
	@Resource
	private RuntimeService runtimeService;
	@Resource
	private TaskService taskService;
	@Resource(name="formOfActService")
	private FormService formService;
	@Resource
	private HistoryService historyService;
	@Resource
	private IdentityService identityService;
	
	private Logger logger = LogManager.getLogger(ActProcessServiceImpl.class);
	
	/*
	 * 查询流程定义列表
	 * @see com.tjhq.activiti.service.IWorkflowService#list(java.lang.String,java.lang.String, java.lang.String)
	 */
	public List<ActProcessDefinition> list(String selectVersion,String key,String name) throws ServiceException {
		List<ActProcessDefinition> list = new ArrayList<ActProcessDefinition>();
		try {
			//本系统中所有正式流程的key都以_开始
			ProcessDefinitionQuery definitionQuery = repositoryService.createProcessDefinitionQuery()
													.processDefinitionCategoryNotEquals(Constants.TEST_PROCDEF_CATEGORY);
			if(StringUtils.isNotEmpty(selectVersion)){
				if(selectVersion.equals("lastest"))
					definitionQuery = definitionQuery.latestVersion();
			}else{
				definitionQuery = definitionQuery.latestVersion();
			}
			if(StringUtils.isNotEmpty(name)){
				definitionQuery = definitionQuery.processDefinitionNameLike("%"+name+"%");
			}
			List<ProcessDefinition> defList = definitionQuery.orderByProcessDefinitionKey().desc().list();
			if(defList!=null && defList.size()>0){
				for(ProcessDefinition processDefinition : defList){
					ActProcessDefinition actProcessDef = new ActProcessDefinition();
					actProcessDef.setId(processDefinition.getId());
					actProcessDef.setCategory(processDefinition.getCategory());
					actProcessDef.setKey(processDefinition.getKey());
					actProcessDef.setName(processDefinition.getName());
					actProcessDef.setVersion(processDefinition.getVersion());
					actProcessDef.setSuspended(processDefinition.isSuspended());
					actProcessDef.setResourceName(processDefinition.getResourceName());
					actProcessDef.setDiagramResourceName(processDefinition.getDiagramResourceName());
					String deploymentId = processDefinition.getDeploymentId();
					Deployment deployment = repositoryService.createDeploymentQuery()
															.deploymentId(deploymentId)
															.singleResult();
					actProcessDef.setDeploymentId(deploymentId);
					actProcessDef.setDeploymentTime(deployment.getDeploymentTime());
					list.add(actProcessDef);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("", "查询流程定义列表发生异常", false);
		}
		return list;
	}
	
	/*
	 * 获取资源
	 * @see com.tjhq.activiti.service.IActProcessService#resourceRead(java.lang.String, java.lang.String)
	 */
	public InputStream resourceRead(String procDefId,String resType) throws ServiceException {

		if(StringUtils.isBlank(procDefId) || StringUtils.isBlank(resType)){
			throw new ServiceException("", "传入参数含有空值", false);
		}
		InputStream resourceAsStream = null;
		try {
			ProcessDefinition processDefinition = repositoryService
					.createProcessDefinitionQuery().processDefinitionId(procDefId)
					.singleResult();

			String resourceName = "";
			if (resType.equals("image")) {
				resourceName = processDefinition.getDiagramResourceName();
			} else if (resType.equals("xml")) {
				resourceName = processDefinition.getResourceName();
			}

			resourceAsStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(), resourceName);
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("", "获取资源文件发生异常", false);
		}
		return resourceAsStream;
	}
	
	/**
	 * 根据Model部署流程
	 */
	@Transactional(readOnly=false,rollbackFor=Exception.class)
	public String deploy(String id)  throws ServiceException{
		String message = "";
		try {
			Model modelData = repositoryService.getModel(id);
			if(modelData == null)
				throw new ServiceException("", "查询模型发生异常，检查模型是否存在，模型id："+id, false);
			BpmnJsonConverter jsonConverter = new BpmnJsonConverter();
			JsonNode editorNode = new ObjectMapper().readTree(repositoryService.getModelEditorSource(modelData.getId()));
			BpmnModel bpmnModel = jsonConverter.convertToBpmnModel(editorNode);
			BpmnXMLConverter xmlConverter = new BpmnXMLConverter();
			byte[] bpmnBytes = xmlConverter.convertToXML(bpmnModel);
			
			String processName = modelData.getName();
			if (!StringUtils.endsWith(processName, ".bpmn")){
				processName += ".bpmn";
			}
			logger.debug("模型名称:"+modelData.getName());
			ByteArrayInputStream in = new ByteArrayInputStream(bpmnBytes);
			Deployment deployment = repositoryService.createDeployment().name(modelData.getName())
					.addInputStream(processName, in).deploy();
			modelData.setDeploymentId(deployment.getId());
			repositoryService.saveModel(modelData);
			
			List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery()
											.deploymentId(deployment.getId())
											.list();
			if(list == null || list.size()<=0){
				throw new ServiceException("", "查询流程定义结果集为空",false);
			}
			for (ProcessDefinition processDefinition : list) {
				repositoryService.setProcessDefinitionCategory(processDefinition.getId(), modelData.getCategory());
				logger.debug("部署成功，流程ID=" + processDefinition.getId() + processDefinition.getName());
				message = "部署成功";
			}
		} catch (Exception e) {
			throw new ServiceException("","部署流程图发生异常，检查模型正确性，模型ID="+id, false);
		}
		return message;
	}
	
	/**
	 * 导出model的bpmn文件
	 * @throws ServiceException 
	 */
	public void export(String id, HttpServletResponse response) throws ServiceException {
		try {
			response.reset();
			Model modelData = repositoryService.getModel(id);
			if(modelData == null)
				throw new ServiceException("","导出失败，未查询到模型，模型ID="+id, false);
			BpmnJsonConverter jsonConverter = new BpmnJsonConverter();
			JsonNode editorNode = new ObjectMapper().readTree(repositoryService.getModelEditorSource(modelData.getId()));
			BpmnModel bpmnModel = jsonConverter.convertToBpmnModel(editorNode);
			BpmnXMLConverter xmlConverter = new BpmnXMLConverter();
			byte[] bpmnBytes = xmlConverter.convertToXML(bpmnModel);
			
			String filename = bpmnModel.getMainProcess().getId() + ".bpmn";
			response.setContentType("application/force-download");
			response.setHeader("Content-Disposition", "attachment; filename=" + filename);
			//response.setHeader("Pragma", "No-cache");
			//response.setHeader("Expires", "0");

			ByteArrayInputStream in = new ByteArrayInputStream(bpmnBytes);
			ServletOutputStream out = response.getOutputStream();
			IOUtils.copy(in, out);
			//response.addHeader("Content-Length", "" + 100);
			out.flush();
			out.close();
			//response.flushBuffer();
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("","导出模型原始文件失败，模型ID:"+id, false);
		}
		
	}
	
	/*
	 * 删除模型
	 * @see com.tjhq.activiti.service.IActModelService#delete(java.lang.String)
	 */
	@Transactional(readOnly=false,rollbackFor=Exception.class)
	public void delete(String id) throws ServiceException {
		try {
			repositoryService.deleteModel(id);
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("","删除模型失败，模型ID="+id, false);
		}
	}

	/*
	 * 批量删除模型
	 * @see com.tjhq.activiti.service.IActModelService#deleteBatch(java.util.List)
	 */
	@Transactional(readOnly=false,rollbackFor=Exception.class)
	public void deleteBatch(List<String> modelIds) throws ServiceException {
		if(modelIds == null || modelIds.size()<=0){
			throw new ServiceException("","删除模型失败，入参为空", false);
		}
		try {
			for(String modelId : modelIds){
				repositoryService.deleteModel(modelId);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("","删除模型发生异常", false);
		}
	}

	/*
	 * 部署本地流程
	 * @see com.tjhq.activiti.service.IActProcessService#deploy(java.lang.String, org.springframework.web.multipart.MultipartFile)
	 */
	@Transactional(readOnly=false,rollbackFor=Exception.class)
	public String deploy(String category, MultipartFile file) throws ServiceException {
		String resMsg = "";
		String fileName = file.getOriginalFilename();
		if (StringUtils.isBlank(fileName)){
			throw new ServiceException("","未选择流程文件", false);
		}
		try {
			InputStream fileInputStream = file.getInputStream();
			Deployment deployment = null;
			String extension = FilenameUtils.getExtension(fileName);
			if (extension.equals("zip") || extension.equals("bar")) {
				ZipInputStream zip = new ZipInputStream(fileInputStream);
				deployment = repositoryService.createDeployment()
												.addZipInputStream(zip)
												.category(category)
												.deploy();
			} else if (extension.equals("png")) {
				deployment = repositoryService.createDeployment()
												.addInputStream(fileName, fileInputStream)
												.category(category)
												.deploy();
			} else if (extension.equals("bpmn")) {
				deployment = repositoryService.createDeployment()
												.addInputStream(fileName, fileInputStream)
												.category(category)
												.deploy();
			} else if (fileName.indexOf("bpmn20.xml") != -1) { 
				String baseName = FilenameUtils.getBaseName(fileName).substring(0, fileName.indexOf(".bpmn20.xml"));
				deployment = repositoryService.createDeployment()
												.addInputStream(baseName + ".bpmn",fileInputStream)
												.category(category)
												.deploy();
			} else {
				throw new ServiceException("","不支持的文件类型", false);
			}

			if (deployment != null) {
				resMsg = "部署成功！";
			}else{
				resMsg = "部署失败！";
			}

		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("","部署本地流程发生异常", false);
		}
		return resMsg;
	}

	/*
	 * 挂起、激活流程
	 * @see com.tjhq.activiti.service.IActProcessService#updateState(java.lang.String, java.lang.String)
	 */
	@Transactional(readOnly=false,rollbackFor=Exception.class)
	public String updateState(String state, String procDefId) throws ServiceException {
		String resMsg = "";
		if(StringUtils.isBlank(procDefId)){
			throw new ServiceException("","挂起/激活流程定义发生异常,流程定义ID为空", false);
		}
		try {
			if (state.equals("active")) {
				repositoryService.activateProcessDefinitionById(procDefId, false,null);
				resMsg = "已激活ID为[" + procDefId + "]的流程定义。";
			} else if (state.equals("suspend")) {
				repositoryService.suspendProcessDefinitionById(procDefId, false,null);
				resMsg = "已挂起ID为[" + procDefId + "]的流程定义。";
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("","挂起/激活流程定义发生异常", false);
		}
		return resMsg;
	}

	/*
	 * 删除流程（含级联操作）
	 * @see com.tjhq.activiti.service.IActProcessService#deleteDeployment(java.lang.String)
	 */
	@Transactional(readOnly=false,rollbackFor=Exception.class)
	public String deleteDeployment(String deploymentId) throws ServiceException {
		String resMsg = "";
		if(StringUtils.isBlank(deploymentId)){
			throw new ServiceException("","删除流程定义发生异常,部署ID为空", false);
		}
		try {
			repositoryService.deleteDeployment(deploymentId, true);
			resMsg = "已成功移除流程定义";
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("","删除流程定义发生异常，该流程下可能存在未完成的任务", false);
		}
		return resMsg;
	}

	/*
	 * 转换为模型
	 * @see com.tjhq.activiti.service.IActProcessService#convertToModel(java.lang.String)
	 */
	@Transactional(readOnly=false,rollbackFor=Exception.class)
	public String convertToModel(String procDefId) throws ServiceException {
		String resMsg = "";
		
		if(StringUtils.isBlank(procDefId)){
			throw new ServiceException("","转换流程定义发生异常,流程定义ID为空", false);
		}

		try {
			ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
																	.processDefinitionId(procDefId)
																	.singleResult();
			if(processDefinition!=null){
				String deploymentId = processDefinition.getDeploymentId();
				String resourceName = processDefinition.getResourceName();
				String name = processDefinition.getName();
				
				InputStream bpmnStream = repositoryService.getResourceAsStream(deploymentId,resourceName);
				XMLInputFactory xif = XMLInputFactory.newInstance();
				InputStreamReader in = new InputStreamReader(bpmnStream, "UTF-8");
				XMLStreamReader xtr = xif.createXMLStreamReader(in);
				BpmnModel bpmnModel = new BpmnXMLConverter().convertToBpmnModel(xtr);

				BpmnJsonConverter converter = new BpmnJsonConverter();
				ObjectNode modelNode = converter.convertToJson(bpmnModel);
				Model modelData = repositoryService.newModel();
				modelData.setKey(processDefinition.getKey());
				modelData.setName(name+"模型");
				modelData.setCategory(processDefinition.getCategory());
				modelData.setDeploymentId(deploymentId);
				modelData.setVersion(Integer.parseInt(String.valueOf(repositoryService
						.createModelQuery().modelKey(modelData.getKey()).count() + 1)));

				ObjectNode modelObjectNode = new ObjectMapper().createObjectNode();
				modelObjectNode.put(ModelDataJsonConstants.MODEL_NAME,processDefinition.getName());
				modelObjectNode.put(ModelDataJsonConstants.MODEL_REVISION,modelData.getVersion());
				modelObjectNode.put(ModelDataJsonConstants.MODEL_DESCRIPTION,processDefinition.getDescription());
				modelData.setMetaInfo(modelObjectNode.toString());

				repositoryService.saveModel(modelData);

				repositoryService.addModelEditorSource(modelData.getId(), modelNode.toString().getBytes("utf-8"));
				
				resMsg = "转换成功！模型ID："+modelData.getId()+"模型名称："+modelData.getId();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("","转换流程定义发生异常", false);
		}
		return resMsg;
	}
	
}
