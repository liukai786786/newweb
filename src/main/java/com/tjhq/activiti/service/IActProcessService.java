package com.tjhq.activiti.service;

import java.io.InputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import com.tjhq.activiti.po.ActProcessDefinition;
import com.tjhq.commons.exception.ServiceException;
/**
 * 
 * @author liukai
 *
 */
public interface IActProcessService {
	
	/**
	 * 读取资源
	 * @param procDefId
	 * @param resType
	 * @return
	 * @throws ServiceException 
	 */
	InputStream resourceRead(String procDefId, String resType) throws ServiceException;

	/**
	 * 查询流程模型列表
	 * @param selectVersion
	 * @param key
	 * @param name
	 * @return List<ActProcessDefinition>
	 * @throws ServiceException
	 */
	public List<ActProcessDefinition> list(String selectVersion,String key,String name) throws ServiceException;
	
	/**
	 * 导出模型
	 * @param id
	 * @param response
	 * @throws ServiceException
	 */
	public void export(String id, HttpServletResponse response) throws ServiceException;
	
	/**
	 * 删除模型
	 * @param id
	 * @throws ServiceException
	 */
	public void delete(String id) throws ServiceException;

	
	/**
	 * 批量删除模型
	 * @param modelIds
	 * @throws ServiceException
	 */
	void deleteBatch(List<String> modelIds) throws ServiceException;

	/**
	 * 部署本地流程
	 * @param category
	 * @param file
	 * @throws ServiceException
	 */
	String deploy(String category, MultipartFile file) throws ServiceException;

	/**
	 * 激活/挂起流程
	 * @param state
	 * @param procDefId
	 * @return
	 * @throws ServiceException
	 */
	String updateState(String state, String procDefId) throws ServiceException;

	/**
	 * 删除流程（含级联操作）
	 * @param deploymentId
	 * @return
	 * @throws ServiceException
	 */
	String deleteDeployment(String deploymentId) throws ServiceException;

	/**
	 * 转化流程定义为模型
	 * @param procDefId
	 * @return
	 * @throws ServiceException
	 */
	String convertToModel(String procDefId) throws ServiceException;

	
}
