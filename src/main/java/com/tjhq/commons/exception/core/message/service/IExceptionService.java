package com.tjhq.commons.exception.core.message.service;

import java.util.List;

import com.tjhq.commons.exception.core.message.po.ExceptionInfoPO;

public interface IExceptionService {
	
	public List<ExceptionInfoPO> loadException() throws Exception;
	
	public ExceptionInfoPO loadException(String code) throws Exception;
}
