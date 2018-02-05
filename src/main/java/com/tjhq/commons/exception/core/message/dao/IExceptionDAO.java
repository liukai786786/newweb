package com.tjhq.commons.exception.core.message.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.tjhq.commons.core.mybatis.mapper.SuperMapper;
import com.tjhq.commons.exception.core.message.po.ExceptionInfoPO;

public interface IExceptionDAO extends SuperMapper {
	
	public List<ExceptionInfoPO> loadException();
	
	public ExceptionInfoPO loadExceptionByCode(@Param("code")String code);
}
