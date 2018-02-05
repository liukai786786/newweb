package com.tjhq.activiti.web;

import java.io.InputStream;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tjhq.activiti.po.ActProcessDefinition;
import com.tjhq.activiti.service.IActProcessService;
import com.tjhq.commons.dto.ResultDTO;
import com.tjhq.commons.exception.ServiceException;

/**
 * 
 * @author liukai
 *
 */
@RestController
@RequestMapping(value="actprocess/")
public class ActProcessController {
	
	@Resource(name="actProcessService")
	private IActProcessService actProcessService;

	private Logger logger = LogManager.getLogger(ActProcessController.class);
	
	/**
	 * 模型列表
	 * 
	 */
	@RequestMapping(value="list",method = RequestMethod.GET)
	public Object list(String selectVersion,String key,String name){
		List<ActProcessDefinition> list = null;
		try {
			logger.debug("************* list *************");
			list = actProcessService.list(selectVersion,key, name);
		} catch (ServiceException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	/**
	 * 读取资源
	 * @param procDefId  流程定义ID
	 * @param resType 资源类型(xml|image)
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "resource/{procDefId}/{resType}",method = RequestMethod.GET)
	public void resourceRead(@PathVariable String procDefId,@PathVariable String resType,HttpServletResponse response) throws Exception {
		InputStream resourceAsStream = actProcessService.resourceRead(procDefId, resType);
		byte[] b = new byte[1024];
		int len = -1;
		while ((len = resourceAsStream.read(b, 0, 1024)) != -1) {
			response.getOutputStream().write(b, 0, len);
		}
		response.getOutputStream().flush();
	}
	
	
	@RequestMapping(value = "deploy",method = RequestMethod.POST)
	public Object deploy(String category, MultipartFile file) throws Exception {
		ResultDTO resDTO = null;
		try {
			logger.debug("************* deploy bpmn start *************");
			resDTO = new ResultDTO(actProcessService.deploy(category, file));
		} catch (ServiceException e) {
			e.printStackTrace();
			resDTO = new ResultDTO(e.getMessage(),e.getCode());
		}
		return resDTO;
	}
	
	/**
	 * 挂起、激活流程
	 * @param state
	 * @param procDefId
	 * @return
	 */
	@RequestMapping(value = "update/{procDefId}/{state}",method=RequestMethod.PUT)
	public Object updateState(@PathVariable String state, @PathVariable String procDefId) {
		ResultDTO resDTO = null;
		try {
			logger.debug("************* update bpmn start *************");
			resDTO = new ResultDTO(actProcessService.updateState(state, procDefId));
		} catch (ServiceException e) {
			e.printStackTrace();
			resDTO = new ResultDTO(e.getMessage(),e.getCode());
		}
		return resDTO;
	}
	
	/**
	 * 删除部署的流程，级联删除流程实例
	 * @param deploymentId 流程部署ID
	 */
	@RequestMapping(value = "{deploymentId}/remove",method=RequestMethod.DELETE)
	public Object delete(@PathVariable String deploymentId) {
		ResultDTO resDTO = null;
		try {
			logger.debug("************* remove bpmn start *************");
			resDTO = new ResultDTO(actProcessService.deleteDeployment(deploymentId));
		} catch (ServiceException e) {
			e.printStackTrace();
			resDTO = new ResultDTO(e.getMessage(),e.getCode());
		}
		return resDTO;
	}
	
	/**
	 * 将部署的流程转换为模型
	 * @param procDefId
	 * @param redirectAttributes
	 * @return
	 */
	@RequestMapping(value = "{procDefId}/convertToModel",method=RequestMethod.PUT)
	public Object convertToModel (@PathVariable String procDefId){
		ResultDTO resDTO = null;
		try {
			logger.debug("************* remove bpmn start *************");
			resDTO = new ResultDTO(actProcessService.convertToModel(procDefId));
		} catch (ServiceException e) {
			e.printStackTrace();
			resDTO = new ResultDTO(e.getMessage(),e.getCode());
		}
		return resDTO;
	}
}
