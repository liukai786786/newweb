package com.tjhq.activiti.service;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.repository.Model;

import com.tjhq.commons.exception.ServiceException;
/**
 * 
 * @author liukai
 *
 */
public interface IActModelService {
	
	/**
	 * 创建流程模型
	 * @param name
	 * @param key
	 * @param description
	 * @return
	 * @throws ServiceException
	 */
	Model create(String name, String key, String description) throws ServiceException;

	/**
	 * 根据模型部署流程
	 * @param id
	 * @return
	 * @throws ServiceException
	 */
	String deploy(String id) throws ServiceException;
	
	/**
	 * 查询流程模型列表
	 * @param key
	 * @param name
	 * @return
	 * @throws ServiceException
	 */
	public List<Model> list(String key,String name) throws ServiceException;
	
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
	
}
