package com.tjhq.activiti.web;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.repository.Model;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tjhq.activiti.service.IActModelService;
import com.tjhq.commons.dto.ResultDTO;
import com.tjhq.commons.exception.ServiceException;

/**
 * 
 * @author liukai
 *
 */
@RestController
@RequestMapping(value="actmodel/")
public class ActModelController {
	
	@Resource(name="actModelService")
	private IActModelService actModelService;

	private Logger logger = LogManager.getLogger(ActModelController.class);
	
	/**
	 * 模型列表
	 * 
	 */
	@RequestMapping(value="list",method = RequestMethod.GET)
	public Object list(String key,String name){
		List<Model> list = null;
		try {
			logger.debug("************* list *************");
			list = actModelService.list(key, name);
		} catch (ServiceException e) {
			e.printStackTrace();
		}
		return list;
	}
	/**
	 * 创建流程模型
	 * @param name
	 * @param key
	 * @param category
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="create",method = RequestMethod.POST)
	public String create(@RequestParam("name") String name, @RequestParam("key") String key,
			@RequestParam("category") String category, HttpServletRequest request, HttpServletResponse response){
		String id = "";
		try {
			logger.debug("************* create activiti model editor start *************");
			Model modelData = actModelService.create(name, key, category);
//			response.sendRedirect(request.getContextPath() + "/act/modeler.html?modelId=" + modelData.getId());
			id = modelData.getId();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return id;
	}
	
	/**
	 * 根据模型部署流程
	 * @param modelId
	 * @return ResultDTO
	 */
	@RequestMapping(value="{modelId}/deploy",method = RequestMethod.PUT)
	public Object deploy(@PathVariable String modelId) throws ServiceException{
		ResultDTO resDTO = null;
		try {
			logger.debug("************* deploy bpmn start *************");
			resDTO = new ResultDTO(actModelService.deploy(modelId));
		} catch (ServiceException e) {
			e.printStackTrace();
			resDTO = new ResultDTO(e.getMessage(),e.getCode());
		}
		return resDTO;
	}
	/**
	 * 导出
	 * @param modelId
	 * @return ResultDTO
	 */
	@RequestMapping(value="{modelId}/export",method = RequestMethod.GET)
	public void export(@PathVariable String modelId, HttpServletResponse response) {
		try {
			logger.debug("************* export bpmn start *************");
			actModelService.export(modelId, response);
		} catch (ServiceException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 删除
	 * @param modelId
	 */
	@RequestMapping(value="{modelId}/delete",method = RequestMethod.DELETE)
	public Object delete(@PathVariable String modelId) {
		ResultDTO resDTO = null;
		try {
			logger.debug("************* delete bpmn start *************");
			actModelService.delete(modelId);
			resDTO = new ResultDTO("删除成功");
		} catch (ServiceException e) {
			e.printStackTrace();
			resDTO = new ResultDTO(e.getMessage(),e.getCode());
		}
		return resDTO;
	}
	/**
	 * 删除
	 * @param modelId
	 * @return ResultDTO
	 */
	@RequestMapping(value="deleteBatch",method = RequestMethod.DELETE)
	public Object deleteBatch(@RequestBody List<String> modelIds) {
		ResultDTO resDTO = null;
		try {
			logger.debug("************* deleteBatch  start *************");
			actModelService.deleteBatch(modelIds);
			resDTO = new ResultDTO("删除成功");
		} catch (ServiceException e) {
			e.printStackTrace();
			resDTO = new ResultDTO(e.getMessage(),e.getCode());
		}
		return resDTO;
	}
}
