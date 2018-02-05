package com.tjhq.activiti.service.impl;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

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
import org.activiti.engine.repository.ModelQuery;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tjhq.activiti.service.IActModelService;
import com.tjhq.commons.exception.ServiceException;

/**
 * 
 * @author liukai
 *
 */

@Service(value="actModelService")
@Transactional(readOnly=true)
public class ActModelServiceImpl implements IActModelService {
	
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
	
	private Logger logger = LogManager.getLogger(ActModelServiceImpl.class);
	
	/*
	 * 查询流程模型列表
	 * @see com.tjhq.activiti.service.IWorkflowService#list(java.lang.String, java.lang.String)
	 */
	public List<Model> list(String key,String name) throws ServiceException {
		List<Model> list = new ArrayList<Model>();
		try {
			ModelQuery modelQuery = repositoryService.createModelQuery().latestVersion();
			if(StringUtils.isNotEmpty(key) && StringUtils.isNotEmpty(name)){
				modelQuery = modelQuery.modelKey(key).modelNameLike("%"+name+"%");
			}else if(StringUtils.isNotEmpty(key) || StringUtils.isNotEmpty(name)){
				if(StringUtils.isNotEmpty(key)){
					modelQuery = modelQuery.modelKey(key);
				}else{
					modelQuery = modelQuery.modelNameLike("%"+name+"%");
				}
			}
			list = modelQuery.orderByLastUpdateTime().desc().list();
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("ACT_ERR_28", "查询流程模型列表发生异常", false);
		}
		return list;
	}
	
	/*
	 * 创建流程模型
	 * @see com.tjhq.activiti.service.IWorkflowService#create(java.lang.String, java.lang.String, java.lang.String)
	 */
	@SuppressWarnings("deprecation")
	@Transactional(readOnly=false,rollbackFor=Exception.class)
	public Model create(String name, String key, String description) throws ServiceException{
		Model modelData = null;
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			ObjectNode editorNode = objectMapper.createObjectNode();
			editorNode.put("id", "canvas");
			editorNode.put("resourceId", "canvas");
			ObjectNode stencilSetNode = objectMapper.createObjectNode();
			stencilSetNode.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
			editorNode.put("stencilset", stencilSetNode);
			modelData = repositoryService.newModel();
			 
			ObjectNode modelObjectNode = objectMapper.createObjectNode();
			modelObjectNode.put(ModelDataJsonConstants.MODEL_NAME, name);
			modelObjectNode.put(ModelDataJsonConstants.MODEL_REVISION, 1);
			description = StringUtils.defaultString(description);
			modelObjectNode.put(ModelDataJsonConstants.MODEL_DESCRIPTION, description);
			modelData.setMetaInfo(modelObjectNode.toString());
			modelData.setName(name);
			modelData.setCategory(description);
			modelData.setKey(StringUtils.defaultString(key));
			 
			repositoryService.saveModel(modelData);
			repositoryService.addModelEditorSource(modelData.getId(), editorNode.toString().getBytes("utf-8"));
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServiceException("ACT_ERR_27", "创建流程模型发生异常", false);
		}
		return modelData;
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
			String candidateStarterGroups = editorNode.get("properties").get("candidatestartergroups").textValue();
			String candidateStarterUsers = editorNode.get("properties").get("candidatestarterusers").textValue();
			if(StringUtils.isNotEmpty(candidateStarterGroups) && StringUtils.isNotEmpty(candidateStarterUsers)){
				throw new ServiceException("", "此流程未设置流程开启人，请先设置再部署！模型ID："+id, false);
			}
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
				String processDefinitionId = processDefinition.getId();
				repositoryService.setProcessDefinitionCategory(processDefinitionId, modelData.getCategory());
				if(candidateStarterGroups!=null && StringUtils.isNotEmpty(candidateStarterGroups)){
					String[] groupIds = candidateStarterGroups.split(",");
					for(String groupId : groupIds){
						repositoryService.addCandidateStarterGroup(processDefinitionId, groupId);
					}
				}
				if(candidateStarterUsers!=null && StringUtils.isNotEmpty(candidateStarterUsers)){
					String[] userIds = candidateStarterUsers.split(",");
					for(String userId : userIds){
						repositoryService.addCandidateStarterUser(processDefinitionId, userId);
					}
				}
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
			
			String filename = new String((bpmnModel.getMainProcess().getName() + ".bpmn").getBytes("GBK"), "ISO-8859-1");
			response.setContentType("application/force-download");
			response.setHeader("Content-Disposition", "attachment; filename=" + filename);
			//response.setHeader("Pragma", "No-cache");
			//response.setHeader("Expires", "0");

			ByteArrayInputStream in = new ByteArrayInputStream(bpmnBytes);
			ServletOutputStream out = response.getOutputStream();
			IOUtils.copy(in, out);
			out.flush();
			out.close();
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
	
}
