package com.tjhq.commons.exception.core.message;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;

import com.tjhq.commons.exception.core.code.ExceptionCode;
import com.tjhq.commons.exception.core.message.po.ExceptionInfoPO;
import com.tjhq.commons.exception.core.message.service.IExceptionService;

public class ExceptionMessage {
	
	private static IExceptionService exceptionService;

	public IExceptionService getExceptionService() {
		return exceptionService;
	}

	@SuppressWarnings("static-access")
	public void setExceptionService(IExceptionService exceptionService) {
		this.exceptionService = exceptionService;
	}

	private static Map<String, String> exceptionMessage = null;

	@PostConstruct
	public void initExceptionMessage() {
		exceptionMessage = new HashMap<String, String>();
		loadException();
	}
	
	public static String getMessage(String code) {
		code = getExceptionCode(code);
		if (exceptionMessage.containsKey(code)) {
			return exceptionMessage.get(code);
		}
		return loadException(code);
	}
	
	private static String getExceptionCode(String code) {
		if (StringUtils.isEmpty(code) || code.length() > 10) {
			code = ExceptionCode.ERR_00000;
		}
		return code;
	}
	
	public static void reloadException() {
		exceptionMessage = new HashMap<String, String>();
		loadException();
	}
	
	public static void reloadException(String code) {
		code = getExceptionCode(code);
		if (exceptionMessage.containsKey(code)) {
			exceptionMessage.remove(code);
		}
		loadException(code);
	}
	
	private static void loadException() {
		List<ExceptionInfoPO> exceptionList = null;
		try {
			exceptionList = exceptionService.loadException();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if (exceptionList == null) {
			return;
		}
		
		for (ExceptionInfoPO infoPO : exceptionList) {
			exceptionMessage.put(infoPO.getCode(), infoPO.toString());
		}
	}
	
	private static String loadException(String code) {
		ExceptionInfoPO exceptionInfoPO = null;
		try {
			exceptionInfoPO = exceptionService.loadException(code);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if (exceptionInfoPO == null) {
			return "";
		}
		
		exceptionMessage.put(exceptionInfoPO.getCode(), exceptionInfoPO.toString());
		
		return exceptionInfoPO.toString();
	}
	
	
	
	
}
